import { readdirSync } from "node:fs";
import path from "node:path";

import { expect, type Page, test } from "@playwright/test";

/**
 * WEB-589: Next 16.4 predicted the route tree of unvisited /en pages, the
 * @cta slot came back different, and the client repeated that prefetch
 * without pause while the link stayed in view: thousands of requests a
 * second. A page may prefetch each link once, then go quiet.
 */

const caseStudies = readdirSync(
	// biome-ignore lint/correctness/noGlobalDirnameFilename: Playwright loads this spec as CommonJS, where import.meta fails.
	path.join(__dirname, "../content/case-studies")
);
const routes = ["", "/book", ...caseStudies.map((s) => `/case-studies/${s}`)];
const pages = routes.flatMap((route) => [route || "/", `/en${route}`]);

/** The same prefetch (page and segment) may run twice at most. */
const MAX_REPEATS = 2;
/** Time after the scroll for the last prefetches to finish. */
const SETTLE_MS = 2000;
/** Then no prefetch at all for this long. */
const QUIET_MS = 3000;

/** Scroll down one screen at a time, so every link enters the viewport. */
function scrollToEnd(page: Page) {
	return page.evaluate(async () => {
		const pause = () => new Promise((resolve) => setTimeout(resolve, 300));
		for (
			let y = 0;
			y < document.documentElement.scrollHeight;
			y += window.innerHeight
		) {
			window.scrollTo(0, y);
			await pause();
		}
		window.scrollTo(0, document.documentElement.scrollHeight);
	});
}

for (const url of pages) {
	test(`${url} prefetches each link once, then stops`, async ({ page }) => {
		const counts = new Map<string, number>();
		const sentAt: number[] = [];
		page.on("request", (request) => {
			const headers = request.headers();
			const segment = headers["next-router-segment-prefetch"];
			if (segment === undefined && !headers["next-router-prefetch"]) {
				return;
			}
			const key = `${new URL(request.url()).pathname} ${segment ?? ""}`;
			counts.set(key, (counts.get(key) ?? 0) + 1);
			sentAt.push(Date.now());
		});

		const response = await page.goto(url);
		expect(response?.ok()).toBe(true);
		await scrollToEnd(page);
		await page.waitForTimeout(SETTLE_MS);
		const settled = Date.now();
		await page.waitForTimeout(QUIET_MS);

		const repeated = [...counts].filter(([, n]) => n > MAX_REPEATS);
		expect(repeated).toEqual([]);
		expect(sentAt.filter((t) => t >= settled)).toEqual([]);
	});
}
