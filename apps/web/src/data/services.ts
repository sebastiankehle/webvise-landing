import type { LucideIcon } from "lucide-react";
import {
	ArrowLeftRight,
	BrainCircuit,
	Database,
	FlaskConical,
	LayoutTemplate,
	TrendingUp,
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
		slug: "seo-performance",
		translationKey: "seoPerformance",
		icon: TrendingUp,
		featureCount: 8,
		deliverableCount: 6,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
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
	"landing-pages": ["carvio-automotive", "alpine-escapes-hospitality"],
	"seo-performance": ["bloom-and-root-ecommerce", "carvio-automotive"],
	"wordpress-migration": ["bloom-and-root-ecommerce", "old-world-labs"],
	"mvp-development": ["vitalix-healthcare", "lexflow-legaltech"],
	"ai-automation": ["greengrid-energy", "lexflow-legaltech"],
	"full-stack-applications": ["alpine-escapes-hospitality", "ohyp-fintech"],
};

export const relatedServices: Record<string, string[]> = {
	"landing-pages": ["seo-performance", "wordpress-migration"],
	"seo-performance": ["landing-pages", "wordpress-migration"],
	"wordpress-migration": ["seo-performance", "landing-pages"],
	"mvp-development": ["full-stack-applications", "ai-automation"],
	"ai-automation": ["mvp-development", "full-stack-applications"],
	"full-stack-applications": ["mvp-development", "ai-automation"],
};

export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
