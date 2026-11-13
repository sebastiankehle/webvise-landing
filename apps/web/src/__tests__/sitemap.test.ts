import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import proxy from "@/proxy";

vi.mock("next-intl/middleware", () => ({
	// The real middleware cannot load under Vitest's node environment.
	default: () => () => new Response(null, { status: 200 }),
}));

const entries = sitemap();

describe("sitemap", () => {
	it("lists only www URLs", () => {
		for (const entry of entries) {
			expect(entry.url.startsWith("https://www.webvise.io")).toBe(true);
		}
	});

	it("has no duplicate URLs", () => {
		const urls = entries.map((entry) => entry.url);
		expect(new Set(urls).size).toBe(urls.length);
	});

	it("lists no URL the proxy redirects or removes", () => {
		for (const entry of entries) {
			const status = proxy(new NextRequest(entry.url)).status;
			expect(
				[301, 302, 307, 308, 410],
				`${entry.url} -> ${status}`
			).not.toContain(status);
		}
	});

	it("points x-default at the de alternate", () => {
		for (const entry of entries) {
			const languages = entry.alternates?.languages as Record<string, string>;
			expect(languages["x-default"]).toBe(languages.de);
		}
	});
});
