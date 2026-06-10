import type { AnimatedIcon } from "@/components/marketing/card-hover-icon";
import { BrainIcon } from "@/components/ui/brain";
import { FlaskIcon } from "@/components/ui/flask";
import { LayersIcon } from "@/components/ui/layers";
import { LayoutPanelTopIcon } from "@/components/ui/layout-panel-top";
import { RouteIcon } from "@/components/ui/route";
import { WaypointsIcon } from "@/components/ui/waypoints";

export interface Service {
	deliverableCount: number;
	faqCount: number;
	featureCount: number;
	icon: AnimatedIcon;
	painPointCount: number;
	proof: {
		caseStudySlug: string;
		image: string;
	};
	slug: string;
	toolCount: number;
	translationKey: string;
}

export const services: Service[] = [
	{
		slug: "landing-pages",
		translationKey: "landingPages",
		icon: LayoutPanelTopIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "old-world-labs",
			image: "/images/case-studies/old-world-labs/hero.png",
		},
	},
	{
		slug: "wordpress-migration",
		translationKey: "wordpressMigration",
		icon: RouteIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 5,
		proof: {
			caseStudySlug: "mp-bau-construction",
			image: "/images/case-studies/mp-bau-construction/hero.png",
		},
	},
	{
		slug: "ai-consulting",
		translationKey: "aiConsulting",
		icon: WaypointsIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "morrow",
			image: "/images/case-studies/morrow/agent-safe-answer.png",
		},
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		icon: FlaskIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "relay",
			image: "/images/case-studies/relay/workflow-library.png",
		},
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		icon: BrainIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "rautenberg-pitch-engine",
			image: "/images/case-studies/rautenberg-pitch-engine/docx-output.png",
		},
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		icon: LayersIcon,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
		proof: {
			caseStudySlug: "keel",
			image: "/images/case-studies/keel/one-endpoint.png",
		},
	},
];

export const serviceCaseStudies: Record<string, string[]> = {
	"landing-pages": ["mp-bau-construction", "old-world-labs"],
	"wordpress-migration": ["old-world-labs"],
	"ai-consulting": ["mp-bau-construction"],
	"mvp-development": ["ohyp-fintech"],
	"ai-automation": ["mp-bau-construction"],
	"full-stack-applications": ["ohyp-fintech", "old-world-labs"],
};

export const relatedServices: Record<string, string[]> = {
	"landing-pages": ["wordpress-migration", "mvp-development"],
	"wordpress-migration": ["landing-pages", "full-stack-applications"],
	"ai-consulting": ["ai-automation", "mvp-development"],
	"mvp-development": ["full-stack-applications", "ai-consulting"],
	"ai-automation": ["ai-consulting", "full-stack-applications"],
	"full-stack-applications": ["mvp-development", "ai-automation"],
};

export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
