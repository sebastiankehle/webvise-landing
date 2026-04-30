import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { routing } from "@/i18n/routing";

const baseUrl = "https://webvise.io";

type ChangeFrequency = NonNullable<
	MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface EntryOptions {
	changeFrequency: ChangeFrequency;
	lastModified: Date;
	priority: number;
}

function localizedUrl(path: string, locale: string): string {
	return locale === routing.defaultLocale
		? `${baseUrl}${path}`
		: `${baseUrl}/${locale}${path}`;
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

	const servicePages = services.flatMap((service) =>
		entriesForPath(`/services/${service.slug}`, {
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
			lastModified: new Date(post.date),
			changeFrequency: "monthly",
			priority: 0.7,
		})
	);

	return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages];
}
