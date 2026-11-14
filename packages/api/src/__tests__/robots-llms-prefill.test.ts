import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lookupMock = vi.fn();

vi.mock("node:dns/promises", () => ({
	lookup: (...args: unknown[]) => lookupMock(...args),
}));

const { parseRobotsForAiCrawlers, parseRobotsWildcardRules } = await import(
	"@webvise-app/api/services/wp-health/geo-checks"
);
const {
	extractPageMeta,
	extractSitemapLines,
	parseSitemapXml,
	pickChildSitemaps,
	prefillFromSite,
} = await import("@webvise-app/api/services/robots-llms/prefill");

const WP_ROBOTS = [
	"User-agent: *",
	"Disallow: /wp-admin/",
	"Allow: /wp-admin/admin-ajax.php",
	"",
	"User-agent: GPTBot",
	"User-agent: CCBot",
	"Disallow: /",
	"",
	"Sitemap: https://www.example.com/sitemap_index.xml",
].join("\n");

describe("parseRobotsForAiCrawlers with a custom crawler list", () => {
	it("checks the crawlers it is given", () => {
		expect(
			parseRobotsForAiCrawlers(WP_ROBOTS, ["GPTBot", "OAI-SearchBot", "CCBot"])
		).toEqual({ status: "partly-blocked", blocked: ["GPTBot", "CCBot"] });
	});

	it("reports blocked when every given crawler is blocked", () => {
		expect(
			parseRobotsForAiCrawlers("User-agent: *\nDisallow: /", ["Bytespider"])
				.status
		).toBe("blocked");
	});
});

describe("parseRobotsWildcardRules", () => {
	it("returns the * group's paths", () => {
		expect(parseRobotsWildcardRules(WP_ROBOTS)).toEqual({
			allow: ["/wp-admin/admin-ajax.php"],
			disallow: ["/wp-admin/"],
		});
	});

	it("skips empty Disallow lines and files without a * group", () => {
		expect(parseRobotsWildcardRules("User-agent: *\nDisallow:")).toEqual({
			allow: [],
			disallow: [],
		});
		expect(parseRobotsWildcardRules("User-agent: GPTBot\nDisallow: /")).toEqual(
			{ allow: [], disallow: [] }
		);
	});
});

describe("extractSitemapLines", () => {
	it("reads every Sitemap line once, in any case", () => {
		expect(
			extractSitemapLines(
				"sitemap: https://a.com/one.xml\nSITEMAP:https://a.com/two.xml\nSitemap: https://a.com/one.xml\nSitemap: /relative.xml"
			)
		).toEqual(["https://a.com/one.xml", "https://a.com/two.xml"]);
	});
});

