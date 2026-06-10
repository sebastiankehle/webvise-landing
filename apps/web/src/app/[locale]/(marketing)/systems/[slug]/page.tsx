import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import {
	RelatedLinkCardContent,
	relatedLinkCardClassName,
} from "@/components/marketing/related-link-card";
import SectionWrapper, {
	ConstructedGrid,
	DetailPageSection,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { FaqAccordion } from "@/components/marketing/sections/faq";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import {
	Body,
	Caption,
	H1,
	H2,
	Lead,
	Muted,
	Small,
} from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import {
	customSystems,
	getCustomSystemBySlug,
	getCustomSystemNumber,
} from "@/data/systems";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export function generateStaticParams() {
	return customSystems.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const system = getCustomSystemBySlug(slug);
	if (!system) {
		return {};
	}

	const [t, locale] = await Promise.all([
		getTranslations("customSystems"),
		getLocale(),
	]);

	const key = system.translationKey;
	const title = t(`items.${key}.detail.metaTitle`);
	const description = t(`items.${key}.detail.metaDescription`);
	const path = `/systems/${slug}`;

	return {
		title,
		description,
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl(path, locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

export default async function SystemPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const system = getCustomSystemBySlug(slug);

	if (!system) {
		notFound();
	}

	const [t, td, tschema, locale] = await Promise.all([
		getTranslations("customSystems"),
		getTranslations("systemDetail"),
		getTranslations("schema"),
		getLocale(),
	]);
	const key = system.translationKey;
	const systemNumber = getCustomSystemNumber(slug);
	const proofCaseStudy = getCaseStudyBySlug(system.proof.caseStudySlug, locale);

	const relatedSystems = system.relatedSlugs
		.map((relatedSlug) => getCustomSystemBySlug(relatedSlug))
		.filter(
			(
				relatedSystem
			): relatedSystem is NonNullable<
				ReturnType<typeof getCustomSystemBySlug>
			> => Boolean(relatedSystem)
		);

	const faqEntries =
		system.faqCount > 0
			? [
					{
						"@type": "FAQPage" as const,
						"@id": `https://webvise.io/systems/${slug}#faq`,
						mainEntity: Array.from({ length: system.faqCount }, (_, i) => ({
							"@type": "Question" as const,
							name: t(`items.${key}.detail.faq.${i}.question`),
							acceptedAnswer: {
								"@type": "Answer" as const,
								text: t(`items.${key}.detail.faq.${i}.answer`),
							},
						})),
					},
				]
			: [];

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Service",
				"@id": `https://webvise.io/systems/${slug}#service`,
				name: t(`items.${key}.title`),
				description: t(`items.${key}.description`),
				provider: {
					"@id": "https://webvise.io/#organization",
				},
				areaServed: {
					"@type": "GeoShape",
					name: tschema("worldwide"),
				},
				serviceType: t(`items.${key}.title`),
			},
			{
				"@type": "BreadcrumbList",
				"@id": `https://webvise.io/systems/${slug}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: tschema("home"),
						item: "https://webvise.io",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("title"),
						item: "https://webvise.io/#systems",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: t(`items.${key}.title`),
						item: `https://webvise.io/systems/${slug}`,
					},
				],
			},
			...faqEntries,
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
						<div>
							<Caption className="block text-brand-readable tabular-nums">
								{td("systemTag", { number: systemNumber })}
							</Caption>
							<H1 className="mt-6 max-w-3xl">
								{t(`items.${key}.detail.heroTitle`)}
							</H1>
							<Lead className="mt-5 max-w-xl">
								{t(`items.${key}.detail.heroSubtitle`)}
							</Lead>
							<div className="mt-8 flex max-w-xl flex-wrap gap-2">
								{Array.from({ length: system.exampleCount }, (_, i) => {
									const example = t(`items.${key}.examples.${i}`);

									return (
										<MarketingTag key={example} variant="subtle">
											{example}
										</MarketingTag>
									);
								})}
							</div>
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-grid-line border-t pt-6">
								<div>
									<Caption className="block">{td("scopeLabel")}</Caption>
									<Small className="mt-1 block text-foreground">
										{t(`items.${key}.detail.scope`)}
									</Small>
								</div>
								<div>
									<Caption className="block">{td("timelineLabel")}</Caption>
									<Small className="mt-1 block text-foreground">
										{t(`items.${key}.detail.timeline`)}
									</Small>
								</div>
							</div>
						</div>

						{proofCaseStudy && (
							<Link
								className="surface-card group relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={{
									pathname: "/case-studies/[slug]",
									params: { slug: proofCaseStudy.slug },
								}}
							>
								<div className="relative aspect-[16/10]">
									<Image
										alt={`${proofCaseStudy.client}: ${proofCaseStudy.title}`}
										className="object-cover object-left-top"
										fill
										sizes="(min-width: 1024px) 46vw, 100vw"
										src={system.proof.image}
									/>
								</div>
								<div className="flex items-center justify-between gap-4 border-border/60 border-t px-5 py-3.5">
									<Caption className="text-brand-readable">
										{td("proofLabel")} &middot; {proofCaseStudy.client}
									</Caption>
									<span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs transition-colors group-hover:text-brand-readable">
										{td("proofCta")}
										<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
									</span>
								</div>
							</Link>
						)}
					</div>
				</GridContainer>
			</section>

			<SectionWrapper className="pt-8 md:pt-12" id="overview">
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<H2>{td("approachTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">
							{t(`items.${key}.detail.approach`)}
						</Lead>
					</div>
					<div>
						<H2>{td("outcomeTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">
							{t(`items.${key}.detail.outcome`)}
						</Lead>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="capabilities" surface="inverted">
				<div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
					<div>
						<H2>{td("capabilitiesTitle")}</H2>
						<ol className="mt-8 border-grid-line border-t">
							{Array.from({ length: system.capabilityCount }, (_, i) => (
								<li
									className="flex items-baseline gap-5 border-grid-line border-b py-4"
									key={t(`items.${key}.detail.capabilities.${i}`)}
								>
									<Caption className="shrink-0 text-brand-readable tabular-nums">
										{String(i + 1).padStart(2, "0")}
									</Caption>
									<Body className="text-sm leading-relaxed">
										{t(`items.${key}.detail.capabilities.${i}`)}
									</Body>
								</li>
							))}
						</ol>
					</div>

					<div>
						<H2>{td("modulesTitle")}</H2>
						<div className="surface-card mt-8 divide-y divide-border/40">
							{Array.from({ length: system.moduleCount }, (_, i) => (
								<div
									className="flex items-baseline gap-4 px-5 py-3.5"
									key={t(`items.${key}.detail.modules.${i}`)}
								>
									<span
										aria-hidden="true"
										className="h-1.5 w-1.5 shrink-0 self-center bg-brand"
									/>
									<Muted className="text-foreground/90 text-sm leading-relaxed">
										{t(`items.${key}.detail.modules.${i}`)}
									</Muted>
								</div>
							))}
						</div>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="outcomes" surface="alternate">
				<div className="grid gap-12 md:grid-cols-[0.9fr_1.6fr] md:gap-20">
					<div>
						<H2>{td("outcomesTitle")}</H2>
						<Muted className="mt-4 max-w-sm leading-relaxed">
							{td("outcomesIntro")}
						</Muted>
					</div>
					<div className="grid gap-5 md:grid-cols-2">
						{Array.from({ length: system.outcomeCount }, (_, i) => (
							<div
								className="surface-card p-6 md:p-7"
								key={t(`items.${key}.detail.outcomes.${i}`)}
							>
								<Caption className="text-brand-readable tabular-nums">
									{String(i + 1).padStart(2, "0")}
								</Caption>
								<Muted className="mt-3 max-w-md text-foreground/90 text-sm leading-relaxed">
									{t(`items.${key}.detail.outcomes.${i}`)}
								</Muted>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			{system.faqCount > 0 && (
				<SectionWrapper id="faq">
					<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
						<div>
							<H2>{td("faqTitle")}</H2>
						</div>
						<FaqAccordion
							items={Array.from({ length: system.faqCount }, (_, i) => ({
								question: t(`items.${key}.detail.faq.${i}.question`),
								answer: t(`items.${key}.detail.faq.${i}.answer`),
							}))}
						/>
					</div>
				</SectionWrapper>
			)}

			<DetailPageSection
				className="section-inverted pt-20 pb-28"
				id="system-next-step"
			>
				<div>
					<Caption className="text-brand-readable">{td("ctaEyebrow")}</Caption>
					<H2 className="mt-3">{td("ctaTitle")}</H2>
					<Muted className="mt-4 max-w-md leading-relaxed">
						{td("ctaDescription")}
					</Muted>
					<TrackClick
						event="cta_clicked"
						properties={{
							location: "system_detail",
							variant: "primary",
							destination: "contact",
						}}
					>
						<Button
							className="mt-8"
							render={
								<NextLink
									aria-label={td("ctaButton")}
									href={homepageSectionHref("contact", locale)}
								/>
							}
							variant="brand"
						>
							{td("ctaButton")}
						</Button>
					</TrackClick>
				</div>
			</DetailPageSection>

			{relatedSystems.length > 0 && (
				<DetailPageSection className="pt-20 pb-28" id="related-systems">
					<H2>{td("relatedSystemsTitle")}</H2>
					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{relatedSystems.map((relatedSystem) => (
							<Link
								className={relatedLinkCardClassName}
								href={{
									pathname: "/systems/[slug]",
									params: { slug: relatedSystem.slug },
								}}
								key={relatedSystem.slug}
							>
								<RelatedLinkCardContent
									description={t(
										`items.${relatedSystem.translationKey}.description`
									)}
									icon={relatedSystem.icon}
									title={t(`items.${relatedSystem.translationKey}.title`)}
								/>
							</Link>
						))}
					</div>
				</DetailPageSection>
			)}
		</>
	);
}
