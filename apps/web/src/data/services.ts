export interface Service {
	deliverableCount: number;
	faqCount: number;
	featureCount: number;
	painPointCount: number;
	proof: {
		caseStudySlug: string;
		image: string;
		/** Two screens to show under the approach, instead of the project's first two. */
		shots?: string[];
		/** Show the picture itself where the project would play its live scene. */
		still?: boolean;
		imageClassName?: string;
	};
	slug: string;
	toolCount: number;
	translationKey: string;
}

export const services: Service[] = [
	{
		slug: "landing-pages",
		translationKey: "landingPages",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "hyyve",
			image: "/images/case-studies/hyyve/hero.webp",
			// A landing page is shown as the page itself, not as a diagram.
			still: true,
		},
	},
	{
		slug: "seo-geo",
		translationKey: "seoGeo",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			// The work is judged on this site itself: its own Lighthouse report,
			// structured data and llms.txt.
			caseStudySlug: "webvise",
			image: "/images/case-studies/webvise/hero-v2.webp",
			still: true,
		},
	},
	{
		slug: "wordpress-migration",
		translationKey: "wordpressMigration",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 5,
		proof: {
			caseStudySlug: "maerkische-projekt-bau",
			// A migration is judged by the site that came out of it: its real
			// first screen and two of its pages, not the internal portal.
			image: "/images/case-studies/mp-bau-construction/site-hero.webp",
			shots: [
				"/images/case-studies/mp-bau-construction/references.webp?v=065b54f",
				"/images/case-studies/mp-bau-construction/team.webp?v=065b54f",
			],
			still: true,
		},
	},
	{
		slug: "ai-consulting",
		translationKey: "aiConsulting",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "maerkische-projekt-bau",
			image:
				"/images/case-studies/mp-bau-construction/admin-portal.webp?v=065b54f",
		},
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "screencurve",
			image: "/images/case-studies/screencurve/hero.webp",
		},
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "rautenberg-pitch-engine",
			image:
				"/images/case-studies/rautenberg-pitch-engine/docx-output.webp?v=20261111-eagle-obsidian",
		},
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "screencurve",
			image: "/images/case-studies/screencurve/ask-the-film.webp",
		},
	},
];

export const serviceCaseStudies: Record<string, string[]> = {
	"landing-pages": ["old-world-labs", "maerkische-projekt-bau"],
	"wordpress-migration": ["maerkische-projekt-bau"],
	"ai-consulting": ["maerkische-projekt-bau"],
	"mvp-development": ["finanzierungszertifikat"],
	"ai-automation": ["maerkische-projekt-bau"],
	"full-stack-applications": ["finanzierungszertifikat", "keel"],
};

export const relatedServices: Record<string, string[]> = {
	"landing-pages": ["wordpress-migration", "mvp-development"],
	"seo-geo": ["landing-pages", "wordpress-migration"],
	"wordpress-migration": ["landing-pages", "full-stack-applications"],
	"ai-consulting": ["ai-automation", "mvp-development"],
	"mvp-development": ["full-stack-applications", "ai-consulting"],
	"ai-automation": ["ai-consulting", "full-stack-applications"],
	"full-stack-applications": ["mvp-development", "ai-automation"],
};

export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
