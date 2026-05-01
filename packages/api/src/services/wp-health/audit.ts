import { sendEmail } from "../../email/resend";
import { UrlValidationError, validateUrl } from "../../url-validation";
import { buildAdminHtml, buildProspectHtml } from "./emails";
import {
	extractCoreWebVitals,
	extractTopIssues,
	PSIError,
	type PSIErrorCode,
	type PSIResult,
	runPageSpeedInsights,
} from "./psi";
import { detectTechnology, type TechFlags } from "./tech-detect";

export interface AuditInput {
	email?: string;
	firstName?: string;
	url: string;
}

export interface AuditResultData {
	desktop: { score: number };
	issues: ReturnType<typeof extractTopIssues>;
	migrationEstimate: { min: number; max: number };
	mobile: { score: number };
	projectedScore: number;
	securityFlags: string[];
	url: string;
	vitals: ReturnType<typeof extractCoreWebVitals>;
}

export type AuditError =
	| { kind: "missing_psi_key" }
	| { kind: "invalid_url"; message: string }
	| { kind: "psi_failed"; code: PSIErrorCode }
	| { kind: "psi_null_score" };

export type AuditOutcome =
	| { ok: true; result: AuditResultData }
	| { ok: false; error: AuditError };

function computeProjectedScore(mobileScore: number): number {
	if (mobileScore < 50) {
		return 93;
	}
	if (mobileScore < 70) {
		return 95;
	}
	return 97;
}

function buildSecurityFlags(url: string, tech: TechFlags): string[] {
	const flags: string[] = [];
	if (!url.startsWith("https://")) {
		flags.push("No HTTPS encryption");
	}
	if (tech.isWordPress) {
		flags.push("WordPress plugin ecosystem exposure");
	}
	if (tech.isPHP) {
		flags.push("PHP server-side attack surface");
	}
	return flags;
}

export async function runWpHealthAudit(
	input: AuditInput
): Promise<AuditOutcome> {
	if (!process.env.GOOGLE_PAGESPEED_API_KEY) {
		console.error("Missing GOOGLE_PAGESPEED_API_KEY environment variable");
		return { ok: false, error: { kind: "missing_psi_key" } };
	}

	try {
		await validateUrl(input.url);
	} catch (e) {
		const message =
			e instanceof UrlValidationError
				? e.message
				: "Could not validate the URL.";
		return { ok: false, error: { kind: "invalid_url", message } };
	}

	let mobile: PSIResult;
	let desktop: PSIResult;
	try {
		[mobile, desktop] = await Promise.all([
			runPageSpeedInsights(input.url, "mobile"),
			runPageSpeedInsights(input.url, "desktop"),
		]);
	} catch (psiError) {
		console.error("PageSpeed Insights API failed:", psiError);
		const code =
			psiError instanceof PSIError ? psiError.code : ("unknown" as const);
		return { ok: false, error: { kind: "psi_failed", code } };
	}

	const mobileRawScore =
		mobile.lighthouseResult?.categories?.performance?.score;
	const desktopRawScore =
		desktop.lighthouseResult?.categories?.performance?.score;

	if (mobileRawScore == null || desktopRawScore == null) {
		console.error("PageSpeed returned null scores", {
			url: input.url,
			mobileScore: mobileRawScore,
			desktopScore: desktopRawScore,
		});
		return { ok: false, error: { kind: "psi_null_score" } };
	}

	const mobileScore = Math.round(mobileRawScore * 100);
	const desktopScore = Math.round(desktopRawScore * 100);
	const tech = await detectTechnology(input.url);
	const issues = extractTopIssues(mobile);
	const vitals = extractCoreWebVitals(mobile);
	const projectedScore = computeProjectedScore(mobileScore);
	const securityFlags = buildSecurityFlags(input.url, tech);

	const estimateMin = 750;
	const estimateMax = mobileScore < 50 ? 2500 : 1500;

	if (input.email) {
		const adminEmail = process.env.CONTACT_EMAIL_TO || "mail@webvise.io";
		const timestamp = new Date().toLocaleString("en-GB", {
			dateStyle: "long",
			timeStyle: "short",
			timeZone: "Europe/Berlin",
		});

		await Promise.allSettled([
			sendEmail({
				label: "wp-health-admin",
				from: "webvise <noreply@webvise.io>",
				to: adminEmail,
				replyTo: input.email,
				subject: `WP Lead: ${input.url} - mobile ${mobileScore}/100`,
				html: buildAdminHtml({
					url: input.url,
					email: input.email,
					firstName: input.firstName,
					mobileScore,
					desktopScore,
					projectedScore,
					issues,
					securityFlags,
					estimateMin,
					estimateMax,
					timestamp,
				}),
				text: [
					"WP Health Report Lead",
					"",
					`URL: ${input.url}`,
					`Email: ${input.email}`,
					input.firstName ? `Name: ${input.firstName}` : null,
					`Received: ${timestamp}`,
					`Est. Value: €${estimateMin.toLocaleString()}–€${estimateMax.toLocaleString()}`,
					"",
					`Mobile: ${mobileScore}/100`,
					`Desktop: ${desktopScore}/100`,
					`Projected: ${projectedScore}/100`,
					"",
					"Issues:",
					...issues.map(
						(i) => `- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`
					),
					"",
					`Security: ${securityFlags.length ? securityFlags.join(", ") : "None"}`,
				]
					.filter(Boolean)
					.join("\n"),
			}),
			sendEmail({
				label: "wp-health-prospect",
				from: "webvise <mail@webvise.io>",
				to: input.email,
				replyTo: adminEmail,
				subject: `Your website report: ${input.url}`,
				html: buildProspectHtml({
					url: input.url,
					firstName: input.firstName,
					mobileScore,
					desktopScore,
					projectedScore,
					issues,
					estimateMin,
					estimateMax,
				}),
				text: [
					`Hi ${input.firstName || "there"},`,
					"",
					`Here's your free WordPress health report for ${input.url}.`,
					"",
					`Mobile score: ${mobileScore}/100`,
					`Desktop score: ${desktopScore}/100`,
					`After migrating to Next.js: ${projectedScore}/100`,
					"",
					"Top issues found:",
					...issues.map(
						(i) => `- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`
					),
					"",
					`Migration estimate: €${estimateMin.toLocaleString()}–€${estimateMax.toLocaleString()}`,
					"",
					"Ready to talk? Book a free call: https://cal.com/webvise",
					"Or reply to this email with any questions.",
					"",
					"- The webvise team",
				].join("\n"),
			}),
		]);
	}

	return {
		ok: true,
		result: {
			url: input.url,
			mobile: { score: mobileScore },
			desktop: { score: desktopScore },
			issues,
			vitals,
			projectedScore,
			securityFlags,
			migrationEstimate: { min: estimateMin, max: estimateMax },
		},
	};
}
