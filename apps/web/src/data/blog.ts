import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type Block =
	| { type: "p"; text: string }
	| { type: "h2"; text: string }
	| { type: "h3"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "table"; headers: string[]; rows: string[][] };

export interface LocaleContent {
	title: string;
	excerpt: string;
	blocks: Block[];
}

export interface BlogPost {
	slug: string;
	date: string;
	readingTime: number;
	keyword: string;
	title: string;
	excerpt: string;
	blocks: Block[];
}

interface BlogPostMeta {
	slug: string;
	date: string;
	readingTime: number;
	keyword: string;
}

const blogPostsMeta: BlogPostMeta[] = [
	{
		slug: "wordpress-site-speed",
		date: "2026-03-08",
		readingTime: 5,
		keyword: "is wordpress too slow",
	},
	{
		slug: "hidden-cost-of-wordpress",
		date: "2026-03-08",
		readingTime: 6,
		keyword: "wordpress cost",
	},
	{
		slug: "wordpress-security-2026",
		date: "2026-03-08",
		readingTime: 7,
		keyword: "wordpress security problems",
	},
	{
		slug: "wordpress-to-nextjs-case-study",
		date: "2026-03-09",
		readingTime: 7,
		keyword: "wordpress to nextjs case study",
	},
	{
		slug: "should-i-migrate-wordpress-to-nextjs",
		date: "2026-03-09",
		readingTime: 6,
		keyword: "wordpress to nextjs migration",
	},
	{
		slug: "wordpress-to-nextjs-migration-faq",
		date: "2026-03-09",
		readingTime: 8,
		keyword: "wordpress nextjs migration FAQ",
	},
	{
		slug: "wordpress-slow-on-mobile",
		date: "2026-03-09",
		readingTime: 7,
		keyword: "wordpress slow on mobile",
	},
	{
		slug: "wordpress-alternatives-small-business-2026",
		date: "2026-03-09",
		readingTime: 9,
		keyword: "wordpress alternatives for small business 2026",
	},
	{
		slug: "will-i-lose-seo-rankings-rebuild",
		date: "2026-03-09",
		readingTime: 9,
		keyword: "will I lose SEO if I rebuild my website",
	},
	{
		slug: "wordpress-vs-nextjs-for-business-website",
		date: "2026-03-09",
		readingTime: 10,
		keyword: "wordpress vs nextjs for business website",
	},
];

const contentDir = join(process.cwd(), "content/blog");

function loadContent(slug: string, locale: string): LocaleContent {
	const localePath = join(contentDir, slug, `${locale}.json`);
	if (existsSync(localePath)) {
		return JSON.parse(readFileSync(localePath, "utf-8"));
	}
	// Fallback to English if the requested locale is not available
	const enPath = join(contentDir, slug, "en.json");
	return JSON.parse(readFileSync(enPath, "utf-8"));
}

function toPost(meta: BlogPostMeta, locale: string): BlogPost {
	const content = loadContent(meta.slug, locale);
	return {
		slug: meta.slug,
		date: meta.date,
		readingTime: meta.readingTime,
		keyword: meta.keyword,
		title: content.title,
		excerpt: content.excerpt,
		blocks: content.blocks,
	};
}

export function getBlogPosts(locale: string): BlogPost[] {
	return blogPostsMeta.map((meta) => toPost(meta, locale));
}

export function getBlogPostBySlug(
	slug: string,
	locale: string,
): BlogPost | undefined {
	const meta = blogPostsMeta.find((p) => p.slug === slug);
	if (!meta) return undefined;
	return toPost(meta, locale);
}

// backwards compat for sitemap.ts
export const blogPosts = getBlogPosts("en");
