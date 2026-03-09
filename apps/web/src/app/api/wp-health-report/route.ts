import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
	url: z.string().url(),
	email: z.string().email(),
	firstName: z.string().max(100).optional(),
});

interface PSIAudit {
	title: string;
	score: number | null;
	displayValue?: string;
}

interface PSIResult {
	lighthouseResult: {
		categories: {
			performance: { score: number };
		};
		audits: Record<string, PSIAudit>;
	};
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
		.map((id) => audits[id])
		.filter((a): a is PSIAudit => !!a && a.score !== null && a.score < 0.9)
		.sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
		.slice(0, count)
		.map((a) => ({ title: a.title, displayValue: a.displayValue }));
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const data = schema.parse(body);

		const [mobile, desktop] = await Promise.all([
			runPageSpeedInsights(data.url, "mobile"),
			runPageSpeedInsights(data.url, "desktop"),
		]);

		const mobileScore = Math.round(
			mobile.lighthouseResult.categories.performance.score * 100,
		);
		const desktopScore = Math.round(
			desktop.lighthouseResult.categories.performance.score * 100,
		);
		const issues = extractTopIssues(mobile);
		const projectedScore =
			mobileScore < 50 ? 93 : mobileScore < 70 ? 95 : 97;

		const securityFlags: string[] = [];
		if (!data.url.startsWith("https://")) {
			securityFlags.push("No HTTPS encryption");
		}
		securityFlags.push("WordPress plugin ecosystem exposure");
		securityFlags.push("PHP server-side attack surface");

		const estimateMin = 1500;
		const estimateMax = mobileScore < 50 ? 4000 : 3000;

		// Send lead notification email
		const resendApiKey = process.env.RESEND_API_KEY;
		if (resendApiKey) {
			fetch("https://api.resend.com/emails", {
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
			}).catch((err) =>
				console.error("Failed to send lead notification:", err),
			);
		}

		return NextResponse.json({
			url: data.url,
			mobile: { score: mobileScore },
			desktop: { score: desktopScore },
			issues,
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
				error:
					"Failed to analyze website. Please check the URL and try again.",
			},
			{ status: 500 },
		);
	}
}
