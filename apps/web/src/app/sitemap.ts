import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { routing } from "@/i18n/routing";
import { services } from "@/data/services";

const baseUrl = "https://webvise.io";

function alternates(path: string) {
	const languages: Record<string, string> = {};
	for (const locale of routing.locales) {
		languages[locale] =
			locale === routing.defaultLocale
				? `${baseUrl}${path}`
				: `${baseUrl}/${locale}${path}`;
	}
	languages["x-default"] = `${baseUrl}${path}`;
	return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
	const servicePages = services.map((service) => ({
		url: `${baseUrl}/services/${service.slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.8,
		alternates: alternates(`/services/${service.slug}`),
	}));

	const caseStudyPages = getCaseStudies("en").map((cs) => ({
		url: `${baseUrl}/case-studies/${cs.slug}`,
		lastModified: new Date(cs.date),
		changeFrequency: "monthly" as const,
		priority: 0.7,
		alternates: alternates(`/case-studies/${cs.slug}`),
	}));

	const blogPages = blogPosts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.date),
		changeFrequency: "monthly" as const,
		priority: 0.7,
		alternates: alternates(`/blog/${post.slug}`),
	}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
			alternates: alternates("/"),
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
			alternates: alternates("/blog"),
		},
		{
			url: `${baseUrl}/case-studies`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
			alternates: alternates("/case-studies"),
		},
		{
			url: `${baseUrl}/media`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
			alternates: alternates("/media"),
		},
		{
			url: `${baseUrl}/wp-health-report`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
			alternates: alternates("/wp-health-report"),
		},
		...servicePages,
		...caseStudyPages,
		...blogPages,
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
			alternates: alternates("/privacy"),
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
			alternates: alternates("/terms"),
		},
		{
			url: `${baseUrl}/imprint`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
			alternates: alternates("/imprint"),
		},
	];
}
