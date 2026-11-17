import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { generateAlternates, localizedUrl, shareImage } from "@/lib/seo";

describe("shareImage", () => {
	it("points at a picture that exists", () => {
		const { url } = shareImage("");
		expect(existsSync(join(import.meta.dirname, "../../public", url))).toBe(
			true
		);
	});
});

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
