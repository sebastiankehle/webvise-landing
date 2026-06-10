import type { AnimatedIcon } from "@/components/marketing/card-hover-icon";
import { BotMessageSquareIcon } from "@/components/ui/bot-message-square";
import { CalendarCheckIcon } from "@/components/ui/calendar-check";
import { IdCardIcon } from "@/components/ui/id-card";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { WorkflowIcon } from "@/components/ui/workflow";

export interface CustomSystem {
	capabilityCount: number;
	exampleCount: number;
	faqCount: number;
	icon: AnimatedIcon;
	moduleCount: number;
	outcomeCount: number;
	proof: {
		caseStudySlug: string;
		image: string;
	};
	relatedSlugs: string[];
	slug: string;
	translationKey: string;
}

export const customSystems: CustomSystem[] = [
	{
		slug: "internal-tools-dashboards",
		translationKey: "internalTools",
		icon: LayoutGridIcon,
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "relay",
			image: "/images/case-studies/relay/margin-dashboard.png",
		},
		relatedSlugs: [
			"ai-assisted-workflow-automation",
			"client-portals-business-apps",
		],
	},
	{
		slug: "ai-assisted-workflow-automation",
		translationKey: "aiWorkflows",
		icon: BotMessageSquareIcon,
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "rautenberg-pitch-engine",
			image: "/images/case-studies/rautenberg-pitch-engine/pipeline.png",
		},
		relatedSlugs: ["internal-tools-dashboards", "website-to-app-upgrades"],
	},
	{
		slug: "client-portals-business-apps",
		translationKey: "portals",
		icon: IdCardIcon,
		exampleCount: 5,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "ohyp-fintech",
			image: "/images/case-studies/ohyp-fintech/admin-dashboard.png",
		},
		relatedSlugs: ["booking-event-platforms", "internal-tools-dashboards"],
	},
	{
		slug: "booking-event-platforms",
		translationKey: "booking",
		icon: CalendarCheckIcon,
		exampleCount: 6,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "ohyp-fintech",
			image: "/images/case-studies/ohyp-fintech/form.png",
		},
		relatedSlugs: ["client-portals-business-apps", "website-to-app-upgrades"],
	},
	{
		slug: "website-to-app-upgrades",
		translationKey: "websiteApps",
		icon: WorkflowIcon,
		exampleCount: 5,
		capabilityCount: 6,
		moduleCount: 6,
		outcomeCount: 4,
		faqCount: 3,
		proof: {
			caseStudySlug: "mp-bau-construction",
			image: "/images/case-studies/mp-bau-construction/hero.png",
		},
		relatedSlugs: [
			"internal-tools-dashboards",
			"ai-assisted-workflow-automation",
		],
	},
];

export function getCustomSystemBySlug(slug: string): CustomSystem | undefined {
	return customSystems.find((system) => system.slug === slug);
}

export function getCustomSystemNumber(slug: string): string {
	const index = customSystems.findIndex((system) => system.slug === slug);
	return String(index + 1).padStart(2, "0");
}
