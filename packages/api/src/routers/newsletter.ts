import { TRPCError } from "@trpc/server";
import { db } from "@webvise-app/db";
import {
	leadEvent,
	newsletterSubscriber,
} from "@webvise-app/db/schema/newsletter";
import { sql } from "drizzle-orm";
import { z } from "zod";
import {
	buildNewsletterConfirmationHtml,
	NEWSLETTER_CONFIRMATION_SUBJECT,
	newsletterConfirmationText,
} from "../email/newsletter";
import { sendEmail } from "../email/resend";
import { rateLimitedProcedure, router } from "../index";

const newsletterProcedure = rateLimitedProcedure({
	name: "newsletter",
	maxRequests: 3,
	windowMs: 60_000,
});

export const newsletterRouter = router({
	subscribe: newsletterProcedure
		.input(
			z.object({
				email: z.string().email().max(200),
				// Optional so stale client bundles deployed before source tracking keep working.
				placement: z.enum(["footer", "blog_article"]).optional(),
				path: z.string().startsWith("/").max(300).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const email = input.email.trim().toLowerCase();
			const placement = input.placement ?? "unknown";
			const path = input.path ?? "";
			const topic =
				placement === "blog_article"
					? (path.split("/").filter(Boolean).at(-1) ?? null)
					: null;

			// Source tracking must not block the signup itself.
			try {
				await db
					.insert(newsletterSubscriber)
					.values({ email, placement, path })
					.onConflictDoUpdate({
						target: newsletterSubscriber.email,
						set: { placement, path, updatedAt: new Date() },
						// Confirmed subscribers keep their first-touch source.
						setWhere: sql`${newsletterSubscriber.status} = 'pending'`,
					});
			} catch (err) {
				console.error(
					"[newsletter:subscribe] failed to store signup source:",
					err instanceof Error ? err.message : err
				);
			}

			try {
				await db.insert(leadEvent).values({
					email,
					eventType: "newsletter_signup",
					placement,
					path,
					topic,
				});
			} catch (err) {
				console.error(
					"[newsletter:subscribe] failed to store interest event:",
					err instanceof Error ? err.message : err
				);
			}

			const emailResult = await sendEmail({
				label: "newsletter-confirmation",
				from: "webvise <hello@webvise.io>",
				to: email,
				subject: NEWSLETTER_CONFIRMATION_SUBJECT,
				html: buildNewsletterConfirmationHtml(email),
				text: newsletterConfirmationText(email),
			});
			if (!emailResult.ok) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						emailResult.reason === "not_configured"
							? "Newsletter service not configured"
							: "Failed to send confirmation email",
				});
			}

			return { success: true };
		}),
});
