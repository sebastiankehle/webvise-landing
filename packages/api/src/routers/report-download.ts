import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail } from "../email/resend";
import { emailLayout, s } from "../email/template";
import { rateLimitedProcedure, router } from "../index";

const REPORTS: Record<string, { de: string; en: string; subject: string }> = {
	"ai-coding-tools-deep-dive": {
		de: "reports/ai-coding-tools-deep-dive-de.pdf",
		en: "reports/ai-coding-tools-deep-dive-en.pdf",
		subject: "AI, Agents & AI Coding Tools - Deep Dive Report",
	},
};

const reportDownloadProcedure = rateLimitedProcedure({
	name: "report-download",
	maxRequests: 3,
	windowMs: 60_000,
});

export const reportDownloadRouter = router({
	request: reportDownloadProcedure
		.input(
			z.object({
				email: z.string().email().max(200),
				reportId: z.string().max(100),
				locale: z.string().max(5).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const report = REPORTS[input.reportId];
			if (!report) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Report not found",
				});
			}

			const lang = input.locale === "de" ? "de" : "en";
			const pdfPath = join(process.cwd(), "public", report[lang]);
			const pdfContent = readFileSync(pdfPath).toString("base64");
			const filename = `${input.reportId}-${lang}.pdf`;

			const result = await sendEmail({
				label: "report-download",
				from: "webvise <noreply@webvise.io>",
				to: input.email,
				subject: report.subject,
				html: emailLayout({
					label: "Report",
					content: `
      <h1 style="${s.h1}">
        ${lang === "de" ? "Ihr Report ist da." : "Your report is ready."}
      </h1>
      <p style="${s.p}">
        ${lang === "de" ? "Vielen Dank für Ihr Interesse. Den Report finden Sie im Anhang dieser E-Mail." : "Thank you for your interest. You'll find the report attached to this email."}
      </p>
      <p style="${s.p}">
        ${lang === "de" ? "Bei Fragen stehe ich gerne zur Verfügung." : "If you have any questions, feel free to reach out."}
      </p>
      <hr style="${s.hr}">
      <p style="margin:0;font-size:13px;color:#1a1a1a;font-weight:500">Sebastian Kehle</p>
      <p style="margin:4px 0 0;font-size:12px;color:#7a7a7a">sebastian.kehle@webvise.io</p>`,
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
