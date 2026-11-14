export interface CustomSystem {
	capabilityCount: number;
	exampleCount: number;
	faqCount: number;
	moduleCount: number;
	outcomeCount: number;
	proof: {
		caseStudySlug: string;
		image: string;
		shots?: string[];
		still?: boolean;
		imageClassName?: string;
	};
	slug: string;
	translationKey: string;
}

export const customSystems: CustomSystem[] = [
	{
		slug: "internal-tools-dashboards",
		translationKey: "internalTools",
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "screencurve",
			image:
				"/images/case-studies/screencurve/archive.webp?v=20261114-open-movies",
		},
	},
	{
		slug: "agentic-workflow-automation",
		translationKey: "aiWorkflows",
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "rautenberg-pitch-engine",
			image:
				"/images/case-studies/rautenberg-pitch-engine/pipeline.webp?v=20261111-eagle-obsidian",
		},
	},
	{
		slug: "company-brain-memory-systems",
		translationKey: "companyBrain",
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "rautenberg-pitch-engine",
			image:
				"/images/case-studies/rautenberg-pitch-engine/vault-structure.webp?v=20261111-eagle-obsidian",
		},
	},
	{
		slug: "client-portals-business-apps",
		translationKey: "portals",
		exampleCount: 5,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "finanzierungszertifikat",
			image: "/images/case-studies/ohyp-fintech/admin-dashboard-v2.webp",
			// A portal has two sides: what the client fills in, what the team sees.
			shots: [
				"/images/case-studies/ohyp-fintech/form-step-v2.webp",
				"/images/case-studies/ohyp-fintech/admin-dashboard-v2.webp",
			],
		},
	},
	{
		slug: "booking-event-platforms",
		translationKey: "booking",
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "finanzierungszertifikat",
			image: "/images/case-studies/ohyp-fintech/form-step-v2.webp",
		},
	},
	{
		slug: "website-to-app-upgrades",
		translationKey: "websiteApps",
		exampleCount: 5,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "maerkische-projekt-bau",
			image: "/images/case-studies/mp-bau-construction/chatbot.webp?v=065b54f",
		},
	},
];

export function getCustomSystemBySlug(slug: string): CustomSystem | undefined {
	return customSystems.find((system) => system.slug === slug);
}
