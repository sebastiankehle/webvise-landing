import { getOfferingTranslationKey, type Offering } from "@/data/offerings";

/** A next-intl translator, reduced to what the offering copy needs. */
export type Translate = (key: string) => string;

// Every system page names three situations it is built for.
const SYSTEM_PAIN_POINTS = 3;

export function offeringMeta(
	offering: Offering,
	ts: Translate,
	tc: Translate
): { description: string; title: string } {
	const key = getOfferingTranslationKey(offering);
	return offering.kind === "service"
		? {
				title: ts(`${key}.title`),
				description: ts(`${key}.description`),
			}
		: {
				title: tc(`items.${key}.detail.metaTitle`),
				description: tc(`items.${key}.detail.metaDescription`),
			};
}

export function offeringTitle(
	offering: Offering,
	ts: Translate,
	tc: Translate
): string {
	const key = getOfferingTranslationKey(offering);
	return offering.kind === "service"
		? ts(`${key}.title`)
		: tc(`items.${key}.title`);
}

export function offeringTagline(
	offering: Offering,
	ts: Translate,
	tc: Translate
): string {
	const key = getOfferingTranslationKey(offering);
	return offering.kind === "service"
		? ts(`${key}.tagline`)
		: tc(`items.${key}.description`);
}

export function offeringDetail(
	offering: Offering,
	t: Translate,
	tc: Translate,
	td: Translate
) {
	const key = getOfferingTranslationKey(offering);
	return offering.kind === "service"
		? {
				approach: t(`${key}.approach`),
				deliverableItems: Array.from(
					{ length: offering.service.deliverableCount },
					(_, i) => t(`${key}.deliverables.${i}`)
				),
				description: t(`${key}.description`),
				faqItems: Array.from({ length: offering.service.faqCount }, (_, i) => ({
					answer: t(`${key}.faq.${i}.answer`),
					question: t(`${key}.faq.${i}.question`),
				})),
				featureItems: Array.from(
					{ length: offering.service.featureCount },
					(_, i) => t(`${key}.features.${i}`)
				),
				outcome: t(`${key}.outcome`),
				outcomeItems: [] as string[],
				painPoints: Array.from(
					{ length: offering.service.painPointCount },
					(_, i) => ({
						description: t(`${key}.painPoints.${i}.description`),
						heading: t(`${key}.painPoints.${i}.heading`),
					})
				),
				schemaDescription: t(`${key}.description`),
				schemaTitle: t(`${key}.title`),
				summaryItems: [
					{
						label: td("pricingLabel"),
						value: t(`${key}.price`),
					},
					{
						label: td("timelineLabel"),
						value: t(`${key}.timeline`),
					},
				],
				title: t(`${key}.title`),
			}
		: {
				approach: tc(`items.${key}.detail.approach`),
				deliverableItems: Array.from(
					{ length: offering.system.moduleCount },
					(_, i) => tc(`items.${key}.detail.modules.${i}`)
				),
				description: tc(`items.${key}.description`),
				faqItems: Array.from({ length: offering.system.faqCount }, (_, i) => ({
					answer: tc(`items.${key}.detail.faq.${i}.answer`),
					question: tc(`items.${key}.detail.faq.${i}.question`),
				})),
				featureItems: Array.from(
					{ length: offering.system.capabilityCount },
					(_, i) => tc(`items.${key}.detail.capabilities.${i}`)
				),
				outcome: tc(`items.${key}.detail.outcome`),
				outcomeItems: Array.from(
					{ length: offering.system.outcomeCount },
					(_, i) => tc(`items.${key}.detail.outcomes.${i}`)
				),
				painPoints: Array.from({ length: SYSTEM_PAIN_POINTS }, (_, i) => ({
					description: tc(`items.${key}.detail.painPoints.${i}.description`),
					heading: tc(`items.${key}.detail.painPoints.${i}.heading`),
				})),
				schemaDescription: tc(`items.${key}.description`),
				schemaTitle: tc(`items.${key}.title`),
				summaryItems: [
					{
						label: td("pricingLabel"),
						value: td("estimatedAfterDiscovery"),
					},
					{
						label: td("timelineLabel"),
						value: td("plannedAfterDiscovery"),
					},
				],
				title: tc(`items.${key}.title`),
			};
}
