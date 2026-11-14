import { GENERATOR_CRAWLERS } from "@webvise-app/api/services/robots-llms/crawlers";
import { describe, expect, it } from "vitest";

import {
	accessFromBlocked,
	buildLlmsTxt,
	buildRobotsTxt,
	normalizeSiteUrl,
	parsePathList,
	presetAccess,
	sectionsFromUrls,
	titleFromSlug,
} from "@/lib/robots-llms";

const HEADER = "# Made with https://www.webvise.io/tools/robots-llms-generator";

function blocked(access: Record<string, string>): string[] {
	return Object.entries(access)
		.filter(([, value]) => value === "block")
		.map(([name]) => name);
}

describe("presetAccess", () => {
	it("allows everything by default", () => {
		expect(blocked(presetAccess("allowAll"))).toEqual([]);
	});

	it("blocks only training crawlers", () => {
		expect(blocked(presetAccess("blockTraining"))).toEqual(
			GENERATOR_CRAWLERS.filter((c) => c.kind === "training").map((c) => c.name)
		);
	});

	it("blocks every AI crawler but keeps search engines", () => {
		const access = presetAccess("blockAi");
		expect(access.Googlebot).toBe("allow");
		expect(access.Bingbot).toBe("allow");
		expect(access["OAI-SearchBot"]).toBe("block");
		expect(access["ChatGPT-User"]).toBe("block");
	});
});

describe("accessFromBlocked", () => {
	it("blocks the named crawlers and ignores unknown names", () => {
		expect(blocked(accessFromBlocked(["GPTBot", "SomeBot"]))).toEqual([
			"GPTBot",
		]);
	});
});

describe("parsePathList", () => {
	it("trims, drops blanks and comments, adds a slash and removes duplicates", () => {
		expect(
			parsePathList(" /wp-admin/ \n\nprivate\n# note\n/wp-admin/\n*.pdf$\n")
		).toEqual(["/wp-admin/", "/private", "*.pdf$"]);
	});
});

describe("buildRobotsTxt", () => {
	const base = {
		access: presetAccess("allowAll"),
		allowPaths: [],
		disallowPaths: [],
		sitemapUrl: "",
	};

	it("allows everything when nothing is set", () => {
		expect(buildRobotsTxt(base)).toBe(`${HEADER}\n\nUser-agent: *\nAllow: /\n`);
	});

	it("gives each blocked crawler its own group under its kind", () => {
		const text = buildRobotsTxt({
			access: accessFromBlocked(["GPTBot", "ClaudeBot", "ChatGPT-User"]),
			allowPaths: ["/wp-admin/admin-ajax.php"],
			disallowPaths: ["/wp-admin/"],
			sitemapUrl: " https://example.com/sitemap.xml ",
		});
		expect(text).toBe(
			[
				HEADER,
				"",
				"User-agent: *",
				"Allow: /wp-admin/admin-ajax.php",
				"Disallow: /wp-admin/",
				"",
				"# AI training",
				"User-agent: GPTBot",
				"Disallow: /",
				"",
				"User-agent: ClaudeBot",
				"Disallow: /",
				"",
				"# Fetches when a person asks an AI assistant",
				"User-agent: ChatGPT-User",
				"Disallow: /",
				"",
				"Sitemap: https://example.com/sitemap.xml",
				"",
			].join("\n")
		);
	});

	it("lists allowed crawlers instead when * blocks the whole site", () => {
		const access = presetAccess("blockAi");
		access.PerplexityBot = "allow";
		const text = buildRobotsTxt({ ...base, access, disallowPaths: ["/"] });
		expect(text).toContain("User-agent: *\nDisallow: /\n");
		expect(text).toContain("User-agent: PerplexityBot\nAllow: /");
		expect(text).toContain("User-agent: Googlebot\nAllow: /");
		expect(text).not.toContain("User-agent: GPTBot");
	});
});

describe("normalizeSiteUrl", () => {
	it("returns the origin and adds https", () => {
		expect(normalizeSiteUrl(" example.com/blog?x=1 ")).toBe(
			"https://example.com"
		);
		expect(normalizeSiteUrl("http://www.example.com")).toBe(
			"http://www.example.com"
		);
	});

	it("rejects text that is not a site", () => {
		expect(normalizeSiteUrl("")).toBeNull();
		expect(normalizeSiteUrl("localhost")).toBeNull();
		expect(normalizeSiteUrl("not a url")).toBeNull();
	});
});

