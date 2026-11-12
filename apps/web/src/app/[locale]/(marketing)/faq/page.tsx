import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import FaqHub, { type FaqTopic } from "@/components/marketing/faq-hub";
import Closing from "@/components/marketing/home/closing";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1 } from "@/components/ui/typography";
import { getOfferingTranslationKey, offeringGroups } from "@/data/offerings";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const generalKeys = ["0", "1", "2", "3", "4", "5", "9", "6", "7", "8"] as const;

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([getTranslations("faq"), getLocale()]);
	const title = t("hub.title");
	const description = t("hub.lead");
	return {
		title,
		description,
		alternates: generateAlternates("/faq", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/faq", locale),
		},
	};
}

/** Every question the site answers, collected from the homepage and the
 * service pages, with a search field and a chip per kind of work. */
export default async function FaqPage({ params }: { params: LocaleParams }) {
	await pinLocale(params);
	const [tf, ts, tc, locale] = await Promise.all([
		getTranslations("faq"),
		getTranslations("services"),
		getTranslations("customSystems"),
		getLocale(),
	]);

	const topics: FaqTopic[] = [
		{
			group: "general",
			id: "general",
			title: tf("hub.general"),
			items: generalKeys.map((key) => ({
				answer: tf(`items.${key}.answer`),
				question: tf(`items.${key}.question`),
			})),
		},
		...offeringGroups.flatMap((group) =>
			group.items.map((offering) => {
				const key = getOfferingTranslationKey(offering);
				const service = offering.kind === "service";
				const count = service
					? offering.service.faqCount
					: offering.system.faqCount;
				return {
					group: group.key,
					id: offering.slug,
					slug: offering.slug,
					title: service ? ts(`${key}.title`) : tc(`items.${key}.title`),
					items: Array.from({ length: count }, (_, i) =>
						service
							? {
									answer: ts(`${key}.faq.${i}.answer`),
									question: ts(`${key}.faq.${i}.question`),
								}
							: {
									answer: tc(`items.${key}.detail.faq.${i}.answer`),
									question: tc(`items.${key}.detail.faq.${i}.question`),
								}
					),
				};
			})
		),
	].filter((topic) => topic.items.length > 0);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": `${localizedUrl("/faq", locale)}#faq`,
		mainEntity: topics.flatMap((topic) =>
			topic.items.map((item) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: { "@type": "Answer", text: item.answer },
			}))
		),
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="stagger-visible">
						<H1>{tf("hub.title")}</H1>
						<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
							{tf("hub.lead")}
						</p>
						<div className="mt-12 md:mt-16">
							<FaqHub
								groups={[
									{ key: "general", title: tf("hub.general") },
									...offeringGroups.map((group) => ({
										key: group.key,
										title: ts(`groups.${group.key}.title`),
									})),
								]}
								labels={{
									all: tf("hub.all"),
									ask: tf("hub.ask"),
									empty: tf("hub.empty"),
									emptyCta: tf("hub.emptyCta"),
									search: tf("hub.search"),
								}}
								topics={topics}
							/>
						</div>
					</div>
				</GridContainer>
			</section>
			<Closing />
		</>
	);
}
