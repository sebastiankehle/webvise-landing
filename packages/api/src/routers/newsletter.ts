import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail, setContact } from "../email/resend";
import { emailLayout, s, unsubscribeUrl } from "../email/template";
import { rateLimitedProcedure, router } from "../index";

function buildWelcomeHtml(email: string) {
	return emailLayout({
		label: "Newsletter",
		unsubscribeEmail: email,
		content: `
      <h1 style="${s.h1}">Welcome to the webvise newsletter</h1>
      <p style="${s.p}">You're in. We'll send you occasional updates on web performance, modern development, and what we're building.</p>
      <p style="${s.p}">No spam, no fluff. Unsubscribe anytime by replying to any email.</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">If you have a project in mind, we'd love to hear about it.</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">Book a Free Call</a>
      </div>`,
	});
}

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
			const contactResult = await setContact({
				label: "newsletter",
				email: input.email,
				subscribed: true,
			});

			if (!contactResult.ok) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						contactResult.reason === "not_configured"
							? "Newsletter service not configured"
							: "Failed to subscribe",
				});
			}

			const emailResult = await sendEmail({
				label: "newsletter-welcome",
				from: "webvise <hello@webvise.io>",
				to: input.email,
				subject: "Welcome to the webvise newsletter",
				headers: {
					"List-Unsubscribe": `<${unsubscribeUrl(input.email)}>`,
					"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				},
				html: buildWelcomeHtml(input.email),
				text: [
					"Welcome to the webvise newsletter",
					"",
					"You're in. We'll send you occasional updates on web performance, modern development, and what we're building.",
					"",
					"No spam, no fluff. Unsubscribe anytime by replying to any email.",
					"",
					"If you have a project in mind, we'd love to hear about it.",
					"Book a free call: https://cal.com/webvise",
					"",
					"- The webvise team",
				].join("\n"),
			});
			if (!emailResult.ok) {
				console.error(
					`[email:newsletter-welcome] failed to send welcome email to ${input.email}:`,
					emailResult.reason,
					emailResult.details ?? ""
				);
			}

			return { success: true };
		}),
});
