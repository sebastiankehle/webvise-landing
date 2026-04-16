import { NextResponse } from "next/server";
import { z } from "zod";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";
import {
	c,
	emailLayout,
	escapeHtml,
	s,
	scoreBadge,
	scoreColor,
	tableRow,
} from "@/lib/email-template";
import { UrlValidationError, validateUrl } from "@/lib/validate-url";

export const maxDuration = 60;

const limiter = createRateLimiter({
	name: "wp-health-report",
	maxRequests: 5,
	windowMs: 60_000,
});

const schema = z.object({
	url: z.string().url(),
	email: z.string().email().optional(),
	firstName: z.string().max(100).optional(),
});

interface PSIAudit {
	title: string;
	score: number | null;
	displayValue?: string;
	numericValue?: number;
	numericUnit?: string;
	details?: {
		overallSavingsMs?: number;
		overallSavingsBytes?: number;
		items?: Array<Record<string, unknown>>;
	};
}

interface PSIResult {
	lighthouseResult: {
		categories: {
			performance: { score: number };
		};
		audits: Record<string, PSIAudit>;
	};
}

async function detectTechnology(
	url: string,
): Promise<{ isWordPress: boolean; isPHP: boolean }> {
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(10000),
			headers: { "User-Agent": "webvise-health-report/1.0" },
		});
		const html = await res.text();
		const headers = Object.fromEntries(
			[...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]),
		);

		const isWordPress =
			/\/wp-content\//i.test(html) ||
			/\/wp-includes\//i.test(html) ||
			/name=["']generator["'][^>]*WordPress/i.test(html) ||
			headers["x-powered-by"]?.toLowerCase().includes("wordpress") === true ||
			headers.link?.includes("wp-json") === true;

		const isPHP =
			isWordPress ||
			headers["x-powered-by"]?.toLowerCase().includes("php") === true ||
			/\.php[\s"'?]/i.test(html);

		return { isWordPress, isPHP };
	} catch {
		return { isWordPress: false, isPHP: false };
	}
}

async function runPageSpeedInsights(
	url: string,
	strategy: "mobile" | "desktop",
): Promise<PSIResult> {
	const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
	const params = new URLSearchParams({
		url,
		strategy,
		category: "performance",
	});
	if (apiKey) params.set("key", apiKey);

	const res = await fetch(
		`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
	);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PageSpeed API error ${res.status}: ${text}`);
	}
	return res.json() as Promise<PSIResult>;
}

function extractCoreWebVitals(result: PSIResult) {
	const audits = result.lighthouseResult.audits;
	const metrics = [
		{ key: "first-contentful-paint", label: "FCP" },
		{ key: "largest-contentful-paint", label: "LCP" },
		{ key: "total-blocking-time", label: "TBT" },
		{ key: "cumulative-layout-shift", label: "CLS" },
		{ key: "speed-index", label: "SI" },
	];

	return metrics
		.map(({ key, label }) => {
			const audit = audits[key];
			if (!audit) return null;
			return {
				label,
				displayValue: audit.displayValue ?? "",
				score: audit.score !== null ? Math.round(audit.score * 100) : null,
			};
		})
		.filter(Boolean) as Array<{
		label: string;
		displayValue: string;
		score: number | null;
	}>;
}

function extractTopIssues(result: PSIResult, count = 5) {
	const audits = result.lighthouseResult.audits;
	const issueKeys = [
		"render-blocking-resources",
		"unused-javascript",
		"unused-css-rules",
		"unminified-javascript",
		"unminified-css",
		"total-byte-weight",
		"server-response-time",
		"dom-size",
		"redirects",
		"uses-text-compression",
		"uses-optimized-images",
		"offscreen-images",
		"uses-responsive-images",
	];

	return issueKeys
		.map((id) => {
			const audit = audits[id];
			if (!audit) return null;
			return { ...audit, id };
		})
		.filter(
			(a): a is PSIAudit & { id: string } =>
				!!a && a.score !== null && a.score < 0.9,
		)
		.sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
		.slice(0, count)
		.map((a) => ({
			title: a.title,
			displayValue: a.displayValue,
			savingsMs: a.details?.overallSavingsMs
				? Math.round(a.details.overallSavingsMs)
				: undefined,
		}));
}

