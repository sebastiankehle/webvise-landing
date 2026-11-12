import type { BookingTopic } from "@/data/booking";

/** A broad field webvise has built for. `proof` lists the projects that back
 * the page, first one shown live in the hero; `services` are the offerings
 * its three "what webvise builds" lines link to, in the same order. */
export interface Industry {
	proof: string[];
	services: [string, string, string];
	slug: string;
	topic: BookingTopic;
}

export const industries: Industry[] = [
	{
		slug: "construction-real-estate",
		proof: ["maerkische-projekt-bau", "finanzierungszertifikat"],
		services: [
			"landing-pages",
			"agentic-workflow-automation",
			"full-stack-applications",
		],
		topic: "software",
	},
	{
		slug: "manufacturing",
		proof: ["old-world-labs", "kernspan"],
		services: ["landing-pages", "landing-pages", "wordpress-migration"],
		topic: "website",
	},
	{
		slug: "media-entertainment",
		proof: ["screencurve", "rautenberg-pitch-engine"],
		services: [
			"full-stack-applications",
			"company-brain-memory-systems",
			"ai-consulting",
		],
		topic: "automation",
	},
	{
		slug: "software-it",
		proof: ["hyyve", "keel", "morrow"],
		services: [
			"landing-pages",
			"mvp-development",
			"agentic-workflow-automation",
		],
		topic: "software",
	},
	{
		slug: "professional-services",
		proof: ["finanzierungszertifikat", "von-platen-coaching", "relay"],
		services: [
			"landing-pages",
			"landing-pages",
			"client-portals-business-apps",
		],
		topic: "software",
	},
	{
		slug: "local-business",
		proof: ["von-platen-coaching", "maerkische-projekt-bau", "kernspan"],
		services: ["landing-pages", "landing-pages", "wordpress-migration"],
		topic: "website",
	},
];

export function getIndustryBySlug(slug: string): Industry | undefined {
	return industries.find((industry) => industry.slug === slug);
}
