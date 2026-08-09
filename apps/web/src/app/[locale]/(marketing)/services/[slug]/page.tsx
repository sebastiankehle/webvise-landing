import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import {
	RelatedLinkCardContent,
	relatedLinkCardClassName,
} from "@/components/marketing/related-link-card";
import SectionWrapper, {
	ConstructedGrid,
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
	H3,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import {
	getOfferingBySlug,
	getOfferingIcon,
	getOfferingProof,
	getOfferingTranslationKey,
	getRelatedOfferings,
	type Offering,
	offerings,
} from "@/data/offerings";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { generateAlternates, localizedUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

const terminalHeadingPunctuationPattern = /[.!?]+$/;

function HeroSummary({
	items,
}: {
	items: Array<{ label: string; value: string }>;
}) {
	return (
		<dl className="mt-10 grid max-w-xl grid-cols-2 gap-5">
			{items.map((item) => (
				<div key={item.label}>
					<dt className="text-muted-foreground text-xs">{item.label}</dt>
					<dd className="mt-1.5 text-foreground text-sm leading-6">
						{item.value}
					</dd>
				</div>
			))}
		</dl>
	);
}

function trimHeading(value: string) {
	return value.replace(terminalHeadingPunctuationPattern, "");
}

export function generateStaticParams() {
	return offerings.map((offering) => ({ slug: offering.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const offering = getOfferingBySlug(slug);
	if (!offering) {
		return {};
	}

	const [ts, tc, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getLocale(),
	]);

	const key = getOfferingTranslationKey(offering);
	const title =
		offering.kind === "service"
			? ts(`${key}.title`)
			: tc(`items.${key}.detail.metaTitle`);
	const description =
		offering.kind === "service"
			? ts(`${key}.description`)
			: tc(`items.${key}.detail.metaDescription`);
	const path = `/services/${slug}`;

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

export default async function ServicePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const offering = getOfferingBySlug(slug);

	if (!offering) {
		notFound();
	}

	return <ServiceOfferingPage offering={offering} />;
}

async function ServiceOfferingPage({ offering }: { offering: Offering }) {
	const slug = offering.slug;
	const [t, tc, td, tschema, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getTranslations("serviceDetail"),
		getTranslations("schema"),
		getLocale(),
	]);
	const key = getOfferingTranslationKey(offering);
	const OfferingIcon = getOfferingIcon(offering);
	const proof = getOfferingProof(offering);
	const proofCaseStudy = getCaseStudyBySlug(proof.caseStudySlug, locale);
	const relatedOfferings = getRelatedOfferings(slug);
	const detail =
		offering.kind === "service"
			? {
					approach: t(`${key}.approach`),
					deliverableItems: Array.from(
						{ length: offering.service.deliverableCount },
						(_, i) => t(`${key}.deliverables.${i}`)
					),
					description: t(`${key}.description`),
					faqItems: Array.from(
						{ length: offering.service.faqCount },
						(_, i) => ({
							answer: t(`${key}.faq.${i}.answer`),
							question: t(`${key}.faq.${i}.question`),
						})
					),
					featureItems: Array.from(
						{ length: offering.service.featureCount },
						(_, i) => t(`${key}.features.${i}`)
					),
					outcome: t(`${key}.outcome`),
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
					faqItems: Array.from(
						{ length: offering.system.faqCount },
						(_, i) => ({
							answer: tc(`items.${key}.detail.faq.${i}.answer`),
							question: tc(`items.${key}.detail.faq.${i}.question`),
						})
					),
					featureItems: Array.from(
						{ length: offering.system.capabilityCount },
						(_, i) => tc(`items.${key}.detail.capabilities.${i}`)
					),
					outcome: tc(`items.${key}.detail.outcome`),
					painPoints: Array.from(
						{
							length: Math.min(
								3,
								offering.system.capabilityCount,
								offering.system.outcomeCount
							),
						},
						(_, i) => ({
							description: tc(`items.${key}.detail.outcomes.${i}`),
							heading: trimHeading(tc(`items.${key}.detail.capabilities.${i}`)),
						})
					),
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

	const faqEntries =
		detail.faqItems.length > 0
			? [
					{
						"@type": "FAQPage" as const,
						"@id": `https://webvise.io/services/${slug}#faq`,
						mainEntity: detail.faqItems.map((item) => ({
							"@type": "Question" as const,
							name: item.question,
							acceptedAnswer: {
								"@type": "Answer" as const,
								text: item.answer,
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
				"@id": `https://webvise.io/services/${slug}#service`,
				name: detail.schemaTitle,
				description: detail.schemaDescription,
				provider: {
					"@id": "https://www.webvise.io/#organization",
				},
				areaServed: {
					"@type": "GeoShape",
					name: tschema("worldwide"),
				},
				serviceType: detail.schemaTitle,
			},
			{
				"@type": "BreadcrumbList",
				"@id": `https://webvise.io/services/${slug}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: tschema("home"),
						item: "https://www.webvise.io",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: tschema("services"),
						item: "https://www.webvise.io/#services",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: detail.schemaTitle,
						item: `https://webvise.io/services/${slug}`,
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
							<div className="flex items-center">
								<OfferingIcon className="text-brand-icon" size={24} />
								<Caption className="sr-only">
									{t(`groups.${offering.group}.title`)}
								</Caption>
							</div>
							<H1 className="mt-6 max-w-3xl">{detail.title}</H1>
							<Lead className="mt-5 max-w-lg">{detail.description}</Lead>
							<HeroSummary items={detail.summaryItems} />
						</div>

						{proofCaseStudy && (
							<Link
								className="surface-card media-frame group relative block outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={{
									pathname: "/case-studies/[slug]",
									params: { slug: proofCaseStudy.slug },
								}}
							>
								<div className="relative aspect-[16/10]">
									<Image
										alt={`${proofCaseStudy.client}: ${proofCaseStudy.title}`}
										className={cn(
											"object-cover object-left-top",
											proof.imageClassName
										)}
										fill
										priority
										quality={95}
										sizes="(min-width: 1024px) 46vw, 100vw"
										src={proof.image}
									/>
								</div>
								<div className="flex items-center justify-between gap-4 border-border/60 border-t px-5 py-3.5">
									<Caption className="text-brand-readable">
										{td(
											proofCaseStudy.kind === "concept"
												? "conceptStudyLabel"
												: "recentProjectLabel",
											{ client: proofCaseStudy.client }
										)}
									</Caption>
									<span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
										{td("proofCta")}
										<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
									</span>
								</div>
							</Link>
						)}
					</div>
				</GridContainer>
			</section>

			<SectionWrapper className="pt-8 md:pt-12" id="approach">
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<H3>{td("approachTitle")}</H3>
						<Lead className="mt-4 leading-relaxed">{detail.approach}</Lead>
					</div>
					<div>
						<H3>{td("outcomeTitle")}</H3>
						<Lead className="mt-4 leading-relaxed">{detail.outcome}</Lead>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper className="pt-8 md:pt-12" id="why">
				<div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
					{detail.painPoints.map((item, i) => (
						<div className="group" key={item.heading}>
							<Caption className="mb-3 block text-brand-readable tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</Caption>
							<H3>{item.heading}</H3>
							<Muted className="mt-3 leading-relaxed">{item.description}</Muted>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" surface="inverted">
				<div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
					<div>
						<H3>{td("featuresTitle")}</H3>
						<ol className="mt-8 border-grid-line border-t">
							{detail.featureItems.map((item, i) => (
								<li
									className="flex items-baseline gap-5 border-grid-line border-b py-4"
									key={item}
								>
									<Caption className="shrink-0 text-brand-readable tabular-nums">
										{String(i + 1).padStart(2, "0")}
									</Caption>
									<Body className="text-sm leading-relaxed">{item}</Body>
								</li>
							))}
						</ol>
					</div>

					<div id="deliverables">
						<H3>{td("deliverablesTitle")}</H3>
						<div className="surface-card mt-8 divide-y divide-border/40">
							{detail.deliverableItems.map((item) => (
								<div
									className="flex items-baseline gap-4 px-5 py-3.5"
									key={item}
								>
									<span
										aria-hidden="true"
										className="h-1.5 w-1.5 shrink-0 self-center bg-brand"
									/>
									<Muted className="text-foreground/90 text-sm leading-relaxed">
										{item}
									</Muted>
								</div>
							))}
						</div>
					</div>
				</div>
			</SectionWrapper>

			{detail.faqItems.length > 0 && (
				<SectionWrapper id="faq" surface="alternate">
					<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
						<div>
							<H2>{td("faqTitle")}</H2>
						</div>
						<FaqAccordion items={detail.faqItems} />
					</div>
				</SectionWrapper>
			)}

			<OfferingNextStep
				ctaButton={td("ctaButton")}
				ctaDescription={td("ctaDescription")}
				ctaEyebrow={td("ctaEyebrow")}
				ctaTitle={td("ctaTitle")}
				getRelatedDescription={(relatedOffering) => {
					const relatedKey = getOfferingTranslationKey(relatedOffering);

					return relatedOffering.kind === "service"
						? t(`${relatedKey}.tagline`)
						: tc(`items.${relatedKey}.description`);
				}}
				getRelatedTitle={(relatedOffering) => {
					const relatedKey = getOfferingTranslationKey(relatedOffering);

					return relatedOffering.kind === "service"
						? t(`${relatedKey}.title`)
						: tc(`items.${relatedKey}.title`);
				}}
				locale={locale}
				relatedOfferings={relatedOfferings}
				relatedTitle={td("relatedOfferingsTitle")}
			/>
		</>
	);
}

function OfferingNextStep({
	ctaButton,
	ctaDescription,
	ctaEyebrow,
	ctaTitle,
	getRelatedDescription,
	getRelatedTitle,
	locale,
	relatedOfferings,
	relatedTitle,
}: {
	ctaButton: string;
	ctaDescription: string;
	ctaEyebrow: string;
	ctaTitle: string;
	getRelatedDescription: (offering: Offering) => string;
	getRelatedTitle: (offering: Offering) => string;
	locale: string;
	relatedOfferings: Offering[];
	relatedTitle: string;
}) {
	return (
		<SectionWrapper id="offering-next-step" surface="inverted">
			<div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:gap-16">
				<div className="max-w-xl">
					<Caption className="text-brand-readable">{ctaEyebrow}</Caption>
					<H2 className="mt-3">{ctaTitle}</H2>
					<Muted className="mt-4 leading-relaxed">{ctaDescription}</Muted>
					<TrackClick
						event="cta_clicked"
						properties={{
							location: "service_detail",
							variant: "primary",
							destination: "contact",
						}}
					>
						<Button
							className="mt-8"
							render={
								<NextLink
									aria-label={ctaButton}
									href={homepageSectionHref("contact", locale)}
								/>
							}
							variant="brand"
						>
							{ctaButton}
						</Button>
					</TrackClick>
				</div>

				{relatedOfferings.length > 0 && (
					<div>
						<Caption className="text-brand-readable">{relatedTitle}</Caption>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{relatedOfferings.map((relatedOffering) => {
								const Icon = getOfferingIcon(relatedOffering);

								return (
									<Link
										className={relatedLinkCardClassName}
										href={{
											pathname: "/services/[slug]",
											params: { slug: relatedOffering.slug },
										}}
										key={relatedOffering.slug}
									>
										<RelatedLinkCardContent
											description={getRelatedDescription(relatedOffering)}
											icon={Icon}
											title={getRelatedTitle(relatedOffering)}
										/>
									</Link>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</SectionWrapper>
	);
}
