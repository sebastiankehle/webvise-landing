import { detectTechnology } from "@webvise-app/api/services/wp-health/tech-detect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("detectTechnology", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function html(body: string, headers: Record<string, string> = {}) {
		return new Response(body, { status: 200, headers });
	}

	it("detects WordPress via /wp-content/ in HTML", async () => {
		fetchMock.mockResolvedValueOnce(
			html('<link href="/wp-content/themes/x/style.css" />')
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(true);
		expect(t.isPHP).toBe(true);
	});

	it("detects WordPress via /wp-includes/", async () => {
		fetchMock.mockResolvedValueOnce(
			html('<script src="/wp-includes/js/x.js"></script>')
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(true);
	});

	it("detects WordPress via generator meta tag", async () => {
		fetchMock.mockResolvedValueOnce(
			html('<meta name="generator" content="WordPress 6.4" />')
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(true);
	});

	it("detects WordPress via x-powered-by header", async () => {
		fetchMock.mockResolvedValueOnce(
			html("<html />", { "X-Powered-By": "WordPress 6.4" })
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(true);
	});

	it("detects WordPress via wp-json Link header", async () => {
		fetchMock.mockResolvedValueOnce(
			html("<html />", {
				Link: '<https://x.test/wp-json/>; rel="https://api.w.org/"',
			})
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(true);
	});

	it("detects PHP via x-powered-by even when not WordPress", async () => {
		fetchMock.mockResolvedValueOnce(
			html("<html />", { "X-Powered-By": "PHP/8.2" })
		);
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(false);
		expect(t.isPHP).toBe(true);
	});

	it("detects PHP via .php URL pattern in HTML", async () => {
		fetchMock.mockResolvedValueOnce(html('<a href="/login.php">login</a>'));
		const t = await detectTechnology("https://example.com");
		expect(t.isPHP).toBe(true);
	});

	it("returns false flags for a clean HTML page", async () => {
		fetchMock.mockResolvedValueOnce(html("<html><body>Hello</body></html>"));
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(false);
		expect(t.isPHP).toBe(false);
	});

	it("returns false flags when the fetch throws (no crash on the audit)", async () => {
		fetchMock.mockRejectedValueOnce(new Error("ENOTFOUND"));
		const t = await detectTechnology("https://example.com");
		expect(t.isWordPress).toBe(false);
		expect(t.isPHP).toBe(false);
	});
});
