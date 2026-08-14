import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TRPCError } from "@trpc/server";
import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
import { z } from "zod";
import { sendEmail } from "../email/resend";
import { emailLayout, s } from "../email/template";
import { rateLimitedProcedure, router } from "../index";

const PDF_EXTENSION_PATTERN = /\.pdf$/;

// Decks ship in German and English; German pages send the German PDF,
// every other locale the English one.
function deckReport(
	slug: string,
	file: string,
	titleDe: string,
	titleEn: string
) {
	const base = file.replace(PDF_EXTENSION_PATTERN, "");
	return {
		[`deck-${slug}`]: {
			de: `reports/decks/${file}`,
			en: `reports/decks/en/${base}_EN.pdf`,
			subject: `webvise Service-Deck: ${titleDe}`,
			subjectEn: `webvise service deck: ${titleEn}`,
		},
	};
}

const REPORTS: Record<
	string,
	{ de: string; en: string; subject: string; subjectEn?: string }
> = {
	"ai-coding-tools-deep-dive": {
		de: "reports/ai-coding-tools-deep-dive-de.pdf",
		en: "reports/ai-coding-tools-deep-dive-en.pdf",
		subject: "AI, Agents & AI Coding Tools - Deep Dive Report",
	},
	...deckReport(
		"leistungsuebersicht",
		"00_WEBVISE_Leistungsuebersicht.pdf",
		"Leistungsübersicht",
		"Service Overview"
	),
	...deckReport(
		"landing-pages",
		"01_WEBVISE_Launch_Landing-Pages.pdf",
		"Landing Pages und Launch-Seiten",
		"Landing Pages & Launch Sites"
	),
	...deckReport(
		"mvp-development",
		"02_WEBVISE_Launch_MVPs-und-Produktprototypen.pdf",
		"MVPs und Produktprototypen",
		"MVPs & Product Prototypes"
	),
	...deckReport(
		"website-to-app-upgrades",
		"03_WEBVISE_Launch_Website-Workflows.pdf",
		"Website-Workflows",
		"Website Workflows"
	),
	...deckReport(
		"wordpress-migration",
		"04_WEBVISE_Launch_WordPress-und-Legacy-Migrationen.pdf",
		"WordPress- und Legacy-Migrationen",
		"WordPress & Legacy Migrations"
	),
	...deckReport(
		"internal-tools-dashboards",
		"05_WEBVISE_Operate_Interne-Tools-und-Dashboards.pdf",
		"Interne Tools und Dashboards",
		"Internal Tools & Dashboards"
	),
	...deckReport(
		"client-portals-business-apps",
		"06_WEBVISE_Operate_Kundenportale-und-Geschaeftsanwendungen.pdf",
		"Kundenportale und Geschäftsanwendungen",
		"Client Portals & Business Applications"
	),
	...deckReport(
		"booking-event-platforms",
		"07_WEBVISE_Operate_Booking-und-Event-Plattformen.pdf",
		"Booking- und Event-Plattformen",
		"Booking & Event Platforms"
	),
	...deckReport(
		"full-stack-applications",
		"08_WEBVISE_Operate_Individuelle-Business-Anwendungen.pdf",
		"Individuelle Business-Anwendungen",
		"Custom Business Applications"
	),
	...deckReport(
		"ai-consulting",
		"09_WEBVISE_Automate_KI-Audit-und-Beratung.pdf",
		"KI-Audit und Beratung",
		"AI Audit & Consulting"
	),
	...deckReport(
		"company-brain-memory-systems",
		"10_WEBVISE_Automate_Company-Brain-Systeme.pdf",
		"Company-Brain-Systeme",
		"Company Brain Systems"
	),
	...deckReport(
		"ai-automation",
		"11_WEBVISE_Automate_KI-Workflow-Automation.pdf",
		"KI-Workflow-Automation",
		"AI Workflow Automation"
	),
	...deckReport(
		"agentic-workflow-automation",
		"12_WEBVISE_Automate_KI-Agenten-mit-Review-Gates.pdf",
		"KI-Agenten mit Review-Gates",
		"AI Agents with Review Gates"
	),
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
				path: z.string().startsWith("/").max(300).optional(),
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
