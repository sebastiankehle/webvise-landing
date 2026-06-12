import { TRPCError } from "@trpc/server";
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
			})
		)
		.mutation(async ({ input }) => {
			const email = input.email.trim().toLowerCase();

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
