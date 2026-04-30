import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type Block =
	| { type: "p"; text: string }
	| { type: "h2"; text: string }
	| { type: "h3"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "table"; headers: string[]; rows: string[][] }
	| { type: "download"; title: string; description: string; reportId: string };

export interface BlogPost {
	blocks: Block[];
	date: string;
	excerpt: string;
	keyword: string;
	metaDescription?: string;
	readingTime: number;
	slug: string;

	tags?: string[];
	title: string;
}

interface PostFile {
	blocks: Block[];
	date: string;
	excerpt: string;
	keyword: string;
	metaDescription?: string;
	readingTime: number;

	tags?: string[];
	title: string;
}

interface LocaleContent {
	blocks: Block[];
	excerpt: string;
	metaDescription?: string;

	tags?: string[];
	title: string;
}

const contentDir = join(process.cwd(), "content/blog");

const postCache = new Map<string, PostFile | LocaleContent>();
const collectionCache = new Map<string, BlogPost[]>();
const indexCache = new Map<string, BlogIndexEntry[]>();
let slugsCache: string[] | null = null;

export interface BlogIndexEntry {
	date: string;
	excerpt: string;
	readingTime: number;
	slug: string;
	tags?: string[];
	title: string;
}

function cacheKey(slug: string, locale: string): string {
	return `${slug}:${locale}`;
}

function readPostFile(
	slug: string,
	locale: string
): PostFile | LocaleContent | null {
	const key = cacheKey(slug, locale);
	const cached = postCache.get(key);
	if (cached) {
		return cached;
	}

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) {
		return null;
	}

	const data = JSON.parse(readFileSync(filePath, "utf-8"));
	postCache.set(key, data);
	return data;
}

function getEnglishPost(slug: string): PostFile | null {
	return readPostFile(slug, "en") as PostFile | null;
}

function loadContent(
	slug: string,
	locale: string
): { meta: PostFile; content: LocaleContent } | null {
	const enPost = getEnglishPost(slug);
	if (!enPost) {
		return null;
	}

	if (locale === "en") {
		return { meta: enPost, content: enPost };
	}

	const localeContent = readPostFile(slug, locale) as LocaleContent | null;
	return {
		meta: enPost,
		content: localeContent ?? enPost,
	};
}

/** Discover all post slugs from content/blog directories */
function getPostSlugs(): string[] {
	if (slugsCache) {
		return slugsCache;
	}
	if (!existsSync(contentDir)) {
		slugsCache = [];
		return slugsCache;
	}
	slugsCache = readdirSync(contentDir).filter((entry) => {
		const entryPath = join(contentDir, entry);
		return (
			statSync(entryPath).isDirectory() &&
			existsSync(join(entryPath, "en.json"))
		);
	});
	return slugsCache;
}

function toPost(slug: string, locale: string): BlogPost | null {
	const result = loadContent(slug, locale);
	if (!result) {
		return null;
	}
	const { meta, content } = result;
	return {
		slug,
		date: meta.date,
		readingTime: meta.readingTime,
		keyword: meta.keyword,
		title: content.title,
		excerpt: content.excerpt,
		metaDescription: content.metaDescription,
		tags: content.tags ?? meta.tags,
		blocks: content.blocks,
	};
}

export function getBlogPosts(locale: string): BlogPost[] {
	const cached = collectionCache.get(locale);
	if (cached) {
		return cached;
	}
	const posts = getPostSlugs()
		.map((slug) => toPost(slug, locale))
		.filter((post): post is BlogPost => post !== null)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	collectionCache.set(locale, posts);
	return posts;
}

export function getBlogIndex(locale: string): BlogIndexEntry[] {
	const cached = indexCache.get(locale);
	if (cached) {
		return cached;
	}
	const index = getBlogPosts(locale).map(
		({ slug, title, date, readingTime, excerpt, tags }) => ({
			slug,
			title,
			date,
			readingTime,
			excerpt,
			tags,
		})
	);
	indexCache.set(locale, index);
	return index;
}

export const getBlogPostBySlug = cache(
	(slug: string, locale: string): BlogPost | undefined =>
		toPost(slug, locale) ?? undefined
);

export function getAdjacentPosts(
	slug: string,
	locale: string
): { prev: BlogIndexEntry | null; next: BlogIndexEntry | null } {
	const index = getBlogIndex(locale);
	const i = index.findIndex((p) => p.slug === slug);
	if (i === -1) {
		return { prev: null, next: null };
	}
	return {
		prev: i < index.length - 1 ? index[i + 1] : null,
		next: i > 0 ? index[i - 1] : null,
	};
}

// backwards compat for sitemap.ts
export const blogPosts = getBlogPosts("en");
