import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

const schema = z.object({
	url: z.string().url(),
	email: z.string().email(),
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
	return res.json();
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

function scoreColor(score: number): string {
	if (score >= 90) return "#16a34a";
	if (score >= 50) return "#ca8a04";
	return "#dc2626";
}

function scoreBadge(score: number): string {
	const color = scoreColor(score);
	return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:2px">${score}/100</span>`;
}

function urgencyLabel(mobileScore: number): { text: string; color: string } {
	if (mobileScore < 40) return { text: "HOT LEAD — score critical", color: "#dc2626" };
	if (mobileScore < 60) return { text: "WARM LEAD — clear improvement opportunity", color: "#ca8a04" };
	return { text: "COOL LEAD — already decent performance", color: "#6b7280" };
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
	const firstName = data.firstName || data.email.split("@")[0];

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 4px;font-size:13px;color:#374151">${i.title}${i.displayValue ? ` <span style="color:#6b7280">(${i.displayValue})</span>` : ""}</li>`,
		)
		.join("");

	const securityRows =
		data.securityFlags.length > 0
			? data.securityFlags
					.map(
						(f) =>
							`<li style="margin:0 0 4px;font-size:13px;color:#dc2626">⚠ ${f}</li>`,
					)
					.join("")
			: `<li style="margin:0;font-size:13px;color:#16a34a">✓ No flags detected</li>`;

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:580px;margin:40px auto;background:#ffffff;border:1px solid #e5e7eb">
    <div style="background:#7c3aed;padding:20px 28px;display:flex;align-items:center;justify-content:space-between">
      <span style="color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">webvise</span>
      <span style="color:#c4b5fd;font-size:13px">WP Health Report Lead</span>
    </div>
    <!-- Urgency banner -->
    <div style="background:${urgency.color};padding:10px 28px">
      <span style="color:#ffffff;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">${urgency.text}</span>
    </div>
    <div style="padding:28px">
      <!-- Lead info -->
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">Name</td>
          <td style="padding:6px 0;color:#111827;font-size:13px">${firstName}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">Email</td>
          <td style="padding:6px 0;font-size:13px"><a href="mailto:${data.email}" style="color:#7c3aed">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">Website</td>
          <td style="padding:6px 0;font-size:13px"><a href="${data.url}" style="color:#7c3aed">${data.url}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">Received</td>
          <td style="padding:6px 0;color:#111827;font-size:13px">${data.timestamp}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">Est. Value</td>
          <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">€${data.estimateMin.toLocaleString()}–€${data.estimateMax.toLocaleString()}</td>
        </tr>
      </table>

      <!-- Scores -->
      <div style="border:1px solid #e5e7eb;padding:16px 20px;margin-bottom:16px">
        <p style="margin:0 0 12px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Performance Scores</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:13px;color:#374151;padding:4px 0">Mobile</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#374151;padding:4px 0">Desktop</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#7c3aed;font-weight:500;padding:8px 0 4px">After webvise migration</td>
            <td style="text-align:right;padding:8px 0 4px">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>

      <!-- Top issues -->
      <div style="margin-bottom:16px">
        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Top Issues Found</p>
        <ul style="margin:0;padding:0 0 0 18px">${issueRows}</ul>
      </div>

      <!-- Security -->
      <div style="margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Security Flags</p>
        <ul style="margin:0;padding:0 0 0 18px">${securityRows}</ul>
      </div>

      <!-- CTA -->
      <a href="mailto:${data.email}?subject=Your webvise WordPress health report&body=Hi ${firstName},%0A%0A" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:10px 20px;font-size:13px;font-weight:500">
        Reply to ${firstName}
      </a>
    </div>
  </div>
</body>
</html>`;
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
	const firstName = data.firstName || "there";

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 6px;font-size:14px;color:#374151">${i.title}${i.displayValue ? ` — ${i.displayValue}` : ""}</li>`,
		)
		.join("");

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e5e7eb">
    <div style="background:#7c3aed;padding:20px 28px">
      <span style="color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">webvise</span>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111827">Hi ${firstName}, here's your report</h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6">We've analysed <strong style="color:#111827">${data.url}</strong>. Here's what we found — and what's possible.</p>

      <!-- Score summary -->
      <div style="border:1px solid #e5e7eb;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 16px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Performance Today</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:#374151;padding:6px 0">Mobile</td>
            <td style="text-align:right;padding:6px 0">
              <span style="display:inline-block;background:${scoreColor(data.mobileScore)};color:#fff;font-size:13px;font-weight:600;padding:3px 10px">${data.mobileScore}/100</span>
            </td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#374151;padding:6px 0">Desktop</td>
            <td style="text-align:right;padding:6px 0">
              <span style="display:inline-block;background:${scoreColor(data.desktopScore)};color:#fff;font-size:13px;font-weight:600;padding:3px 10px">${data.desktopScore}/100</span>
            </td>
          </tr>
        </table>
        <div style="border-top:2px solid #7c3aed;margin:16px 0 12px"></div>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:#7c3aed;font-weight:500;padding:0">After migrating to Next.js</td>
            <td style="text-align:right;padding:0">
              <span style="display:inline-block;background:#7c3aed;color:#fff;font-size:13px;font-weight:600;padding:3px 10px">${data.projectedScore}/100</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Issues -->
      ${
				data.issues.length > 0
					? `<div style="margin-bottom:24px">
        <p style="margin:0 0 12px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">What's Slowing You Down</p>
        <ul style="margin:0;padding:0 0 0 20px">${issueRows}</ul>
      </div>`
					: ""
			}

      <!-- Estimate -->
      <div style="background:#faf5ff;border:1px solid #e9d5ff;padding:20px;margin-bottom:28px">
        <p style="margin:0 0 8px;font-size:12px;color:#7c3aed;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Migration Estimate</p>
        <p style="margin:0;font-size:22px;font-weight:600;color:#111827">€${data.estimateMin.toLocaleString()} – €${data.estimateMax.toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#6b7280;line-height:1.5">Fixed-price, from WordPress to a fast, modern Next.js site. No surprises.</p>
      </div>

      <!-- CTAs -->
      <div style="margin-bottom:8px">
        <a href="https://cal.com/webvise" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:500;margin-right:12px">
          Book a Free Call
        </a>
        <a href="https://webvise.io" style="display:inline-block;border:1px solid #e5e7eb;color:#374151;text-decoration:none;padding:12px 24px;font-size:14px">
          View Our Work
        </a>
      </div>

      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.6">
        You're receiving this because you ran a free health report at webvise.io. Reply to this email if you have questions.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
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
			return NextResponse.json(
				{
					error:
						"Failed to analyze website. Please check the URL and try again.",
				},
				{ status: 502 },
			);
		}

		const [mobileScore, desktopScore, tech] = [
			Math.round(mobile.lighthouseResult.categories.performance.score * 100),
			Math.round(desktop.lighthouseResult.categories.performance.score * 100),
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
		if (resendApiKey) {
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
						subject: `WP Lead: ${data.url} — mobile ${mobileScore}/100`,
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
							`WP Health Report Lead`,
							``,
							`URL: ${data.url}`,
							`Email: ${data.email}`,
							data.firstName ? `Name: ${data.firstName}` : null,
							`Received: ${timestamp}`,
							`Est. Value: €${estimateMin.toLocaleString()}–€${estimateMax.toLocaleString()}`,
							``,
							`Mobile: ${mobileScore}/100`,
							`Desktop: ${desktopScore}/100`,
							`Projected: ${projectedScore}/100`,
							``,
							`Issues:`,
							...issues.map(
								(i) =>
									`- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`,
							),
							``,
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
						from: "webvise <hello@webvise.io>",
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
							``,
							`Here's your free WordPress health report for ${data.url}.`,
							``,
							`Mobile score: ${mobileScore}/100`,
							`Desktop score: ${desktopScore}/100`,
							`After migrating to Next.js: ${projectedScore}/100`,
							``,
							`Top issues found:`,
							...issues.map(
								(i) =>
									`- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`,
							),
							``,
							`Migration estimate: €${estimateMin.toLocaleString()}–€${estimateMax.toLocaleString()}`,
							``,
							`Ready to talk? Book a free call: https://cal.com/webvise`,
							`Or reply to this email with any questions.`,
							``,
							`— The webvise team`,
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
