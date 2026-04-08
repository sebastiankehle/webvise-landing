import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { services } from "@/data/services";

const baseUrl = "https://webvise.io";

const serviceNames: Record<string, string> = {
	"landing-pages": "Landing Pages",
	"wordpress-migration": "WordPress Migration",
	"ai-consulting": "AI Consulting",
	"mvp-development": "MVP Development",
	"ai-automation": "AI Automation",
	"full-stack-applications": "Full-Stack Applications",
};

export function GET() {
	const caseStudies = getCaseStudies("en");

	const serviceLines = services
		.map(
			(service) =>
				`- [${serviceNames[service.slug] ?? service.slug}](${baseUrl}/services/${service.slug})`,
		)
		.join("\n");

	const caseStudyLines = caseStudies
		.map(
			(cs) =>
				`- [${cs.title}](${baseUrl}/case-studies/${cs.slug}): ${cs.excerpt}`,
		)
		.join("\n");

	const blogLines = blogPosts
		.map(
			(post) => `- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.excerpt}`,
		)
		.join("\n");

	const body = `# Webvise

> Webvise is a software studio building AI-powered web applications, landing pages, WordPress migrations, MVPs, and full-stack products for founders and growing companies.

We ship production-ready websites and custom software with a focus on performance, accessibility, SEO, and measurable business outcomes. This file follows the llmstxt.org convention to help language models discover our most useful, human-authored content.

## Services

${serviceLines}

## Case Studies

${caseStudyLines}

## Blog

${blogLines}

## Company

- [About](${baseUrl}/about): Who we are and how we work.
- [Contact](${baseUrl}/#contact): Get in touch about a project.
- [WP Health Report](${baseUrl}/wp-health-report): Free WordPress site health audit tool.

## Optional

- [Privacy Policy](${baseUrl}/privacy)
- [Terms](${baseUrl}/terms)
- [Imprint](${baseUrl}/imprint)
- [Sitemap](${baseUrl}/sitemap.xml)
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
