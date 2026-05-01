export type PSIErrorCode = "rate_limited" | "bad_url" | "key_issue" | "unknown";

export class PSIError extends Error {
	code: PSIErrorCode;
	constructor(code: PSIErrorCode, message: string) {
		super(message);
		this.code = code;
		this.name = "PSIError";
	}
}

export interface PSIAudit {
	details?: {
		overallSavingsMs?: number;
		overallSavingsBytes?: number;
		items?: Record<string, unknown>[];
	};
	displayValue?: string;
	numericUnit?: string;
	numericValue?: number;
	score: number | null;
	title: string;
}

export interface PSIResult {
	lighthouseResult: {
		categories: {
			performance: { score: number };
		};
		audits: Record<string, PSIAudit>;
	};
}

export async function runPageSpeedInsights(
	url: string,
	strategy: "mobile" | "desktop"
): Promise<PSIResult> {
	const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
	const params = new URLSearchParams({
		url,
		strategy,
		category: "performance",
	});
	if (apiKey) {
		params.set("key", apiKey);
	}

	const res = await fetch(
		`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`
	);
	if (!res.ok) {
		const text = await res.text();
		const message = `PageSpeed API error ${res.status}: ${text}`;
		if (res.status === 429) {
			throw new PSIError("rate_limited", message);
		}
		if (res.status === 400) {
			throw new PSIError("bad_url", message);
		}
		if (res.status === 403) {
			throw new PSIError("key_issue", message);
		}
		throw new PSIError("unknown", message);
	}
	return res.json() as Promise<PSIResult>;
}

export function extractCoreWebVitals(result: PSIResult) {
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
			if (!audit) {
				return null;
			}
			return {
				label,
				displayValue: audit.displayValue ?? "",
				score: audit.score === null ? null : Math.round(audit.score * 100),
			};
		})
		.filter(Boolean) as Array<{
		label: string;
		displayValue: string;
		score: number | null;
	}>;
}

export function extractTopIssues(result: PSIResult, count = 5) {
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
			if (!audit) {
				return null;
			}
			return { ...audit, id };
		})
		.filter(
			(a): a is PSIAudit & { id: string } =>
				!!a && a.score !== null && a.score < 0.9
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
