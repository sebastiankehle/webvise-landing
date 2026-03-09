import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

export type Block =
	| { type: "p"; text: string }
	| { type: "h2"; text: string }
	| { type: "h3"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "table"; headers: string[]; rows: string[][] };

export interface BlogPost {
	slug: string;
	date: string;
	readingTime: number;
	keyword: string;
	title: string;
	excerpt: string;
	blocks: Block[];
}

interface PostFile {
	date: string;
	readingTime: number;
	keyword: string;
	title: string;
	excerpt: string;
	blocks: Block[];
}

interface LocaleContent {
	title: string;
	excerpt: string;
	blocks: Block[];
}

const contentDir = join(process.cwd(), "content/blog");

// Cache parsed post files
const postCache = new Map<string, PostFile | LocaleContent>();

function cacheKey(slug: string, locale: string): string {
	return `${slug}:${locale}`;
}

function readPostFile(slug: string, locale: string): PostFile | LocaleContent | null {
	const key = cacheKey(slug, locale);
	const cached = postCache.get(key);
	if (cached) return cached;

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) return null;

	const data = JSON.parse(readFileSync(filePath, "utf-8"));
	postCache.set(key, data);
	return data;
}

function getEnglishPost(slug: string): PostFile | null {
	return readPostFile(slug, "en") as PostFile | null;
}

function loadContent(slug: string, locale: string): { meta: PostFile; content: LocaleContent } | null {
	const enPost = getEnglishPost(slug);
	if (!enPost) return null;

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
	if (!existsSync(contentDir)) return [];
	return readdirSync(contentDir).filter((entry) => {
		const entryPath = join(contentDir, entry);
		return statSync(entryPath).isDirectory() && existsSync(join(entryPath, "en.json"));
	});
}

function toPost(slug: string, locale: string): BlogPost | null {
	const result = loadContent(slug, locale);
	if (!result) return null;
	const { meta, content } = result;
	return {
		slug,
		date: meta.date,
		readingTime: meta.readingTime,
		keyword: meta.keyword,
		title: content.title,
		excerpt: content.excerpt,
		blocks: content.blocks,
	};
}

export function getBlogPosts(locale: string): BlogPost[] {
	return getPostSlugs()
		.map((slug) => toPost(slug, locale))
		.filter((post): post is BlogPost => post !== null)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string, locale: string): BlogPost | undefined {
	return toPost(slug, locale) ?? undefined;
}

// backwards compat for sitemap.ts
export const blogPosts = getBlogPosts("en");
