import type { LucideIcon } from "lucide-react";
import {
	BrainCircuit,
	Database,
	FlaskConical,
	LayoutTemplate,
	Paintbrush,
	Rocket,
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
	},
	{
		slug: "seo-performance",
		translationKey: "seoPerformance",
		icon: TrendingUp,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "website-redesign",
		translationKey: "websiteRedesign",
		icon: Paintbrush,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		icon: FlaskConical,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		icon: BrainCircuit,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		icon: Database,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
	{
		slug: "wordpress-nextjs-migration",
		translationKey: "wpMigration",
		icon: Rocket,
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
	},
];

export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
