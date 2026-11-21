import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import proxy from "@/proxy";

vi.mock("next-intl/middleware", () => ({
	// The real middleware cannot load under Vitest's node environment.
	default: () => () =>
		new Response(null, {
			status: 200,
			headers: { "set-cookie": "NEXT_LOCALE=en; Path=/; SameSite=lax" },
		}),
}));

const request = (path: string, headers?: HeadersInit) =>
	new NextRequest(`https://www.webvise.io${path}`, { headers });

describe("proxy", () => {
	it.each(["/fr", "/fr/blog/x", "/it"])("answers 410 for %s", (path) => {
		expect(proxy(request(path)).status).toBe(410);
	});

	it.each([
		"/blog/agent-memory-vs-context",
		"/en/blog/agent-memory-vs-context",
		"/de/blog/agent-memory-vs-context",
	])("answers 410 for deleted post %s", (path) => {
		expect(proxy(request(path)).status).toBe(410);
	});

	it.each([
		["/de", "/"],
		["/de/blog/some-post", "/blog/some-post"],
		["/de/impressum", "/impressum"],
	])("redirects %s to %s with 308", (path, target) => {
		const response = proxy(request(path));
		expect(response.status).toBe(308);
		expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
			target
		);
	});

	it("keeps the locale cookie on a page load", () => {
		const response = proxy(request("/en", { "sec-fetch-dest": "document" }));
		expect(response.headers.get("set-cookie")).toContain("NEXT_LOCALE=en");
	});

	it.each([
		["fr-FR,fr;q=0.9", "en"],
		["nl", "en"],
		["en-GB", "en"],
		["fr-FR, de;q=0.5", "fr-FR, de;q=0.5"],
		["de-CH", "de-CH"],
		["*", "*"],
	])("hands next-intl %s as %s", (sent, seen) => {
		const visit = request("/", { "accept-language": sent });
		proxy(visit);
		expect(visit.headers.get("accept-language")).toBe(seen);
	});

	it("leaves a request without a language list alone", () => {
		const visit = request("/");
		proxy(visit);
		expect(visit.headers.get("accept-language")).toBeNull();
	});

	it("drops the locale cookie on a router fetch", () => {
		const response = proxy(request("/en", { "sec-fetch-dest": "empty" }));
		expect(response.headers.get("set-cookie")).toBeNull();
	});
});