function urgencyLabel(mobileScore: number): { text: string; color: string } {
	if (mobileScore < 40)
		return { text: "HOT LEAD - score critical", color: c.red };
	if (mobileScore < 60)
		return {
			text: "WARM LEAD - clear improvement opportunity",
			color: c.yellow,
		};
	return { text: "COOL LEAD - already decent performance", color: c.textMuted };
}

function buildAdminHtml(data: {
	url: string;
	email: string;
	firstName?: string;
	mobileScore: number;
	desktopScore: number;
	projectedScore: number;
	issues: Array<{ title: string; displayValue?: string; savingsMs?: number }>;
	securityFlags: string[];
	estimateMin: number;
	estimateMax: number;
	timestamp: string;
}) {
	const urgency = urgencyLabel(data.mobileScore);
	const url = escapeHtml(data.url);
	const email = escapeHtml(data.email);
	const firstName = escapeHtml(data.firstName || data.email.split("@")[0]);

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 4px;font-size:13px;color:${c.text}">${escapeHtml(i.title)}${i.displayValue ? ` <span style="color:${c.textMuted}">(${escapeHtml(i.displayValue)})</span>` : ""}</li>`,
		)
		.join("");

	const securityRows =
		data.securityFlags.length > 0
			? data.securityFlags
					.map(
						(f) =>
							`<li style="margin:0 0 4px;font-size:13px;color:${c.red}">${escapeHtml(f)}</li>`,
					)
					.join("")
			: `<li style="margin:0;font-size:13px;color:${c.green}">No flags detected</li>`;

	const rows = [
		tableRow("Name", firstName),
		tableRow(
			"Email",
			`<a href="mailto:${email}" style="${s.link}">${email}</a>`,
		),
		tableRow("Website", `<a href="${url}" style="${s.link}">${url}</a>`),
		tableRow("Received", data.timestamp),
		tableRow(
			"Est. Value",
			`<strong>${"€"}${data.estimateMin.toLocaleString()}${"–€"}${data.estimateMax.toLocaleString()}</strong>`,
		),
	].join("");

	return emailLayout({
		label: "WP Health Report Lead",
		content: `
      <div style="border-left:3px solid ${urgency.color};padding:8px 0 8px 16px;margin-bottom:24px">
        <span style="${s.mono};color:${urgency.color}">${urgency.text}</span>
      </div>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${rows}</table>
      <div style="${s.box}">
        <p style="${s.label}">Performance Scores</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:13px;color:${c.text};padding:4px 0">Mobile</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:${c.text};padding:4px 0">Desktop</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:${c.brand};font-weight:500;padding:8px 0 4px">After webvise migration</td>
            <td style="text-align:right;padding:8px 0 4px">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>
      <div style="margin-bottom:16px">
        <p style="${s.label}">Top Issues Found</p>
        <ul style="margin:0;padding:0 0 0 18px">${issueRows}</ul>
      </div>
      <div style="margin-bottom:24px">
        <p style="${s.label}">Security Flags</p>
        <ul style="margin:0;padding:0 0 0 18px">${securityRows}</ul>
      </div>
      <a href="mailto:${email}?subject=Your webvise WordPress health report&body=Hi ${firstName},%0A%0A" style="${s.button}">Reply to ${firstName}</a>`,
	});
}

