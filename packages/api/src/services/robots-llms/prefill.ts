import { type SafeFetchResult, safeFetchText } from "../../safe-fetch";
import { UrlValidationError, validateUrl } from "../../url-validation";
import {
	parseRobotsForAiCrawlers,
	parseRobotsWildcardRules,
} from "../wp-health/geo-checks";
import { GENERATOR_CRAWLER_NAMES } from "./crawlers";

/** Most page URLs sent back to the browser; it picks its own few from these. */
export const MAX_PAGE_URLS = 200;
const MAX_CHILD_SITEMAPS = 3;
const MAX_SITEMAP_CANDIDATES = 3;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;

const HEADERS = { "User-Agent": "webvise-robots-llms-generator/1.0" };
const TEXT_OPTIONS = {
	timeoutMs: 6000,
	maxBytes: 200_000,
	maxRedirects: 3,
	headers: HEADERS,
};
const LARGE_OPTIONS = { ...TEXT_OPTIONS, maxBytes: 2_000_000 };

export interface RobotsSnapshot {
	allow: string[];
	/** Generator crawlers the current file blocks from the whole site. */
	blocked: string[];
	disallow: string[];
	found: boolean;
	sitemaps: string[];
}

export interface PageMeta {
	description: string | null;
	siteName: string | null;
	title: string | null;
}

export interface PrefillResult extends PageMeta {
	pageUrls: string[];
	robots: RobotsSnapshot;
	sitemapUrl: string | null;
	/** Origin after redirects, e.g. https://www.example.com */
	siteUrl: string;
}

export type PrefillOutcome =
	| { ok: true; result: PrefillResult }
	| { ok: false; message: string };

const ENTITY_RE = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi;
const NAMED_ENTITIES: Record<string, string> = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	nbsp: " ",
	quot: '"',
};

function decodeEntities(text: string): string {
	return text.replace(ENTITY_RE, (match, code: string) => {
		const lower = code.toLowerCase();
		if (lower.startsWith("#")) {
			const point = lower.startsWith("#x")
				? Number.parseInt(lower.slice(2), 16)
				: Number.parseInt(lower.slice(1), 10);
			return Number.isFinite(point) && point > 0 && point <= 0x10_ff_ff
				? String.fromCodePoint(point)
				: match;
		}
		return NAMED_ENTITIES[lower] ?? match;
	});
}

const WHITESPACE_RE = /\s+/g;

function cleanText(raw: string | undefined, max: number): string | null {
	const text = decodeEntities(raw ?? "")
		.replace(WHITESPACE_RE, " ")
		.trim();
	return text ? text.slice(0, max) : null;
}

const SITEMAP_LINE_RE = /^\s*sitemap\s*:\s*(\S+)/gim;
const HTTP_URL_RE = /^https?:\/\//i;

export function extractSitemapLines(robotsTxt: string): string[] {
	const urls = [...robotsTxt.matchAll(SITEMAP_LINE_RE)]
		.map((m) => m[1] ?? "")
		.filter((url) => HTTP_URL_RE.test(url));
	return [...new Set(urls)];
}

const LOC_RE = /<loc>\s*(?:<!\[CDATA\[)?\s*([^<]*?)\s*(?:\]\]>)?\s*<\/loc>/gi;
const SITEMAP_INDEX_RE = /<sitemapindex[\s>]/i;
const URLSET_RE = /<urlset[\s>]/i;

export function parseSitemapXml(xml: string): {
	kind: "index" | "urlset" | "none";
	locs: string[];
} {
	let kind: "index" | "urlset" | "none" = "none";
	if (SITEMAP_INDEX_RE.test(xml)) {
		kind = "index";
	} else if (URLSET_RE.test(xml)) {
		kind = "urlset";
	}
	const locs = [...xml.matchAll(LOC_RE)]
		.map((m) => decodeEntities(m[1] ?? "").trim())
		.filter((loc) => HTTP_URL_RE.test(loc));
	return { kind, locs };
}

// Archive and media sitemaps list few pages worth a link in llms.txt.
const SKIPPED_SITEMAP_RE =
	/(category|tag|author|user|taxonom|format|attachment|image|video)/i;
const PAGE_SITEMAP_RE = /page/i;
const POST_SITEMAP_RE = /post/i;

/** Child sitemaps to read from an index: pages first, then posts. */
export function pickChildSitemaps(locs: string[]): string[] {
	const rank = (url: string) => {
		if (PAGE_SITEMAP_RE.test(url)) {
			return 0;
		}
		return POST_SITEMAP_RE.test(url) ? 1 : 2;
	};
	return locs
		.filter((url) => !SKIPPED_SITEMAP_RE.test(url))
		.map((url, index) => ({ url, index }))
		.sort((a, b) => rank(a.url) - rank(b.url) || a.index - b.index)
		.slice(0, MAX_CHILD_SITEMAPS)
		.map((entry) => entry.url);
}

