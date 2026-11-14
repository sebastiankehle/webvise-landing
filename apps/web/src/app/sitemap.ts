import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { industries } from "@/data/industries";
import { offerings } from "@/data/offerings";
import { routing } from "@/i18n/routing";
import { generateAlternates, localizedUrl } from "@/lib/seo";

type ChangeFrequency = NonNullable<
	MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface EntryOptions {
	changeFrequency: ChangeFrequency;
	lastModified: Date;
	priority: number;
}

function entriesForPath(
	path: string,
	options: EntryOptions
): MetadataRoute.Sitemap {
	const { languages } = generateAlternates(path, routing.defaultLocale);
	return routing.locales.map((locale) => ({
		url: localizedUrl(path, locale),
		lastModified: options.lastModified,
		changeFrequency: options.changeFrequency,
		priority: options.priority,
		alternates: { languages },
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
		...entriesForPath("/services", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		}),
		...entriesForPath("/faq", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.6,
		}),
		...entriesForPath("/wp-health-report", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		}),
		...entriesForPath("/tools/robots-llms-generator", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		}),
		...entriesForPath("/tools/ai-visibility-check", {
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

	const industryPages = [
		...entriesForPath("/industries", {
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		}),
		...industries.flatMap((industry) =>
			entriesForPath(`/industries/${industry.slug}`, {
				lastModified: now,
				changeFrequency: "monthly",
				priority: 0.7,
			})
		),
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

	return [
		...staticPages,
		...servicePages,
		...industryPages,
		...caseStudyPages,
		...blogPages,
	];
}
