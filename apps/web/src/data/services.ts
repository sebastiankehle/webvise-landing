import type { LucideIcon } from "lucide-react";
import {
	ArrowLeftRight,
	BrainCircuit,
	Database,
	FlaskConical,
	LayoutTemplate,
	Sparkles,
} from "lucide-react";

export interface Service {
	slug: string;
	translationKey: string;
	icon: LucideIcon;
	featureCount: number;
	deliverableCount: number;
	toolCount: number;
	painPointCount: number;
	faqCount: number;
}

export const services: Service[] = [
	{
		slug: "landing-pages",
		translationKey: "landingPages",
		icon: LayoutTemplate,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 3,
	},
	{
		slug: "wordpress-migration",
		translationKey: "wordpressMigration",
		icon: ArrowLeftRight,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 4,
	},
	{
		slug: "ai-consulting",
		translationKey: "aiConsulting",
		icon: Sparkles,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 3,
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		icon: FlaskConical,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 3,
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		icon: BrainCircuit,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 3,
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		icon: Database,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 3,
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
