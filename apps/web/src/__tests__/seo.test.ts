import { describe, expect, it } from "vitest";

import { generateAlternates, localizedUrl } from "@/lib/seo";

describe("localizedUrl", () => {
	it.each([
		["/", "de", "https://www.webvise.io/"],
		["/", "en", "https://www.webvise.io/en"],
		["/imprint", "de", "https://www.webvise.io/impressum"],
		["/imprint", "en", "https://www.webvise.io/en/imprint"],
		["/privacy", "de", "https://www.webvise.io/datenschutz"],
	])("%s in %s is %s", (path, locale, expected) => {
		expect(localizedUrl(path, locale)).toBe(expected);
	});
});

describe("generateAlternates", () => {
	it("sets canonical and x-default", () => {
		const alternates = generateAlternates("/blog/x", "en");
		expect(alternates.canonical).toBe("https://www.webvise.io/en/blog/x");
		expect(alternates.languages["x-default"]).toBe(alternates.languages.de);
	});
});
