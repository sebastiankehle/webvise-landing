import {
	extractCoreWebVitals,
	extractTopIssues,
	PSIError,
	type PSIResult,
	runPageSpeedInsights,
} from "@webvise-app/api/services/wp-health/psi";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const envMock = {
	GOOGLE_PAGESPEED_API_KEY: undefined as string | undefined,
};

vi.mock("@webvise-app/env/server", () => ({
	get env() {
		return envMock;
	},
}));

const PSI_400_RE = /PageSpeed API error 400/;

describe("runPageSpeedInsights", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
		envMock.GOOGLE_PAGESPEED_API_KEY = undefined;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("calls the v5 endpoint with strategy + category and the API key", async () => {
		envMock.GOOGLE_PAGESPEED_API_KEY = "k123";
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await runPageSpeedInsights("https://example.com", "mobile");
		const url = new URL(fetchMock.mock.calls[0][0]);
		expect(url.host).toBe("www.googleapis.com");
		expect(url.pathname).toBe("/pagespeedonline/v5/runPagespeed");
		expect(url.searchParams.get("url")).toBe("https://example.com");
		expect(url.searchParams.get("strategy")).toBe("mobile");
		expect(url.searchParams.get("category")).toBe("performance");
		expect(url.searchParams.get("key")).toBe("k123");
	});

	it("omits the key parameter when env var is not set", async () => {
		envMock.GOOGLE_PAGESPEED_API_KEY = undefined;
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await runPageSpeedInsights("https://example.com", "desktop");
		const url = new URL(fetchMock.mock.calls[0][0]);
		expect(url.searchParams.has("key")).toBe(false);
	});

	it.each([
		[429, "rate_limited"],
		[400, "bad_url"],
		[403, "key_issue"],
		[500, "unknown"],
		[502, "unknown"],
	])("maps HTTP %d to PSIError code %s", async (status, code) => {
		fetchMock.mockResolvedValueOnce(new Response("err body", { status }));
		await expect(
			runPageSpeedInsights("https://example.com", "mobile")
		).rejects.toMatchObject({ name: "PSIError", code });
	});

	it("throws PSIError with message containing the upstream status and body", async () => {
		fetchMock.mockResolvedValueOnce(new Response("nope", { status: 400 }));
		try {
			await runPageSpeedInsights("https://example.com", "mobile");
			expect.fail("expected PSIError");
		} catch (e) {
			expect(e).toBeInstanceOf(PSIError);
			expect((e as Error).message).toMatch(PSI_400_RE);
			expect((e as Error).message).toContain("nope");
		}
	});

	it("maps a fetch AbortError (TimeoutError) to PSIError code 'timeout'", async () => {
		const abortErr = new DOMException("signal timed out", "TimeoutError");
		fetchMock.mockRejectedValueOnce(abortErr);
		await expect(
			runPageSpeedInsights("https://example.com", "mobile")
		).rejects.toMatchObject({ name: "PSIError", code: "timeout" });
	});

	it("maps a fetch AbortError (AbortError) to PSIError code 'timeout'", async () => {
		const abortErr = new DOMException("aborted", "AbortError");
		fetchMock.mockRejectedValueOnce(abortErr);
		await expect(
			runPageSpeedInsights("https://example.com", "mobile")
		).rejects.toMatchObject({ name: "PSIError", code: "timeout" });
	});
});

const sampleResult: PSIResult = {
	lighthouseResult: {
		categories: { performance: { score: 0.42 } },
		audits: {
			"first-contentful-paint": {
				title: "FCP",
				score: 0.5,
				displayValue: "2.1 s",
			},
			"largest-contentful-paint": {
				title: "LCP",
				score: 0.3,
				displayValue: "4.0 s",
			},
			"render-blocking-resources": {
				title: "Eliminate render-blocking resources",
				score: 0.2,
				displayValue: "Save 1.2s",
				details: { overallSavingsMs: 1234 },
			},
			"unused-javascript": {
				title: "Reduce unused JavaScript",
				score: 0.85,
				displayValue: "Save 200ms",
			},
			"server-response-time": {
				title: "Reduce server response times",
				score: null,
				displayValue: "Root document took 800 ms",
			},
		},
	},
};

describe("extractCoreWebVitals", () => {
	it("returns the metrics that exist in the audit, with rounded scores", () => {
		const v = extractCoreWebVitals(sampleResult);
		expect(v).toHaveLength(2);
		expect(v[0]).toEqual({ label: "FCP", displayValue: "2.1 s", score: 50 });
		expect(v[1]).toEqual({ label: "LCP", displayValue: "4.0 s", score: 30 });
	});
});

describe("extractTopIssues", () => {
	it("filters audits with score < 0.9 and below the count limit", () => {
		const issues = extractTopIssues(sampleResult, 5);
		expect(issues.length).toBeGreaterThan(0);
		expect(
			issues.some((i) => i.title === "Eliminate render-blocking resources")
		).toBe(true);
		expect(issues.every((i) => i.title.length > 0)).toBe(true);
	});

	it("skips audits with null score (e.g. server-response-time)", () => {
		const issues = extractTopIssues(sampleResult, 10);
		expect(issues.some((i) => i.title === "Reduce server response times")).toBe(
			false
		);
	});

	it("includes savingsMs when present and rounds it", () => {
		const issues = extractTopIssues(sampleResult, 10);
		const blocking = issues.find(
			(i) => i.title === "Eliminate render-blocking resources"
		);
		expect(blocking?.savingsMs).toBe(1234);
	});

	it("respects the count cap", () => {
		const issues = extractTopIssues(sampleResult, 1);
		expect(issues).toHaveLength(1);
	});
});
