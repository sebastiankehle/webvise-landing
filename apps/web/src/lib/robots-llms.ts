import {
	type CrawlerKind,
	type CrawlerName,
	GENERATOR_CRAWLERS,
} from "@webvise-app/api/services/robots-llms/crawlers";
import { SITE_URL } from "@webvise-app/api/site";

export type Access = "allow" | "block";
export type CrawlerAccess = Record<CrawlerName, Access>;
export type AccessPreset = "allowAll" | "blockTraining" | "blockAi";

export const CRAWLER_KINDS: readonly CrawlerKind[] = [
	"search",
	"aiSearch",
	"training",
	"user",
];

function accessWhere(block: (kind: CrawlerKind) => boolean): CrawlerAccess {
	return Object.fromEntries(
		GENERATOR_CRAWLERS.map((c) => [c.name, block(c.kind) ? "block" : "allow"])
	) as CrawlerAccess;
}

export function presetAccess(preset: AccessPreset): CrawlerAccess {
	if (preset === "blockTraining") {
		return accessWhere((kind) => kind === "training");
	}
	if (preset === "blockAi") {
		return accessWhere((kind) => kind !== "search");
	}
	return accessWhere(() => false);
}

/** Access as an existing robots.txt sets it, from the crawlers it blocks. */
export function accessFromBlocked(blocked: readonly string[]): CrawlerAccess {
	const names = new Set(blocked);
	return Object.fromEntries(
		GENERATOR_CRAWLERS.map((c) => [
			c.name,
			names.has(c.name) ? "block" : "allow",
		])
	) as CrawlerAccess;
}

const LINE_RE = /\r?\n/;

/** One path per line; blank lines and comments dropped, a leading / added. */
export function parsePathList(text: string): string[] {
	const paths = text
		.split(LINE_RE)
		.map((line) => (line.split("#")[0] ?? "").trim())
		.filter(Boolean)
		.map((path) =>
			path.startsWith("/") || path.startsWith("*") ? path : `/${path}`
		);
	return [...new Set(paths)];
}

export interface RobotsConfig {
	access: CrawlerAccess;
	allowPaths: string[];
	disallowPaths: string[];
	sitemapUrl: string;
}

const KIND_COMMENTS: Record<CrawlerKind, string> = {
	search: "Search engines",
	aiSearch: "AI search",
	training: "AI training",
	user: "Fetches when a person asks an AI assistant",
};

export function buildRobotsTxt({
	access,
	allowPaths,
	disallowPaths,
	sitemapUrl,
}: RobotsConfig): string {
	const rules = [
		...allowPaths.map((path) => `Allow: ${path}`),
		...disallowPaths.map((path) => `Disallow: ${path}`),
	];
	const lines = [
		`# Made with ${SITE_URL}/tools/robots-llms-generator`,
		"",
		"User-agent: *",
		...(rules.length > 0 ? rules : ["Allow: /"]),
	];

	// A crawler with its own group ignores the * group. When * already blocks
	// the whole site, allowed crawlers need their own group; otherwise blocked
	// ones do.
	const listed: Access = disallowPaths.includes("/") ? "allow" : "block";
	for (const kind of CRAWLER_KINDS) {
		const names = GENERATOR_CRAWLERS.filter(
			(c) => c.kind === kind && access[c.name] === listed
		).map((c) => c.name);
		if (names.length === 0) {
			continue;
		}
		lines.push("", `# ${KIND_COMMENTS[kind]}`);
		names.forEach((name, index) => {
			if (index > 0) {
				lines.push("");
			}
			lines.push(
				`User-agent: ${name}`,
				listed === "block" ? "Disallow: /" : "Allow: /"
			);
		});
	}

	const sitemap = sitemapUrl.trim();
	if (sitemap) {
		lines.push("", `Sitemap: ${sitemap}`);
	}
	return `${lines.join("\n")}\n`;
}

export interface LlmsLinkInput {
	note: string;
	title: string;
	url: string;
}

export interface LlmsSectionInput {
	links: LlmsLinkInput[];
	title: string;
}

export interface LlmsConfig {
	details: string;
	sections: LlmsSectionInput[];
	siteName: string;
	siteUrl: string | null;
	summary: string;
}

const WHITESPACE_RE = /\s+/g;
const BRACKET_RE = /[[\]]/g;
const PAREN_RE = /[()]/g;
const HTTP_URL_RE = /^https?:\/\//i;

function oneLine(text: string): string {
	return text.replace(WHITESPACE_RE, " ").trim();
}

/** The site's origin from what a visitor typed, or null if it is no URL. */
export function normalizeSiteUrl(input: string): string | null {
	const value = input.trim();
	if (!value) {
		return null;
	}
	try {
		const url = new URL(HTTP_URL_RE.test(value) ? value : `https://${value}`);
		return url.hostname.includes(".") ? url.origin : null;
	} catch {
		return null;
	}
}

function absoluteUrl(href: string, siteUrl: string | null): string | null {
	if (!href) {
		return null;
	}
	try {
		return HTTP_URL_RE.test(href) || !siteUrl
			? new URL(href).href
			: new URL(href, siteUrl).href;
	} catch {
		return href;
	}
}