describe("buildLlmsTxt", () => {
	it("writes the llmstxt.org layout", () => {
		const text = buildLlmsTxt({
			siteName: "Acme",
			summary: "We build\ntools.",
			details: "Based in Berlin.",
			siteUrl: "https://acme.com",
			sections: [
				{
					title: "Services",
					links: [
						{ title: "Web [apps]", url: "/services/web", note: "What we do" },
						{ title: "", url: "https://acme.com/a(b)", note: "" },
						{ title: "Empty", url: "  ", note: "" },
					],
				},
				{ title: "Nothing", links: [{ title: "x", url: "", note: "" }] },
				{
					title: "",
					links: [
						{ title: "Imprint", url: "https://acme.com/imprint", note: "" },
					],
				},
			],
		});
		expect(text).toBe(
			[
				"# Acme",
				"",
				"> We build tools.",
				"",
				"Based in Berlin.",
				"",
				"## Services",
				"",
				"- [Web \\[apps\\]](https://acme.com/services/web): What we do",
				"- [https://acme.com/a(b)](https://acme.com/a%28b%29)",
				"",
				"## Links",
				"",
				"- [Imprint](https://acme.com/imprint)",
				"",
			].join("\n")
		);
	});

	it("falls back to the host name when the site name is empty", () => {
		expect(
			buildLlmsTxt({
				siteName: " ",
				summary: "",
				details: "",
				siteUrl: "https://www.acme.com",
				sections: [],
			})
		).toBe("# www.acme.com\n");
	});
});

describe("titleFromSlug", () => {
	it("turns a slug into words", () => {
		expect(titleFromSlug("case-studies")).toBe("Case studies");
		expect(titleFromSlug("caf%C3%A9_menu.html")).toBe("Café menu");
	});
});

describe("sectionsFromUrls", () => {
	it("groups by first folder and folds single pages into the root", () => {
		expect(
			sectionsFromUrls(
				[
					"https://a.com/",
					"https://a.com/about/",
					"https://a.com/about",
					"https://a.com/blog/first-post",
					"https://a.com/blog/second-post",
					"https://a.com/legal/imprint",
				],
				{ rootTitle: "Pages" }
			)
		).toEqual([
			{
				title: "Pages",
				links: [
					{ title: "About", url: "https://a.com/about/", note: "" },
					{ title: "Imprint", url: "https://a.com/legal/imprint", note: "" },
				],
			},
			{
				title: "Blog",
				links: [
					{
						title: "First post",
						url: "https://a.com/blog/first-post",
						note: "",
					},
					{
						title: "Second post",
						url: "https://a.com/blog/second-post",
						note: "",
					},
				],
			},
		]);
	});

	it("keeps pages without a language prefix", () => {
		const sections = sectionsFromUrls(
			[
				"https://a.com/services",
				"https://a.com/en/services",
				"https://a.com/faq",
				"https://a.com/en/faq",
				"https://a.com/ux",
			],
			{ rootTitle: "Pages" }
		);
		expect(sections.flatMap((s) => s.links.map((l) => l.url))).toEqual([
			"https://a.com/services",
			"https://a.com/faq",
			"https://a.com/ux",
		]);
	});

	it("strips the main language prefix when every page has one", () => {
		const sections = sectionsFromUrls(
			[
				"https://a.com/en",
				"https://a.com/en/blog/a",
				"https://a.com/en/blog/b",
				"https://a.com/en/contact",
				"https://a.com/de/kontakt",
				"https://a.com/de/blog/a",
			],
			{ rootTitle: "Pages" }
		);
		expect(sections.map((s) => s.title)).toEqual(["Pages", "Blog"]);
		expect(sections[0]?.links.map((l) => l.url)).toEqual([
			"https://a.com/en/contact",
		]);
	});

	it("caps links per section and in total", () => {
		const urls = [
			...Array.from({ length: 20 }, (_, i) => `https://a.com/blog/p${i}`),
			...Array.from({ length: 20 }, (_, i) => `https://a.com/docs/d${i}`),
		];
		const sections = sectionsFromUrls(urls, {
			rootTitle: "Pages",
			maxLinks: 15,
			maxPerSection: 10,
		});
		expect(sections.map((s) => s.links.length)).toEqual([10, 5]);
	});
});
