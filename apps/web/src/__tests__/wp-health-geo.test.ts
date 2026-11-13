import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lookupMock = vi.fn();

vi.mock("node:dns/promises", () => ({
	lookup: (...args: unknown[]) => lookupMock(...args),
}));

const { extractJsonLdTypes, parseRobotsForAiCrawlers, runGeoChecks } =
	await import("@webvise-app/api/services/wp-health/geo-checks");

describe("parseRobotsForAiCrawlers", () => {
	it("treats an empty file as allowed", () => {
		expect(parseRobotsForAiCrawlers("")).toEqual({
			status: "allowed",
			blocked: [],
		});
	});

	it("flags a crawler with its own Disallow: /", () => {
		expect(parseRobotsForAiCrawlers("User-agent: GPTBot\nDisallow: /")).toEqual(
			{ status: "partly-blocked", blocked: ["GPTBot"] }
		);
	});

	it("blocks every crawler when * disallows everything", () => {
		const r = parseRobotsForAiCrawlers("User-agent: *\nDisallow: /");
		expect(r.status).toBe("blocked");
		expect(r.blocked).toHaveLength(5);
	});

	it("lets a crawler's own Allow: / group override a * block", () => {
		const r = parseRobotsForAiCrawlers(
			"User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /"
		);
		expect(r.blocked).not.toContain("GPTBot");
		expect(r.status).toBe("partly-blocked");
	});

	it("ignores comments and field-name casing", () => {
		const r = parseRobotsForAiCrawlers(
			"# AI\nUSER-AGENT: claudebot # hi\nDISALLOW: /  # all\n"
		);
		expect(r).toEqual({ status: "partly-blocked", blocked: ["ClaudeBot"] });
	});

	it("does not treat a partial Disallow as blocked", () => {
		expect(
			parseRobotsForAiCrawlers("User-agent: *\nDisallow: /admin").status
		).toBe("allowed");
	});

	it("applies one group to several stacked user agents", () => {
		const r = parseRobotsForAiCrawlers(
			"User-agent: GPTBot\nUser-agent: CCBot\nDisallow: /"
		);
		expect(r.blocked).toEqual(["GPTBot", "CCBot"]);
	});
});

describe("extractJsonLdTypes", () => {
	const ld = (json: string) =>
		`<script type="application/ld+json">${json}</script>`;

	it("reads a single object", () => {
		expect(extractJsonLdTypes(ld('{"@type":"Organization"}'))).toEqual([
			"Organization",
		]);
	});

	it("reads array @type values", () => {
		expect(extractJsonLdTypes(ld('{"@type":["Person","Thing"]}'))).toEqual([
			"Person",
			"Thing",
		]);
	});

	it("walks @graph and top-level arrays", () => {
		const html =
			ld('{"@graph":[{"@type":"WebSite"},{"@type":"Organization"}]}') +
			ld('[{"@type":"FAQPage"}]');
		expect(extractJsonLdTypes(html)).toEqual([
			"FAQPage",
			"Organization",
			"WebSite",
		]);
	});

	it("skips invalid JSON and removes duplicates", () => {
		const html =
			ld("{not json") +
			ld('{"@type":"Organization"}') +
			ld('{"@type":"Organization"}');
		expect(extractJsonLdTypes(html)).toEqual(["Organization"]);
	});
});

describe("runGeoChecks", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		lookupMock.mockReset();
		lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function route(llms: Response | Error, robots: Response | Error) {
		fetchMock.mockImplementation((url: string) => {
			const r = url.endsWith("/llms.txt") ? llms : robots;
			return r instanceof Error
				? Promise.reject(r)
				: Promise.resolve(r.clone());
		});
	}

	it("detects an llms.txt served as text", async () => {
		route(
			new Response("# Site", { status: 200 }),
			new Response("", { status: 404 })
		);
		const r = await runGeoChecks("https://example.com/page", null);
		expect(r.llmsTxt).toBe(true);
		expect(r.aiCrawlers).toBe("allowed");
		expect(r.jsonLdTypes).toEqual([]);
	});

	it("rejects an HTML page served as 200 for llms.txt", async () => {
		route(
			new Response("<!doctype html><html></html>", { status: 200 }),
			new Response("", { status: 404 })
		);
		const r = await runGeoChecks("https://example.com", null);
		expect(r.llmsTxt).toBe(false);
	});

	it("reads blocked crawlers and JSON-LD from the homepage", async () => {
		route(
			new Response("", { status: 404 }),
			new Response("User-agent: *\nDisallow: /", { status: 200 })
		);
		const r = await runGeoChecks(
			"https://example.com",
			'<script type="application/ld+json">{"@type":"Organization"}</script>'
		);
		expect(r.aiCrawlers).toBe("blocked");
		expect(r.blockedCrawlers).toHaveLength(5);
		expect(r.jsonLdTypes).toEqual(["Organization"]);
	});

	it("returns unknown and does not throw when fetches fail", async () => {
		route(new Error("boom"), new Error("boom"));
		const r = await runGeoChecks("https://example.com", null);
		expect(r).toEqual({
			llmsTxt: false,
			aiCrawlers: "unknown",
			blockedCrawlers: [],
			jsonLdTypes: [],
		});
	});

	it("returns unknown for a non-200, non-404 robots.txt", async () => {
		route(new Response("", { status: 404 }), new Response("", { status: 500 }));
		const r = await runGeoChecks("https://example.com", null);
		expect(r.aiCrawlers).toBe("unknown");
	});
});
