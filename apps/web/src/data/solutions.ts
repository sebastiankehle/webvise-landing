import type { LucideIcon } from "lucide-react";
import {
	Bot,
	CalendarCheck,
	ChartNoAxesCombined,
	FileText,
	LayoutDashboard,
	MousePointerClick,
	PanelTop,
	Workflow,
} from "lucide-react";

export interface Solution {
	featureCount: number;
	icon: LucideIcon;
	problemCount: number;
	processCount: number;
	relatedServices: string[];
	slug: string;
	translationKey: string;
}

export const solutions: Solution[] = [
	{
		slug: "internal-tools",
		translationKey: "internalTools",
		icon: LayoutDashboard,
		problemCount: 5,
		featureCount: 8,
		processCount: 6,
		relatedServices: [
			"full-stack-applications",
			"mvp-development",
			"ai-automation",
		],
	},
	{
		slug: "workflow-automation",
		translationKey: "workflowAutomation",
		icon: Workflow,
		problemCount: 5,
		featureCount: 7,
		processCount: 5,
		relatedServices: [
			"ai-automation",
			"ai-consulting",
			"full-stack-applications",
		],
	},
	{
		slug: "client-portals",
		translationKey: "clientPortals",
		icon: PanelTop,
		problemCount: 5,
		featureCount: 8,
		processCount: 5,
		relatedServices: [
			"full-stack-applications",
			"mvp-development",
			"ai-automation",
		],
	},
	{
		slug: "ai-knowledge-assistants",
		translationKey: "aiKnowledgeAssistants",
		icon: Bot,
		problemCount: 6,
		featureCount: 6,
		processCount: 5,
		relatedServices: [
			"ai-consulting",
			"ai-automation",
			"full-stack-applications",
		],
	},
	{
		slug: "booking-event-platforms",
		translationKey: "bookingEventPlatforms",
		icon: CalendarCheck,
		problemCount: 5,
		featureCount: 8,
		processCount: 5,
		relatedServices: [
			"full-stack-applications",
			"mvp-development",
			"ai-automation",
		],
	},
	{
		slug: "website-to-app-upgrades",
		translationKey: "websiteToAppUpgrades",
		icon: MousePointerClick,
		problemCount: 6,
		featureCount: 8,
		processCount: 5,
		relatedServices: [
			"wordpress-migration",
			"landing-pages",
			"full-stack-applications",
			"ai-automation",
		],
	},
];

export const solutionHighlights = [
	{ key: "dashboards", icon: ChartNoAxesCombined },
	{ key: "documents", icon: FileText },
	{ key: "automation", icon: Workflow },
] as const;

export const serviceRelatedSolutions: Record<string, string[]> = {
	"ai-automation": [
		"workflow-automation",
		"ai-knowledge-assistants",
		"internal-tools",
	],
	"ai-consulting": ["workflow-automation", "ai-knowledge-assistants"],
	"full-stack-applications": [
		"internal-tools",
		"client-portals",
		"booking-event-platforms",
	],
	"wordpress-migration": ["website-to-app-upgrades"],
	"mvp-development": ["client-portals", "internal-tools"],
	"landing-pages": ["website-to-app-upgrades"],
};

export function getSolutionBySlug(slug: string): Solution | undefined {
	return solutions.find((solution) => solution.slug === slug);
}
