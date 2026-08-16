import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { offerings } from "@/data/offerings";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const baseUrl = SITE_URL;

type ChangeFrequency = NonNullable<
	MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface EntryOptions {
	changeFrequency: ChangeFrequency;
	lastModified: Date;
	priority: number;
}

/** Resolve per-locale pathnames (e.g. /imprint → /impressum for de) so the
 * sitemap never lists a URL that 307-redirects to its localized twin. */
function localizedPath(path: string, locale: string): string {
	const pathnames = routing.pathnames[path as keyof typeof routing.pathnames];
	if (typeof pathnames === "object" && pathnames !== null) {
		return (pathnames as Record<string, string>)[locale] ?? path;
	}
	return path;
}

function localizedUrl(path: string, locale: string): string {
	const resolved = localizedPath(path, locale);
	return locale === routing.defaultLocale
		? `${baseUrl}${resolved}`
		: `${baseUrl}/${locale}${resolved}`;
}

function alternatesFor(path: string) {
	const languages: Record<string, string> = {};
	for (const locale of routing.locales) {
		languages[locale] = localizedUrl(path, locale);
	}
	languages["x-default"] = localizedUrl(path, routing.defaultLocale);
	return { languages };
}

function entriesForPath(
	path: string,
	options: EntryOptions
): MetadataRoute.Sitemap {
	const alternates = alternatesFor(path);
	return routing.locales.map((locale) => ({
		url: localizedUrl(path, locale),
		lastModified: options.lastModified,
		changeFrequency: options.changeFrequency,
		priority: options.priority,
		alternates,
	}));
}

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	const staticPages: MetadataRoute.Sitemap = [
		...entriesForPath("/", {
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		}),
		...entriesForPath("/blog", {
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		}),
		...entriesForPath("/case-studies", {
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		}),
		...entriesForPath("/wp-health-report", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		}),
		...entriesForPath("/about", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.5,
		}),
		...entriesForPath("/book", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		}),
		...entriesForPath("/privacy", {
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3,
		}),
		...entriesForPath("/terms", {
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3,
		}),
		...entriesForPath("/imprint", {
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.3,
		}),
	];

	const servicePages = offerings.flatMap((offering) =>
		entriesForPath(`/services/${offering.slug}`, {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		})
	);

	const caseStudyPages = getCaseStudies("en").flatMap((cs) =>
		entriesForPath(`/case-studies/${cs.slug}`, {
			lastModified: new Date(cs.date),
			changeFrequency: "monthly",
			priority: 0.7,
		})
	);

	const blogPages = blogPosts.flatMap((post) =>
		entriesForPath(`/blog/${post.slug}`, {
			lastModified: new Date(post.updated ?? post.date),
			changeFrequency: "monthly",
			priority: 0.7,
		})
	);

	return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages];
}