const HEAD_END_RE = /<\/head>/i;
const TITLE_RE = /<title[^>]*>([\s\S]*?)<\/title>/i;
const META_TAG_RE = /<meta\s[^>]*>/gi;
const ATTR_RE = /([a-z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

function metaAttributes(tag: string): Record<string, string> {
	const attrs: Record<string, string> = {};
	for (const m of tag.matchAll(ATTR_RE)) {
		attrs[(m[1] ?? "").toLowerCase()] = m[2] ?? m[3] ?? "";
	}
	return attrs;
}

/** Title, meta description and og:site_name from a page's <head>. */
export function extractPageMeta(html: string): PageMeta {
	const headEnd = html.search(HEAD_END_RE);
	const head = headEnd === -1 ? html : html.slice(0, headEnd);
	const meta: Record<string, string> = {};
	for (const match of head.matchAll(META_TAG_RE)) {
		const attrs = metaAttributes(match[0]);
		const key = (attrs.name ?? attrs.property ?? "").toLowerCase();
		if (key && attrs.content !== undefined && !(key in meta)) {
			meta[key] = attrs.content;
		}
	}
	return {
		title: cleanText(TITLE_RE.exec(head)?.[1], MAX_TITLE_LENGTH),
		description: cleanText(
			meta.description ?? meta["og:description"],
			MAX_DESCRIPTION_LENGTH
		),
		siteName: cleanText(meta["og:site_name"], MAX_TITLE_LENGTH),
	};
}

async function fetchOrNull(
	url: string,
	options: typeof TEXT_OPTIONS
): Promise<SafeFetchResult | null> {
	try {
		return await safeFetchText(url, options);
	} catch {
		return null;
	}
}

function readRobots(res: SafeFetchResult | null): RobotsSnapshot {
	const text = res?.status === 200 ? res.text : "";
	// Some sites answer every path, robots.txt included, with an HTML page.
	if (!text.trim() || text.trimStart().startsWith("<")) {
		return { found: false, blocked: [], allow: [], disallow: [], sitemaps: [] };
	}
	return {
		found: true,
		blocked: parseRobotsForAiCrawlers(text, GENERATOR_CRAWLER_NAMES).blocked,
		...parseRobotsWildcardRules(text),
		sitemaps: extractSitemapLines(text),
	};
}

const WWW_RE = /^www\./;

function sameSite(urls: string[], siteUrl: string): string[] {
	const host = new URL(siteUrl).hostname.replace(WWW_RE, "");
	const kept = urls.filter((url) => {
		try {
			return new URL(url).hostname.replace(WWW_RE, "") === host;
		} catch {
			return false;
		}
	});
	return [...new Set(kept)].slice(0, MAX_PAGE_URLS);
}

/** The first sitemap that answers, with an index followed one level down. */
async function findSitemap(
	siteUrl: string,
	declared: string[]
): Promise<{ url: string; urls: string[] } | null> {
	const candidates = [
		...new Set([
			...declared,
			`${siteUrl}/sitemap.xml`,
			`${siteUrl}/sitemap_index.xml`,
			`${siteUrl}/wp-sitemap.xml`,
		]),
	].slice(0, MAX_SITEMAP_CANDIDATES);

	for (const url of candidates) {
		const res = await fetchOrNull(url, LARGE_OPTIONS);
		const parsed = parseSitemapXml(res?.status === 200 ? res.text : "");
		if (parsed.kind === "urlset") {
			return { url, urls: sameSite(parsed.locs, siteUrl) };
		}
		if (parsed.kind === "index") {
			const children = await Promise.all(
				pickChildSitemaps(parsed.locs).map((child) =>
					fetchOrNull(child, LARGE_OPTIONS)
				)
			);
			const locs = children.flatMap((child) =>
				child?.status === 200 ? parseSitemapXml(child.text).locs : []
			);
			return { url, urls: sameSite(locs, siteUrl) };
		}
	}
	return null;
}

/**
 * Read what a site already publishes (robots.txt, sitemap, homepage <head>)
 * so the generator form can start from it. Each part fails on its own.
 */
export async function prefillFromSite(input: string): Promise<PrefillOutcome> {
	let origin: string;
	try {
		origin = new URL(input).origin;
		await validateUrl(origin);
	} catch (err) {
		return {
			ok: false,
			message:
				err instanceof UrlValidationError ? err.message : "Invalid URL format.",
		};
	}

	const [home, robotsRes] = await Promise.all([
		fetchOrNull(`${origin}/`, LARGE_OPTIONS),
		fetchOrNull(`${origin}/robots.txt`, TEXT_OPTIONS),
	]);
	// Follow the homepage's redirects, e.g. example.com -> www.example.com.
	const siteUrl = home && home.status < 400 ? new URL(home.url).origin : origin;
	const robots = readRobots(robotsRes);
	const sitemap = await findSitemap(siteUrl, robots.sitemaps);
	const meta =
		home?.status === 200
			? extractPageMeta(home.text)
			: { title: null, description: null, siteName: null };

	return {
		ok: true,
		result: {
			siteUrl,
			robots,
			sitemapUrl: sitemap?.url ?? null,
			pageUrls: sitemap?.urls ?? [],
			...meta,
		},
	};
}
