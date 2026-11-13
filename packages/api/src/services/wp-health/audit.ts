import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
import { env } from "@webvise-app/env/server";
import { and, eq, gt } from "drizzle-orm";
import { sendEmail } from "../../email/resend";
import { safeFetchText } from "../../safe-fetch";
import { UrlValidationError, validateUrl } from "../../url-validation";
import { recordLead } from "../leads";
import {
	buildAdminHtml,
	buildProspectHtml,
	type ProspectLocale,
	prospectSubject,
	prospectText,
} from "./emails";
import { type GeoResult, runGeoChecks } from "./geo-checks";
import {
	extractCoreWebVitals,
	extractSeoScore,
	extractTopIssues,
	PSIError,
	type PSIErrorCode,
	type PSIResult,
	runPageSpeedInsights,
} from "./psi";
import {
	detectTechnologyFromPage,
	PAGE_FETCH_OPTIONS,
	type TechFlags,
} from "./tech-detect";

export interface AuditInput {
	email?: string;
	firstName?: string;
	/** Language of the page the report ran on; the prospect's email follows it. */
	locale?: ProspectLocale;
	url: string;
}

export interface AuditResultData {
	desktop: { score: number };
	geo: GeoResult;
	issues: ReturnType<typeof extractTopIssues>;
	mobile: { score: number };
	projectedScore: number;
	securityFlags: string[];
	seo: { score: number | null };
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

const PROSPECT_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;

/** At most one report email per address per day. Fails closed on DB errors. */
async function canSendProspectEmail(email: string): Promise<boolean> {
	try {
		const prior = await db.query.leadEvent.findFirst({
			where: and(
				eq(leadEvent.email, email),
				eq(leadEvent.eventType, "wp_health_report"),
				gt(leadEvent.createdAt, new Date(Date.now() - PROSPECT_EMAIL_WINDOW_MS))
			),
		});
		return !prior;
	} catch (e) {
		console.error("[wp-health] could not check report email cap:", e);
		return false;
	}
}

function geoTextLines(seoScore: number | null, geo: GeoResult): string[] {
	const blocked = geo.blockedCrawlers.length
		? ` (${geo.blockedCrawlers.join(", ")})`
		: "";
	return [
		`SEO score: ${seoScore === null ? "n/a" : `${seoScore}/100`}`,
		`llms.txt: ${geo.llmsTxt ? "yes" : "no"}`,
		`AI crawlers: ${geo.aiCrawlers}${blocked}`,
		`Structured data: ${geo.jsonLdTypes.length ? geo.jsonLdTypes.join(", ") : "none"}`,
	];
}

/** Fetch the homepage once; a failed fetch or check never fails the audit. */
async function inspectSite(
	url: string
): Promise<{ tech: TechFlags; geo: GeoResult }> {
	let page: Awaited<ReturnType<typeof safeFetchText>> | null = null;
	try {
		page = await safeFetchText(url, PAGE_FETCH_OPTIONS);
	} catch {
		page = null;
	}
	const tech = page
		? detectTechnologyFromPage(page)
		: { isWordPress: false, isPHP: false };
	const geo = await runGeoChecks(url, page?.text ?? null);
	return { tech, geo };
}

export async function runWpHealthAudit(
	input: AuditInput
): Promise<AuditOutcome> {
	if (!env.GOOGLE_PAGESPEED_API_KEY) {
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
	let tech: TechFlags;
	let geo: GeoResult;
	try {
		[mobile, desktop, { tech, geo }] = await Promise.all([
			runPageSpeedInsights(input.url, "mobile"),
			runPageSpeedInsights(input.url, "desktop"),
			inspectSite(input.url),
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
	const seoScore = extractSeoScore(mobile);
	const issues = extractTopIssues(mobile);
	const vitals = extractCoreWebVitals(mobile);
	const projectedScore = computeProjectedScore(mobileScore);
	const securityFlags = buildSecurityFlags(input.url, tech);

	if (input.email) {
		const adminEmail = env.CONTACT_EMAIL_TO;
		const timestamp = new Date().toLocaleString("en-GB", {
			dateStyle: "long",
			timeStyle: "short",
			timeZone: "Europe/Berlin",
		});

		const normalizedEmail = input.email.trim().toLowerCase();
		const sendProspect = await canSendProspectEmail(normalizedEmail);

		// The cap check above must stay before this write: recordLead stores this
		// request's wp_health_report row, which the next request's cap check reads.
		const sends: Promise<unknown>[] = [
			recordLead({
				type: "wp_health_report",
				email: normalizedEmail,
				name: input.firstName,
				placement: "wp_health_report",
				path: "/wp-health-report",
				topic: new URL(input.url).hostname,
				note: {
					title: "WP Health report",
					content: [
						`URL: ${input.url}`,
						`Mobile: ${mobileScore}/100`,
						`Desktop: ${desktopScore}/100`,
						`Security: ${securityFlags.length ? securityFlags.join(", ") : "None"}`,
						...geoTextLines(seoScore, geo),
					].join("\n"),
				},
			}),
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
					seoScore,
					geo,
					timestamp,
				}),
				text: [
					"WP Health Report Lead",
					"",
					`URL: ${input.url}`,
					`Email: ${input.email}`,
					input.firstName ? `Name: ${input.firstName}` : null,
					`Received: ${timestamp}`,
					"Scope: migration scope review required",
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
					"",
					...geoTextLines(seoScore, geo),
				]
					.filter(Boolean)
					.join("\n"),
			}),
		];

		if (sendProspect) {
			sends.push(
				sendEmail({
					label: "wp-health-prospect",
					from: "webvise <mail@webvise.io>",
					to: input.email,
					replyTo: adminEmail,
					subject: prospectSubject(input.locale),
					html: buildProspectHtml({
						url: input.url,
						locale: input.locale,
						mobileScore,
						desktopScore,
						projectedScore,
						issues,
						seoScore,
						geo,
					}),
					text: prospectText({
						url: input.url,
						locale: input.locale,
						mobileScore,
						desktopScore,
						projectedScore,
						issues,
						seoScore,
						geo,
					}),
				})
			);
		}

		await Promise.allSettled(sends);
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
			seo: { score: seoScore },
			geo,
		},
	};
}
