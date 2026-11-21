import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
import { env } from "@webvise-app/env/server";
import { and, eq, gt } from "drizzle-orm";
import { sendEmail } from "../../email/resend";
import { safeFetchText } from "../../safe-fetch";
import { UrlValidationError, validateUrl } from "../../url-validation";
import { recordLead, reportLeadNotificationFailure } from "../leads";
import {
	buildAdminHtml,
	buildProspectHtml,
	type ProspectLocale,
	prospectSubject,
	prospectText,
} from "./emails";
import { type GeoResult, readableText, runGeoChecks } from "./geo-checks";
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
	/** False when the homepage could not be read: WordPress and PHP went unchecked. */
	homepageRead: boolean;
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

function buildSecurityFlags(url: string, tech: TechFlags | null): string[] {
	const flags: string[] = [];
	if (!url.startsWith("https://")) {
		flags.push("No HTTPS encryption");
	}
	if (tech?.isWordPress) {
		flags.push("WordPress plugin ecosystem exposure");
	}
	if (tech?.isPHP) {
		flags.push("PHP server-side attack surface");
	}
	return flags;
}

/** The security line of the lead note and the admin email. */
function securityText(flags: string[], homepageRead: boolean): string {
	const items = homepageRead
		? flags
		: [...flags, "homepage could not be read, WordPress and PHP not checked"];
	return items.length ? items.join(", ") : "None";
}

const PROSPECT_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * At most one report email per address per day. A DB error sends the email
 * anyway: the visitor was promised it, and the rate limit still applies.
 */
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
		console.error(
			"[wp-health] could not check report email cap, sending anyway:",
			e
		);
		return true;
	}
}

function llmsTxtText(llmsTxt: boolean | null): string {
	if (llmsTxt === null) {
		return "could not read";
	}
	return llmsTxt ? "yes" : "no";
}

function jsonLdText(types: string[] | null): string {
	if (types === null) {
		return "could not read the homepage";
	}
	return types.length ? types.join(", ") : "none";
}

function geoTextLines(seoScore: number | null, geo: GeoResult): string[] {
	const blocked = geo.blockedCrawlers.length
		? ` (${geo.blockedCrawlers.join(", ")})`
		: "";
	return [
		`SEO score: ${seoScore === null ? "n/a" : `${seoScore}/100`}`,
		`llms.txt: ${llmsTxtText(geo.llmsTxt)}`,
		`AI crawlers: ${geo.aiCrawlers}${blocked}`,
		`Structured data: ${jsonLdText(geo.jsonLdTypes)}`,
	];
}

/**
 * Fetch the homepage once; a failed fetch or check never fails the audit.
 * A failed fetch or a non-2xx answer (a WAF's 403 page) leaves `tech` null.
 */
async function inspectSite(
	url: string
): Promise<{ tech: TechFlags | null; geo: GeoResult }> {
	let page: Awaited<ReturnType<typeof safeFetchText>> | null = null;
	try {
		page = await safeFetchText(url, PAGE_FETCH_OPTIONS);
	} catch {
		page = null;
	}
	const html = readableText(page);
	const tech = page && html !== null ? detectTechnologyFromPage(page) : null;
	const geo = await runGeoChecks(url, html);
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
	let tech: TechFlags | null;
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
	const result: AuditResultData = {
		url: input.url,
		mobile: { score: mobileScore },
		desktop: { score: desktopScore },
		issues: extractTopIssues(mobile),
		vitals: extractCoreWebVitals(mobile),
		projectedScore: computeProjectedScore(mobileScore),
		securityFlags: buildSecurityFlags(input.url, tech),
		homepageRead: tech !== null,
		seo: { score: extractSeoScore(mobile) },
		geo,
	};

	// Client bundles from before the unlock step send the email here.
	if (input.email) {
		await sendReportLead(result, { ...input, email: input.email });
	}

	return { ok: true, result };
}

export interface ReportLead {
	email: string;
	firstName?: string;
	locale?: ProspectLocale;
}

/** `lost`: the admin email failed and neither the DB nor Attio kept the lead. */
export interface ReportLeadOutcome {
	/** Whether the report went to the visitor's inbox. */
	emailed: boolean;
	lost: boolean;
}

/** Records the lead and emails webvise and the visitor the given report. */
export async function sendReportLead(
	report: AuditResultData,
	lead: ReportLead
): Promise<ReportLeadOutcome> {
	const { url, issues, projectedScore, securityFlags, homepageRead, geo } =
		report;
	const mobileScore = report.mobile.score;
	const desktopScore = report.desktop.score;
	const seoScore = report.seo.score;
	const adminEmail = env.CONTACT_EMAIL_TO;
	const timestamp = new Date().toLocaleString("en-GB", {
		dateStyle: "long",
		timeStyle: "short",
		timeZone: "Europe/Berlin",
	});

	const normalizedEmail = lead.email.trim().toLowerCase();
	const sendProspect = await canSendProspectEmail(normalizedEmail);
	const security = securityText(securityFlags, homepageRead);

	// The cap check above must stay before this write: recordLead stores this
	// request's wp_health_report row, which the next request's cap check reads.
	const [stored, admin, prospect] = await Promise.all([
		recordLead({
			type: "wp_health_report",
			email: normalizedEmail,
			name: lead.firstName,
			placement: "wp_health_report",
			path: "/wp-health-report",
			topic: new URL(url).hostname,
			note: {
				title: "WP Health report",
				content: [
					`URL: ${url}`,
					`Mobile: ${mobileScore}/100`,
					`Desktop: ${desktopScore}/100`,
					`Security: ${security}`,
					...geoTextLines(seoScore, geo),
				].join("\n"),
			},
		}),
		sendEmail({
			label: "wp-health-admin",
			from: "webvise <noreply@webvise.io>",
			to: adminEmail,
			replyTo: lead.email,
			subject: `WP Lead: ${url} - mobile ${mobileScore}/100`,
			html: buildAdminHtml({
				url,
				email: lead.email,
				firstName: lead.firstName,
				mobileScore,
				desktopScore,
				projectedScore,
				issues,
				securityFlags,
				homepageRead,
				seoScore,
				geo,
				timestamp,
			}),
			text: [
				"WP Health Report Lead",
				"",
				`URL: ${url}`,
				`Email: ${lead.email}`,
				lead.firstName ? `Name: ${lead.firstName}` : null,
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
				`Security: ${security}`,
				"",
				...geoTextLines(seoScore, geo),
			]
				.filter(Boolean)
				.join("\n"),
		}),
		sendProspect
			? sendEmail({
					label: "wp-health-prospect",
					from: "webvise <mail@webvise.io>",
					to: lead.email,
					replyTo: adminEmail,
					subject: prospectSubject(lead.locale),
					html: buildProspectHtml({
						url,
						locale: lead.locale,
						mobileScore,
						desktopScore,
						projectedScore,
						issues,
						seoScore,
						geo,
					}),
					text: prospectText({
						url,
						locale: lead.locale,
						mobileScore,
						desktopScore,
						projectedScore,
						issues,
						seoScore,
						geo,
					}),
				})
			: null,
	]);

	if (!admin.ok) {
		await reportLeadNotificationFailure("wp_health_report", admin, stored);
	}
	return { emailed: prospect?.ok === true, lost: !(admin.ok || stored) };
}