function buildProspectHtml(data: {
	url: string;
	firstName?: string;
	mobileScore: number;
	desktopScore: number;
	projectedScore: number;
	issues: Array<{ title: string; displayValue?: string }>;
	estimateMin: number;
	estimateMax: number;
}) {
	const firstName = escapeHtml(data.firstName || "there");
	const url = escapeHtml(data.url);

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 6px;font-size:14px;color:${c.text}">${escapeHtml(i.title)}${i.displayValue ? ` - ${escapeHtml(i.displayValue)}` : ""}</li>`,
		)
		.join("");

	return emailLayout({
		label: "Health Report",
		content: `
      <h1 style="${s.h1}">Hi ${firstName}, here's your report</h1>
      <p style="${s.p}">We've analysed <strong style="color:${c.text}">${url}</strong>. Here's what we found - and what's possible.</p>
      <div style="${s.box}">
        <p style="${s.label}">Performance Today</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">Mobile</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">Desktop</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
        </table>
        <div style="border-top:2px solid ${c.brand};margin:16px 0 12px"></div>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.brand};font-weight:500;padding:0">After migrating to Next.js</td>
            <td style="text-align:right;padding:0">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>
      ${
				data.issues.length > 0
					? `<div style="margin-bottom:24px">
        <p style="${s.label}">What's Slowing You Down</p>
        <ul style="margin:0;padding:0 0 0 20px">${issueRows}</ul>
      </div>`
					: ""
			}
      <div style="${s.box}">
        <p style="${s.label};color:${c.brand}">Migration Estimate</p>
        <p style="margin:0;font-size:22px;font-weight:600;color:${c.text}">${"€"}${data.estimateMin.toLocaleString()} ${"–"} ${"€"}${data.estimateMax.toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:13px;color:${c.textMuted};line-height:1.5">Fixed-price, from WordPress to a fast, modern Next.js site. No surprises.</p>
      </div>
      <div style="margin-bottom:8px">
        <a href="https://cal.com/webvise" style="${s.button};margin-right:12px">Book a Free Call</a>
        <a href="https://webvise.io" style="${s.buttonOutline}">View Our Work</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:${c.textFaint};line-height:1.6">
        You're receiving this because you ran a free health report at webvise.io. Reply to this email if you have questions.
      </p>`,
	});
}

