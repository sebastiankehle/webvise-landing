import type { LucideIcon } from "lucide-react";
import {
	ArrowLeftRight,
	BarChart3,
	Blocks,
	BrainCircuit,
	Clock,
	Database,
	DollarSign,
	Flame,
	FlaskConical,
	Gauge,
	Layers,
	LayoutTemplate,
	Map,
	PackageX,
	Repeat,
	Rocket,
	ShieldAlert,
	Sparkles,
	TrendingUp,
	UserMinus,
	Users,
	Wrench,
} from "lucide-react";

export interface Service {
	slug: string;
	translationKey: string;
	icon: LucideIcon;
	painPointIcons: [LucideIcon, LucideIcon, LucideIcon];
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
		painPointIcons: [UserMinus, Clock, BarChart3],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 4,
	},
	{
		slug: "wordpress-migration",
		translationKey: "wordpressMigration",
		icon: ArrowLeftRight,
		painPointIcons: [DollarSign, Gauge, ShieldAlert],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 5,
		painPointCount: 3,
		faqCount: 5,
	},
	{
		slug: "ai-consulting",
		translationKey: "aiConsulting",
		icon: Sparkles,
		painPointIcons: [Layers, Map, PackageX],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
	},
	{
		slug: "mvp-development",
		translationKey: "mvpDevelopment",
		icon: FlaskConical,
		painPointIcons: [Blocks, Flame, Rocket],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
	},
	{
		slug: "ai-automation",
		translationKey: "aiAutomation",
		icon: BrainCircuit,
		painPointIcons: [Repeat, Database, Wrench],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
	},
	{
		slug: "full-stack-applications",
		translationKey: "fullStackApps",
		icon: Database,
		painPointIcons: [TrendingUp, Users, Wrench],
		featureCount: 6,
		deliverableCount: 5,
		toolCount: 6,
		painPointCount: 3,
		faqCount: 4,
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