describe("parseSitemapXml", () => {
	it("reads a urlset with CDATA and entities", () => {
		const xml = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url><loc>https://a.com/</loc></url>
			<url><loc><![CDATA[https://a.com/blog/post?x=1]]></loc></url>
			<url><loc>https://a.com/a?x=1&amp;y=2</loc><image:image><image:loc>https://a.com/i.png</image:loc></image:image></url>
		</urlset>`;
		expect(parseSitemapXml(xml)).toEqual({
			kind: "urlset",
			locs: [
				"https://a.com/",
				"https://a.com/blog/post?x=1",
				"https://a.com/a?x=1&y=2",
			],
		});
	});

	it("tells an index from a urlset", () => {
		const xml =
			'<sitemapindex xmlns="x"><sitemap><loc>https://a.com/page-sitemap.xml</loc></sitemap></sitemapindex>';
		expect(parseSitemapXml(xml)).toEqual({
			kind: "index",
			locs: ["https://a.com/page-sitemap.xml"],
		});
	});

	it("returns none for HTML", () => {
		expect(parseSitemapXml("<!doctype html><html></html>").kind).toBe("none");
	});
});

describe("pickChildSitemaps", () => {
	it("skips archive sitemaps and puts pages before posts", () => {
		expect(
			pickChildSitemaps([
				"https://a.com/post-sitemap.xml",
				"https://a.com/category-sitemap.xml",
				"https://a.com/page-sitemap.xml",
				"https://a.com/product-sitemap.xml",
				"https://a.com/author-sitemap.xml",
				"https://a.com/faq-sitemap.xml",
			])
		).toEqual([
			"https://a.com/page-sitemap.xml",
			"https://a.com/post-sitemap.xml",
			"https://a.com/product-sitemap.xml",
		]);
	});
});

describe("extractPageMeta", () => {
	it("reads title, description and site name from the head", () => {
		const html = `<html><head>
			<title>  Acme &amp; Co &#8211; Tools  </title>
			<meta content="We build &quot;tools&quot;." name="description">
			<meta property='og:site_name' content='Acme'>
		</head><body><svg><title>Icon</title></svg></body></html>`;
		expect(extractPageMeta(html)).toEqual({
			title: "Acme & Co – Tools",
			description: 'We build "tools".',
			siteName: "Acme",
		});
	});

	it("falls back to og:description and returns null for what is missing", () => {
		expect(
			extractPageMeta(
				'<head><meta property="og:description" content="From OG"></head>'
			)
		).toEqual({ title: null, description: "From OG", siteName: null });
	});
});

describe("prefillFromSite", () => {
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

	function serve(routes: Record<string, Response>) {
		fetchMock.mockImplementation((url: string) => {
			const res = routes[url];
			return res
				? Promise.resolve(res.clone())
				: Promise.resolve(new Response("", { status: 404 }));
		});
	}

	it("reads robots.txt, a sitemap index and the homepage", async () => {
		serve({
			"https://example.com/": Response.redirect(
				"https://www.example.com/",
				301
			),
			"https://www.example.com/": new Response(
				"<head><title>Example</title><meta name='description' content='Hi'></head>",
				{ status: 200 }
			),
			"https://example.com/robots.txt": new Response(WP_ROBOTS, {
				status: 200,
			}),
			"https://www.example.com/sitemap_index.xml": new Response(
				"<sitemapindex><sitemap><loc>https://www.example.com/post-sitemap.xml</loc></sitemap><sitemap><loc>https://www.example.com/category-sitemap.xml</loc></sitemap><sitemap><loc>https://www.example.com/page-sitemap.xml</loc></sitemap></sitemapindex>",
				{ status: 200 }
			),
			"https://www.example.com/page-sitemap.xml": new Response(
				"<urlset><url><loc>https://www.example.com/about/</loc></url><url><loc>https://cdn.other.com/x</loc></url></urlset>",
				{ status: 200 }
			),
			"https://www.example.com/post-sitemap.xml": new Response(
				"<urlset><url><loc>https://example.com/hello-world/</loc></url><url><loc>https://www.example.com/about/</loc></url></urlset>",
				{ status: 200 }
			),
		});

		const outcome = await prefillFromSite("https://example.com/some/page");
		expect(outcome).toEqual({
			ok: true,
			result: {
				siteUrl: "https://www.example.com",
				robots: {
					found: true,
					blocked: ["GPTBot", "CCBot"],
					allow: ["/wp-admin/admin-ajax.php"],
					disallow: ["/wp-admin/"],
					sitemaps: ["https://www.example.com/sitemap_index.xml"],
				},
				sitemapUrl: "https://www.example.com/sitemap_index.xml",
				pageUrls: [
					"https://www.example.com/about/",
					"https://example.com/hello-world/",
				],
				title: "Example",
				description: "Hi",
				siteName: null,
			},
		});
		expect(fetchMock).not.toHaveBeenCalledWith(
			"https://www.example.com/category-sitemap.xml",
			expect.anything()
		);
	});

	it("falls back to /sitemap.xml and treats an HTML robots.txt as missing", async () => {
		serve({
			"https://example.com/": new Response("<title>Ex</title>", {
				status: 200,
			}),
			"https://example.com/robots.txt": new Response(
				"<!doctype html><p>Not found</p>",
				{ status: 200 }
			),
			"https://example.com/sitemap.xml": new Response(
				"<urlset><url><loc>https://example.com/a</loc></url></urlset>",
				{ status: 200 }
			),
		});

		const outcome = await prefillFromSite("https://example.com");
		expect(outcome.ok && outcome.result.robots.found).toBe(false);
		expect(outcome.ok && outcome.result.sitemapUrl).toBe(
			"https://example.com/sitemap.xml"
		);
		expect(outcome.ok && outcome.result.pageUrls).toEqual([
			"https://example.com/a",
		]);
	});

	it("returns an empty result when every fetch fails", async () => {
		fetchMock.mockRejectedValue(new Error("boom"));
		expect(await prefillFromSite("https://example.com")).toEqual({
			ok: true,
			result: {
				siteUrl: "https://example.com",
				robots: {
					found: false,
					blocked: [],
					allow: [],
					disallow: [],
					sitemaps: [],
				},
				sitemapUrl: null,
				pageUrls: [],
				title: null,
				description: null,
				siteName: null,
			},
		});
	});

	it("refuses private addresses without fetching", async () => {
		const outcome = await prefillFromSite("http://127.0.0.1:3000");
		expect(outcome).toEqual({ ok: false, message: "This URL is not allowed." });
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
