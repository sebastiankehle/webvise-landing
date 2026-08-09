import { blogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";
import { offeringGroups } from "@/data/offerings";
import { SITE_URL } from "@/lib/seo";

const baseUrl = SITE_URL;

const offeringNames: Record<string, string> = {
	"landing-pages": "Landing Pages and Launch Sites",
	"mvp-development": "MVPs and Product Prototypes",
	"website-to-app-upgrades": "Website Workflow Layers",
	"wordpress-migration": "WordPress and Legacy Migrations",
	"internal-tools-dashboards": "Internal Tools and Dashboards",
	"client-portals-business-apps": "Client Portals and Business Apps",
	"booking-event-platforms": "Booking and Event Platforms",
	"full-stack-applications": "Custom Business Applications",
	"ai-consulting": "AI Auditing and Consulting",
	"ai-automation": "AI Workflow Automation",
	"company-brain-memory-systems": "Company Brain Systems",
	"agentic-workflow-automation": "AI Agents with Review Gates",
};

const groupTitles = {
	launch: "Launch",
	operate: "Operate",
	automate: "Automate",
} as const;

const offeringDescriptions: Record<string, string> = {
	"landing-pages":
		"Fast campaign and marketing pages with analytics, lead capture, and strong performance.",
	"mvp-development":
		"Lean first versions with auth, core workflows, data, deployment, and validation loops.",
	"website-to-app-upgrades":
		"Application behavior added to existing websites: qualification flows, forms, CRM handoffs, dashboards, automations, AI assistants, and admin review screens.",
	"wordpress-migration":
		"WordPress and legacy sites rebuilt on a maintainable stack with SEO, content, redirects, performance, and migration risk handled.",
	"internal-tools-dashboards":
		"Operational dashboards and admin tools that replace spreadsheets and manual status tracking.",
	"client-portals-business-apps":
		"Authenticated portals and business apps for clients, files, forms, notifications, and admin workflows.",
	"booking-event-platforms":
		"Booking, registration, reminder, check-in, admin, integration, and reporting workflows.",
	"full-stack-applications":
		"Production applications with product UX, backend logic, integrations, deployment, and monitoring.",
	"ai-consulting":
		"AI opportunity audits that map workflows, data, risks, review gates, and the smallest useful prototype or build plan.",
	"ai-automation":
		"Production AI workflows for extraction, routing, reporting, handoffs, review states, monitoring, and fallbacks.",
	"company-brain-memory-systems":
		"Knowledge and memory systems that make decisions, documents, project context, and operating rules reusable.",
	"agentic-workflow-automation":
		"Tool-using AI agents for bounded operational tasks, with permissions, queues, monitoring, and human approval where risk requires it.",
};

export function GET() {
	const caseStudies = getCaseStudies("en");

	const serviceLines = offeringGroups
		.map((group) => {
			const title = groupTitles[group.key];
			const lines = group.items
				.map(
					(offering) =>
						`- [${offeringNames[offering.slug] ?? offering.slug}](${baseUrl}/services/${offering.slug}): ${offeringDescriptions[offering.slug]}`
				)
				.join("\n");

			return `### ${title}\n\n${lines}`;
		})
		.join("\n");

	const caseStudyLines = caseStudies
		.map(
			(cs) =>
				`- [${cs.title}](${baseUrl}/case-studies/${cs.slug}): ${cs.excerpt}`
		)
		.join("\n");

	const blogLines = blogPosts
		.map(
			(post) =>
				`- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.excerpt}`
		)
		.join("\n");

	const body = `# Webvise

> Webvise is an engineer-led AI-native software studio for custom software, internal tools, portals, dashboards, agentic workflows, and production-ready business applications.

We ship custom business software with direct engineering ownership, practical AI-native delivery, performance, accessibility, SEO, and measurable business outcomes. Services are organized as Launch, Operate, and Automate so buyers can start from the workflow before choosing technology. This file follows the llmstxt.org convention to help language models discover our most useful, human-authored content.

## Services

${serviceLines}

## Projects

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
