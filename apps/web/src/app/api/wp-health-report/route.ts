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

		// Send lead notification email to admin
		const resendApiKey = process.env.RESEND_API_KEY;
		if (resendApiKey) {
			try {
				const emailRes = await fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${resendApiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						from: "webvise <noreply@webvise.io>",
						to: [process.env.CONTACT_EMAIL_TO || "mail@webvise.io"],
						subject: `WP Health Report Lead: ${data.url}`,
						text: [
							"New WordPress Health Report lead:",
							"",
							`URL: ${data.url}`,
							`Email: ${data.email}`,
							data.firstName ? `Name: ${data.firstName}` : null,
							"",
							`Mobile Score: ${mobileScore}/100`,
							`Desktop Score: ${desktopScore}/100`,
							`Projected Next.js Score: ${projectedScore}/100`,
							"",
							"Top Issues:",
							...issues.map(
								(i) =>
									`- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`,
							),
						]
							.filter(Boolean)
							.join("\n"),
					}),
				});
				if (!emailRes.ok) {
					console.error(
						"Failed to send lead notification:",
						await emailRes.text(),
					);
				}
			} catch (err) {
				console.error("Failed to send lead notification:", err);
			}
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