export async function POST(request: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(request));
	if (limited) return rateLimitResponse(retryAfterSec);

	try {
		if (!process.env.GOOGLE_PAGESPEED_API_KEY) {
			console.error("Missing GOOGLE_PAGESPEED_API_KEY environment variable");
			return NextResponse.json(
				{ error: "Service temporarily unavailable. Please try again later." },
				{ status: 503 },
			);
		}

		const body = await request.json();
		const data = schema.parse(body);

		try {
			await validateUrl(data.url);
		} catch (e) {
			const message =
				e instanceof UrlValidationError
					? e.message
					: "Could not validate the URL.";
			return NextResponse.json({ error: message }, { status: 400 });
		}

		let mobile: PSIResult;
		let desktop: PSIResult;
		try {
			[mobile, desktop] = await Promise.all([
				runPageSpeedInsights(data.url, "mobile"),
				runPageSpeedInsights(data.url, "desktop"),
			]);
		} catch (psiError) {
			console.error("PageSpeed Insights API failed:", psiError);
			const message =
				psiError instanceof Error ? psiError.message : String(psiError);

			if (message.includes("429")) {
				return NextResponse.json(
					{ error: "Rate limited by Google. Please try again in a moment." },
					{ status: 429 },
				);
			}

			const statusMatch = message.match(/PageSpeed API error (\d+)/);
			const apiStatus = statusMatch ? Number(statusMatch[1]) : null;

			if (apiStatus === 400) {
				return NextResponse.json(
					{
						error:
							"Could not analyze this URL. Make sure it's a publicly accessible website.",
					},
					{ status: 400 },
				);
			}

			if (apiStatus === 403) {
				console.error(
					"PageSpeed API key may be invalid or the PageSpeed Insights API is not enabled in Google Cloud Console.",
				);
				return NextResponse.json(
					{
						error:
							"Analysis service is temporarily unavailable. Please try again later.",
					},
					{ status: 503 },
				);
			}

			return NextResponse.json(
				{
					error:
						"Failed to analyze website. Please check the URL and try again.",
				},
				{ status: 502 },
			);
		}

		const mobileRawScore =
			mobile.lighthouseResult?.categories?.performance?.score;
		const desktopRawScore =
			desktop.lighthouseResult?.categories?.performance?.score;

		if (mobileRawScore == null || desktopRawScore == null) {
			console.error("PageSpeed returned null scores", {
				url: data.url,
				mobileScore: mobileRawScore,
				desktopScore: desktopRawScore,
			});
			return NextResponse.json(
				{
					error:
						"Could not analyze this URL. Make sure it's a publicly accessible website.",
				},
				{ status: 400 },
			);
		}

		const [mobileScore, desktopScore, tech] = [
			Math.round(mobileRawScore * 100),
			Math.round(desktopRawScore * 100),
			await detectTechnology(data.url),
		];
		const issues = extractTopIssues(mobile);
		const vitals = extractCoreWebVitals(mobile);
		const projectedScore = mobileScore < 50 ? 93 : mobileScore < 70 ? 95 : 97;

		const securityFlags: string[] = [];
		if (!data.url.startsWith("https://")) {
			securityFlags.push("No HTTPS encryption");
		}
		if (tech.isWordPress) {
			securityFlags.push("WordPress plugin ecosystem exposure");
		}
		if (tech.isPHP) {
			securityFlags.push("PHP server-side attack surface");
		}

		const estimateMin = 750;
		const estimateMax = mobileScore < 50 ? 2500 : 1500;

		const resendApiKey = process.env.RESEND_API_KEY;
		if (resendApiKey && data.email) {
			const adminEmail = process.env.CONTACT_EMAIL_TO || "mail@webvise.io";
			const timestamp = new Date().toLocaleString("en-GB", {
				dateStyle: "long",
				timeStyle: "short",
				timeZone: "Europe/Berlin",
			});

			// Send both emails in parallel
			await Promise.allSettled([
				// Admin lead notification
				fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${resendApiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						from: "webvise <noreply@webvise.io>",
						to: [adminEmail],
						reply_to: data.email,
						subject: `WP Lead: ${data.url} - mobile ${mobileScore}/100`,
						html: buildAdminHtml({
							url: data.url,
							email: data.email,
							firstName: data.firstName,
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
							`URL: ${data.url}`,
							`Email: ${data.email}`,
							data.firstName ? `Name: ${data.firstName}` : null,
							`Received: ${timestamp}`,
							`Est. Value: €${estimateMin.toLocaleString()}–€${estimateMax.toLocaleString()}`,
							"",
							`Mobile: ${mobileScore}/100`,
							`Desktop: ${desktopScore}/100`,
							`Projected: ${projectedScore}/100`,
							"",
							"Issues:",
							...issues.map(
								(i) =>
									`- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`,
							),
							"",
							`Security: ${securityFlags.length ? securityFlags.join(", ") : "None"}`,
						]
							.filter(Boolean)
							.join("\n"),
					}),
				}).then(async (r) => {
					if (!r.ok)
						console.error("Failed to send admin notification:", await r.text());
				}),

				// Prospect auto-responder
				fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${resendApiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						from: "webvise <mail@webvise.io>",
						to: [data.email],
						reply_to: adminEmail,
						subject: `Your website report: ${data.url}`,
						html: buildProspectHtml({
							url: data.url,
							firstName: data.firstName,
							mobileScore,
							desktopScore,
							projectedScore,
							issues,
							estimateMin,
							estimateMax,
						}),
						text: [
							`Hi ${data.firstName || "there"},`,
							"",
							`Here's your free WordPress health report for ${data.url}.`,
							"",
							`Mobile score: ${mobileScore}/100`,
							`Desktop score: ${desktopScore}/100`,
							`After migrating to Next.js: ${projectedScore}/100`,
							"",
							"Top issues found:",
							...issues.map(
								(i) =>
									`- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`,
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
				}).then(async (r) => {
					if (!r.ok)
						console.error(
							"Failed to send prospect auto-responder:",
							await r.text(),
						);
				}),
			]);
		}

		return NextResponse.json({
			url: data.url,
			mobile: { score: mobileScore },
			desktop: { score: desktopScore },
			issues,
			vitals,
			projectedScore,
			securityFlags,
			migrationEstimate: { min: estimateMin, max: estimateMax },
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid input", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("WP Health Report error:", error);
		return NextResponse.json(
			{
				error: "Failed to analyze website. Please check the URL and try again.",
			},
			{ status: 500 },
		);
	}
}
