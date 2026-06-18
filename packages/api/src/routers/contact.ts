import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail } from "../email/resend";
import { c, emailLayout, escapeHtml, s, tableRow } from "../email/template";
import { rateLimitedProcedure, router } from "../index";

const SERVICE_LABELS: Record<string, string> = {
	"landing-pages": "Landing Pages",
	"wordpress-migration": "WordPress Migration",
	"ai-consulting": "AI Consulting",
	"mvp-development": "MVP Development",
	"ai-automation": "AI Automation",
	"full-stack-applications": "Full-Stack Applications",
};

function buildContactHtml(data: {
	name: string;
	email: string;
	company?: string;
	service?: string;
	message?: string;
	timestamp: string;
}) {
	const name = escapeHtml(data.name);
	const email = escapeHtml(data.email);
	const company = data.company ? escapeHtml(data.company) : undefined;
	const message = data.message ? escapeHtml(data.message) : null;
	const serviceLabel = data.service
		? escapeHtml(SERVICE_LABELS[data.service] ?? data.service)
		: null;

	const rows = [
		tableRow("Name", name),
		tableRow(
			"Email",
			`<a href="mailto:${email}" style="${s.link}">${email}</a>`
		),
		company ? tableRow("Company", company) : "",
		serviceLabel ? tableRow("Service", serviceLabel) : "",
		tableRow("Received", data.timestamp),
	].join("");

	return emailLayout({
		label: "New Inquiry",
		content: `
      <h1 style="${s.h1}">${name}${company ? ` · ${company}` : ""}</h1>
      ${serviceLabel ? `<p style="${s.label};color:${c.brand};margin-bottom:20px">${serviceLabel}</p>` : '<div style="margin-bottom:20px"></div>'}
      <table style="border-collapse:collapse;width:100%">${rows}</table>
      ${
				message
					? `
      <hr style="${s.hr}">
      <p style="${s.label}">Message</p>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap">${message}</p>`
					: ""
			}
      <div style="margin:24px 0 0">
        <a href="mailto:${email}?subject=Re: Your webvise inquiry" style="${s.button}">Reply to ${escapeHtml(data.name.split(" ")[0] ?? data.name)}</a>
      </div>`,
	});
}

const contactProcedure = rateLimitedProcedure({
	name: "contact",
	maxRequests: 3,
	windowMs: 60_000,
});

// Submissions faster than this are almost certainly bots, not humans typing.
const MIN_FILL_MS = 2000;

export const contactRouter = router({
	submit: contactProcedure
		.input(
			z.object({
				name: z.string().min(1).max(200),
				email: z.string().email().max(200),
				company: z.string().max(200).optional(),
				service: z.string().max(100).optional(),
				message: z.string().max(5000).optional(),
				// Anti-spam: honeypot field + time-to-submit. Never set by real users.
				website: z.string().max(200).optional(),
				elapsedMs: z.number().nonnegative().optional(),
			})
		)
		.mutation(async ({ input }) => {
			// Honeypot tripped or form submitted impossibly fast: silently accept
			// and discard so the bot believes it succeeded and stops retrying.
			if (
				input.website ||
				(input.elapsedMs !== undefined && input.elapsedMs < MIN_FILL_MS)
			) {
				return { success: true };
			}

			const contactEmail = process.env.CONTACT_EMAIL_TO || "mail@webvise.io";
			const timestamp = new Date().toLocaleString("en-GB", {
				dateStyle: "long",
				timeStyle: "short",
				timeZone: "Europe/Berlin",
			});
			const serviceLabel = input.service
				? (SERVICE_LABELS[input.service] ?? input.service)
				: null;

			const subject = [
				input.company ? `${input.name} (${input.company})` : input.name,
				serviceLabel ? `- ${serviceLabel}` : null,
			]
				.filter(Boolean)
				.join(" ");

			const result = await sendEmail({
				label: "contact",
				from: "webvise <noreply@webvise.io>",
				to: contactEmail,
				replyTo: input.email,
				subject,
				html: buildContactHtml({
					name: input.name,
					email: input.email,
					company: input.company,
					service: input.service,
					message: input.message,
					timestamp,
				}),
				text: [
					`From: ${input.name} <${input.email}>`,
					input.company ? `Company: ${input.company}` : null,
					serviceLabel ? `Service: ${serviceLabel}` : null,
					`Received: ${timestamp}`,
					input.message ? `\n${input.message}` : null,
				]
					.filter(Boolean)
					.join("\n"),
			});

			if (!result.ok) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						result.reason === "not_configured"
							? "Email service not configured"
							: "Failed to send email",
				});
			}

			return { success: true };
		}),
});