function formatLink(link: LlmsLinkInput, siteUrl: string | null) {
	const href = absoluteUrl(link.url.trim(), siteUrl);
	if (!href) {
		return null;
	}
	const text = (oneLine(link.title) || href).replace(BRACKET_RE, "\\$&");
	// Parentheses would end the Markdown link early.
	const target = href.replace(PAREN_RE, (c) => (c === "(" ? "%28" : "%29"));
	const note = oneLine(link.note);
	return `- [${text}](${target})${note ? `: ${note}` : ""}`;
}

/** An llms.txt in the llmstxt.org format: H1, blockquote, H2 link lists. */
export function buildLlmsTxt({
	details,
	sections,
	siteName,
	siteUrl,
	summary,
}: LlmsConfig): string {
	const name =
		oneLine(siteName) || (siteUrl ? new URL(siteUrl).hostname : "Website");
	const parts = [`# ${name}`];
	const quote = oneLine(summary);
	if (quote) {
		parts.push(`> ${quote}`);
	}
	if (details.trim()) {
		parts.push(details.trim());
	}
	for (const section of sections) {
		const links = section.links
			.map((link) => formatLink(link, siteUrl))
			.filter((line) => line !== null);
		if (links.length > 0) {
			parts.push(
				`## ${oneLine(section.title) || "Links"}\n\n${links.join("\n")}`
			);
		}
	}
	return `${parts.join("\n\n")}\n`;
}

const LOCALE_SEGMENT_RE = /^[a-z]{2}(?:-[a-z]{2,4})?$/i;
const FILE_EXTENSION_RE = /\.(?:html?|php|aspx?)$/i;
const WORD_SEPARATOR_RE = /[-_+]+/g;

/** "case-studies" -> "Case studies" */
export function titleFromSlug(slug: string): string {
	let text = slug;
	try {
		text = decodeURIComponent(slug);
	} catch {
		// keep the raw slug
	}
	text = oneLine(
		text.replace(FILE_EXTENSION_RE, "").replace(WORD_SEPARATOR_RE, " ")
	);
	return text.charAt(0).toUpperCase() + text.slice(1);
}

interface SitemapPage {
	href: string;
	segments: string[];
}

function toPages(urls: string[]): SitemapPage[] {
	const seen = new Set<string>();
	const pages: SitemapPage[] = [];
	for (const raw of urls) {
		let url: URL;
		try {
			url = new URL(raw);
		} catch {
			continue;
		}
		const segments = url.pathname.split("/").filter(Boolean);
		const key = `${url.hostname}/${segments.join("/")}${url.search}`;
		if (!seen.has(key)) {
			seen.add(key);
			pages.push({ href: url.href, segments });
		}
	}
	return pages;
}

/**
 * Keep one language. Pages without a language prefix win; if every page has
 * one, the most common prefix wins. A code counts as a prefix only when it
 * starts at least two paths, so a lone /ux page stays a page.
 */
function oneLanguage(pages: SitemapPage[]): SitemapPage[] {
	const counts = new Map<string, number>();
	for (const page of pages) {
		const first = page.segments[0];
		if (first && LOCALE_SEGMENT_RE.test(first)) {
			counts.set(first, (counts.get(first) ?? 0) + 1);
		}
	}
	const prefixes = new Set(
		[...counts].filter(([, count]) => count > 1).map(([code]) => code)
	);
	if (prefixes.size === 0) {
		return pages;
	}
	const isPrefixed = (page: SitemapPage) =>
		prefixes.has(page.segments[0] ?? "");
	const unprefixed = pages.filter((page) => !isPrefixed(page));
	if (unprefixed.some((page) => page.segments.length > 0)) {
		return unprefixed;
	}
	const [top] = [...prefixes].sort(
		(a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
	);
	return pages
		.filter((page) => page.segments[0] === top)
		.map((page) => ({ ...page, segments: page.segments.slice(1) }));
}

/**
 * Turn sitemap URLs into llms.txt sections: top-level pages under
 * `rootTitle`, deeper pages grouped by their first folder. A folder with a
 * single page joins the top-level section. The homepage is left out.
 */
export function sectionsFromUrls(
	urls: string[],
	{
		rootTitle,
		maxLinks = 30,
		maxPerSection = 10,
	}: { rootTitle: string; maxLinks?: number; maxPerSection?: number }
): LlmsSectionInput[] {
	const groups = new Map<string, SitemapPage[]>([["", []]]);
	for (const page of oneLanguage(toPages(urls))) {
		if (page.segments.length === 0) {
			continue;
		}
		const key = page.segments.length > 1 ? (page.segments[0] ?? "") : "";
		groups.set(key, [...(groups.get(key) ?? []), page]);
	}
	for (const [key, pages] of groups) {
		if (key && pages.length === 1) {
			groups.get("")?.push(...pages);
			groups.delete(key);
		}
	}

	let room = maxLinks;
	const sections: LlmsSectionInput[] = [];
	for (const [key, pages] of groups) {
		const links = pages.slice(0, Math.min(maxPerSection, room)).map((page) => ({
			title: titleFromSlug(page.segments.at(-1) ?? ""),
			url: page.href,
			note: "",
		}));
		room -= links.length;
		if (links.length > 0) {
			sections.push({ title: key ? titleFromSlug(key) : rootTitle, links });
		}
	}
	return sections;
}
