import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TRPCError } from "@trpc/server";
import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
import { z } from "zod";
import { sendEmail } from "../email/resend";
import { emailLayout, s } from "../email/template";
import { rateLimitedProcedure, router } from "../index";
import { REPORTS } from "../reports";

const reportDownloadProcedure = rateLimitedProcedure({
	name: "report-download",
	maxRequests: 3,
	windowMs: 60_000,
});

// Submissions faster than this are almost certainly bots, not humans typing.
const MIN_FILL_MS = 2000;

// Honeypot tripped or form submitted impossibly fast.
function isBotSubmission(input: { website?: string; elapsedMs: number }) {
	return Boolean(input.website) || input.elapsedMs < MIN_FILL_MS;
}

export const reportDownloadRouter = router({
	request: reportDownloadProcedure
		.input(
			z.object({
				email: z.string().email().max(200),
				reportId: z.string().max(100),
				locale: z.string().max(5).optional(),
				path: z.string().startsWith("/").max(300).optional(),
				// Anti-spam: honeypot field + time-to-submit. Never set by real users.
				website: z.string().max(200).optional(),
				// Required: this endpoint mails a file to any address, so a request
				// that skips the form must not send.
				elapsedMs: z.number().nonnegative(),
			})
		)
		.mutation(async ({ input }) => {
			// Silently accept and discard so the bot believes it succeeded and
			// stops retrying.
			if (isBotSubmission(input)) {
				return { success: true };
			}

			const report = Object.hasOwn(REPORTS, input.reportId)
				? REPORTS[input.reportId]
				: undefined;
			if (!report) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Report not found",
				});
			}

			const email = input.email.trim().toLowerCase();
			const isDeck = input.reportId.startsWith("deck-");

			// Deck requests double as lead capture for the outbound funnel.
			// Source tracking must not block the send itself.
			if (isDeck) {
				try {
					const topic = input.reportId.slice("deck-".length);
					await db.insert(leadEvent).values({
						email,
						eventType: "deck_request",
						placement: "deck_gate",
						path: input.path ?? `/decks/${topic}`,
						topic,
					});
				} catch (err) {
					console.error(
						"[report-download:request] failed to store deck lead:",
						err instanceof Error ? err.message : err
					);
				}
			}

			const lang = input.locale === "de" ? "de" : "en";
			const pdfPath = join(process.cwd(), "public", report[lang]);
			const pdfContent = readFileSync(pdfPath).toString("base64");
			const filename = isDeck
				? (report[lang].split("/").pop() ?? `${input.reportId}.pdf`)
				: `${input.reportId}-${lang}.pdf`;

			const result = await sendEmail({
				label: "report-download",
				from: "webvise <noreply@webvise.io>",
				to: email,
				subject:
					lang === "de" ? report.subject : (report.subjectEn ?? report.subject),
				html: emailLayout({
					label: isDeck ? "Service-Deck" : "Report",
					content: `
      <h1 style="${s.h1}">
        ${(() => {
					if (isDeck) {
						return lang === "de"
							? "Ihr Service-Deck ist da."
							: "Your service deck is ready.";
					}
					return lang === "de" ? "Ihr Report ist da." : "Your report is ready.";
				})()}
      </h1>
      <p style="${s.p}">
        ${(() => {
					if (isDeck) {
						return lang === "de"
							? "Vielen Dank für Ihr Interesse. Das Deck finden Sie im Anhang dieser E-Mail."
							: "Thank you for your interest. You'll find the deck attached to this email.";
					}
					return lang === "de"
						? "Vielen Dank für Ihr Interesse. Den Report finden Sie im Anhang dieser E-Mail."
						: "Thank you for your interest. You'll find the report attached to this email.";
				})()}
      </p>
      <p style="${s.p}">
        ${lang === "de" ? "Bei Fragen stehe ich gerne zur Verfügung." : "If you have any questions, feel free to reach out."}
      </p>
      <hr style="${s.hr}">
      <p style="margin:0;font-size:13px;color:#0e1217;font-weight:500">Sebastian Kehle</p>
      <p style="margin:4px 0 0;font-size:12px;color:#525960">sebastian.kehle@webvise.io</p>`,
				}),
				attachments: [{ filename, content: pdfContent }],
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
