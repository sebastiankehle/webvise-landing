import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CaseStudyListCard } from "@/components/marketing/case-study-card";
import CaseStudyFilter from "@/components/marketing/case-study-filter";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";
import { getCaseStudies } from "@/data/case-studies";
import { industries } from "@/data/industries";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("caseStudies"),
		getLocale(),
	]);
	const title = t("title");
	const description = t("subtitle");

	return {
		title,
		description,
		alternates: generateAlternates("/case-studies", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/case-studies", locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

export default async function CaseStudiesPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [locale, t, ti] = await Promise.all([
		getLocale(),
		getTranslations("caseStudies"),
		getTranslations("industries"),
	]);
	// Every project: client work first, then the ones built in-house. Twelve
	// cards fill four rows of three.
	const projects = [
		...getCaseStudies(locale, { kind: "client" }),
		...getCaseStudies(locale, { kind: "concept" }),
	];

	return (
		<>
			<section className="section-inverted relative bg-background pt-16 pb-12 md:pt-24 md:pb-16">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
						<div className="max-w-[660px]">
							<H1>{t("title")}</H1>
						</div>
						<div className="max-w-[560px] lg:justify-self-end">
							<Lead>{t("subtitle")}</Lead>
						</div>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper
				className="pt-12 md:pt-16"
				hatch
				id="case-studies-list"
				surface="inverted"
			>
				<h2 className="sr-only">{t("projectsTitle")}</h2>
				<CaseStudyFilter
					all={t("filterAll")}
					fields={industries.map((industry) => ({
						key: industry.slug,
						name: ti(`items.${industry.slug}.name`),
						slugs: industry.proof,
					}))}
					items={projects.map((caseStudy, index) => ({
						slug: caseStudy.slug,
						node: (
							<CaseStudyListCard caseStudy={caseStudy} priority={index < 3} />
						),
					}))}
					label={ti("label")}
				/>
			</SectionWrapper>
		</>
	);
}
