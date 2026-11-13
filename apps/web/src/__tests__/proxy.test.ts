import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import proxy from "@/proxy";

vi.mock("next-intl/middleware", () => ({
	// The real middleware cannot load under Vitest's node environment.
	default: () => () => new Response(null, { status: 200 }),
}));

const request = (path: string) =>
	new NextRequest(`https://www.webvise.io${path}`);

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
});
