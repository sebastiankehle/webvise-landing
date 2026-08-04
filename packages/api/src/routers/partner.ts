import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail } from "../email/resend";
import { emailLayout, escapeHtml, s, tableRow } from "../email/template";
import { rateLimitedProcedure, router } from "../index";

const INTEREST_LABELS: Record<string, string> = {
	network: "Join the network (work on webvise projects)",
	refer: "Refer clients (commission)",
	bring: "Bring webvise into their own projects",
};

function buildPartnerHtml(data: {
	name: string;
	email: string;
	discipline: string;
	linkedin?: string;
	x?: string;
	site?: string;
	interest: string;
	message?: string;
	timestamp: string;
}) {
	const name = escapeHtml(data.name);
	const email = escapeHtml(data.email);
	const linkedin = data.linkedin ? escapeHtml(data.linkedin) : null;
	const x = data.x ? escapeHtml(data.x) : null;
	const site = data.site ? escapeHtml(data.site) : null;
	const message = data.message ? escapeHtml(data.message) : null;
	const interestLabel = escapeHtml(
		INTEREST_LABELS[data.interest] ?? data.interest
	);

	const rows = [
		tableRow("Name", name),
		tableRow(
			"Email",
			`<a href="mailto:${email}" style="${s.link}">${email}</a>`
		),
		tableRow("Discipline", escapeHtml(data.discipline)),
		linkedin
			? tableRow(
					"LinkedIn",
					`<a href="${linkedin}" style="${s.link}">${linkedin}</a>`
				)
			: "",
		x ? tableRow("X", `<a href="${x}" style="${s.link}">${x}</a>`) : "",
		site
			? tableRow("Website", `<a href="${site}" style="${s.link}">${site}</a>`)
			: "",
		tableRow("Interest", interestLabel),
		tableRow("Received", data.timestamp),
	].join("");

	return emailLayout({
		label: "Partner Application",
		content: `
      <h1 style="${s.h1}">${name} · ${escapeHtml(data.discipline)}</h1>
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
        <a href="mailto:${email}?subject=Re: Your webvise partner application" style="${s.button}">Reply to ${escapeHtml(data.name.split(" ")[0] ?? data.name)}</a>
      </div>`,
	});
}

const partnerProcedure = rateLimitedProcedure({
	name: "partner",
	maxRequests: 3,
	windowMs: 60_000,
});

// Submissions faster than this are almost certainly bots, not humans typing.
const MIN_FILL_MS = 2000;

export const partnerRouter = router({
	submit: partnerProcedure
		.input(
			z.object({
				name: z.string().min(1).max(200),
				email: z.string().email().max(200),
				discipline: z.string().min(1).max(200),
				linkedin: z.string().max(500).optional(),
				x: z.string().max(500).optional(),
				site: z.string().max(500).optional(),
				interest: z.enum(["network", "refer", "bring"]),
				message: z.string().max(5000).optional(),
				// Anti-spam: honeypot field + time-to-submit. Never set by real users.
				company: z.string().max(200).optional(),
				elapsedMs: z.number().nonnegative().optional(),
			})
		)
		.mutation(async ({ input }) => {
			// Honeypot tripped or form submitted impossibly fast: silently accept
			// and discard so the bot believes it succeeded and stops retrying.
			if (
				input.company ||
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
			const interestLabel = INTEREST_LABELS[input.interest] ?? input.interest;

			const result = await sendEmail({
				label: "partner",
				from: "webvise <noreply@webvise.io>",
				to: contactEmail,
				replyTo: input.email,
				subject: `Partner application: ${input.name} - ${input.discipline}`,
				html: buildPartnerHtml({
					name: input.name,
					email: input.email,
					discipline: input.discipline,
					linkedin: input.linkedin,
					x: input.x,
					site: input.site,
					interest: input.interest,
					message: input.message,
					timestamp,
				}),
				text: [
					`From: ${input.name} <${input.email}>`,
					`Discipline: ${input.discipline}`,
					input.linkedin ? `LinkedIn: ${input.linkedin}` : null,
					input.x ? `X: ${input.x}` : null,
					input.site ? `Website: ${input.site}` : null,
					`Interest: ${interestLabel}`,
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
