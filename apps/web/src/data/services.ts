export interface Service {
	slug: string;
	translationKey: string;
	featureCount: number;
	deliverableCount: number;
	toolCount: number;
	painPointCount: number;
}

export const services: Service[] = [
	{
		slug: "landing-pages",
		translationKey: "landingPages",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
	},
	{
		slug: "seo-performance",
		translationKey: "seoPerformance",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "website-redesign",
		translationKey: "websiteRedesign",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
];

export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
