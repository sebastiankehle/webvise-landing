import { getServiceBySlug, type Service } from "@/data/services";
import { type CustomSystem, getCustomSystemBySlug } from "@/data/systems";

export type OfferingGroupKey = "launch" | "operate" | "automate";

export type Offering =
	| {
			group: OfferingGroupKey;
			kind: "service";
			service: Service;
			slug: string;
	  }
	| {
			group: OfferingGroupKey;
			kind: "system";
			slug: string;
			system: CustomSystem;
	  };

export interface OfferingGroup {
	items: Offering[];
	key: OfferingGroupKey;
}

function serviceOffering(slug: string, group: OfferingGroupKey): Offering {
	const service = getServiceBySlug(slug);
	if (!service) {
		throw new Error(`Missing service offering: ${slug}`);
	}

	return {
		group,
		kind: "service",
		service,
		slug,
	};
}

function systemOffering(slug: string, group: OfferingGroupKey): Offering {
	const system = getCustomSystemBySlug(slug);
	if (!system) {
		throw new Error(`Missing system offering: ${slug}`);
	}

	return {
		group,
		kind: "system",
		slug,
		system,
	};
}

export const offeringGroups: OfferingGroup[] = [
	{
		key: "launch",
		items: [
			serviceOffering("landing-pages", "launch"),
			serviceOffering("mvp-development", "launch"),
			systemOffering("website-to-app-upgrades", "launch"),
			serviceOffering("wordpress-migration", "launch"),
		],
	},
	{
		key: "operate",
		items: [
			systemOffering("internal-tools-dashboards", "operate"),
			systemOffering("client-portals-business-apps", "operate"),
			systemOffering("booking-event-platforms", "operate"),
			serviceOffering("full-stack-applications", "operate"),
		],
	},
	{
		key: "automate",
		items: [
			serviceOffering("ai-consulting", "automate"),
			systemOffering("company-brain-memory-systems", "automate"),
			serviceOffering("ai-automation", "automate"),
			systemOffering("agentic-workflow-automation", "automate"),
		],
	},
];

export const offerings = offeringGroups.flatMap((group) => group.items);

export function getOfferingBySlug(slug: string): Offering | undefined {
	return offerings.find((offering) => offering.slug === slug);
}

export function getRelatedOfferings(slug: string, count = 2): Offering[] {
	const offering = getOfferingBySlug(slug);
	if (!offering) {
		return [];
	}

	const sameGroup =
		offeringGroups
			.find((group) => group.key === offering.group)
			?.items.filter((item) => item.slug !== slug) ?? [];
	const fallback = offerings.filter(
		(item) =>
			item.slug !== slug &&
			!sameGroup.some((groupItem) => groupItem.slug === item.slug)
	);

	return [...sameGroup, ...fallback].slice(0, count);
}

export function getOfferingIcon(offering: Offering) {
	return offering.kind === "service"
		? offering.service.icon
		: offering.system.icon;
}

export function getOfferingProof(offering: Offering) {
	return offering.kind === "service"
		? offering.service.proof
		: offering.system.proof;
}

export function getOfferingTranslationKey(offering: Offering) {
	return offering.kind === "service"
		? offering.service.translationKey
		: offering.system.translationKey;
}
