import { ArrowRight, Shield } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
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
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import {
	Body,
	Caption,
	H1,
	H2,
	H3,
	Lead,
	Muted,
	Small,
} from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import { getServiceBySlug, relatedServices, services } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export function generateStaticParams() {
	return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = getServiceBySlug(slug);
	if (!service) {
		return {};
	}

	const [t, locale] = await Promise.all([
		getTranslations("services"),
		getLocale(),
	]);

	const title = t(`${service.translationKey}.title`);
	const description = t(`${service.translationKey}.description`);
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
	const service = getServiceBySlug(slug);

	if (!service) {
		notFound();
	}

	const t = await getTranslations("services");
	const td = await getTranslations("serviceDetail");
	const tschema = await getTranslations("schema");
	const tt = await getTranslations("trust.serviceCallout");
	const locale = await getLocale();
	const key = service.translationKey;
	const ServiceIcon = service.icon;
	const proofCaseStudy = getCaseStudyBySlug(
		service.proof.caseStudySlug,
		locale
	);

	const relatedServiceSlugs = relatedServices[slug] ?? [];
	const relatedServiceData = relatedServiceSlugs
		.map((s) => getServiceBySlug(s))
		.filter(
			(
				relatedService
			): relatedService is NonNullable<ReturnType<typeof getServiceBySlug>> =>
				Boolean(relatedService)
		);

	const faqEntries =
		service.faqCount > 0
			? [
					{
						"@type": "FAQPage" as const,
						"@id": `https://webvise.io/services/${slug}#faq`,
						mainEntity: Array.from({ length: service.faqCount }, (_, i) => ({
							"@type": "Question" as const,
							name: t(`${key}.faq.${i}.question`),
							acceptedAnswer: {
								"@type": "Answer" as const,
								text: t(`${key}.faq.${i}.answer`),
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
				name: t(`${key}.title`),
				description: t(`${key}.description`),
				provider: {
					"@id": "https://webvise.io/#organization",
				},
				areaServed: {
					"@type": "GeoShape",
					name: tschema("worldwide"),
				},
				serviceType: t(`${key}.title`),
			},
			{
				"@type": "BreadcrumbList",
				"@id": `https://webvise.io/services/${slug}#breadcrumb`,
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
						name: tschema("services"),
						item: "https://webvise.io/#services",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: t(`${key}.title`),
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

			{/* Header */}
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
						{/* Title + info */}
						<div>
							<ServiceIcon className="text-brand-icon" size={24} />
							<H1 className="mt-6 max-w-3xl">{t(`${key}.title`)}</H1>
							<Lead className="mt-5 max-w-lg">{t(`${key}.description`)}</Lead>
							<div className="mt-8 flex max-w-xl flex-wrap gap-2">
								{Array.from({ length: service.toolCount }, (_, i) => {
									const tool = t(`${key}.tools.${i}`);

									return (
										<MarketingTag key={tool} variant="subtle">
											{tool}
										</MarketingTag>
									);
								})}
							</div>
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-grid-line border-t pt-6">
								<div>
									<Caption className="block">{td("pricingLabel")}</Caption>
									<Small className="mt-1 block text-foreground">
										{t(`${key}.price`)}
									</Small>
								</div>
								<div>
									<Caption className="block">{td("timelineLabel")}</Caption>
									<Small className="mt-1 block text-foreground">
										{t(`${key}.timeline`)}
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
										src={service.proof.image}
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

			<SectionWrapper className="pt-8 md:pt-12" id="approach">
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<H2>{td("approachTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">{t(`${key}.approach`)}</Lead>
					</div>
					<div>
						<H2>{td("outcomeTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">{t(`${key}.outcome`)}</Lead>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper className="pt-8 md:pt-12" id="why">
				<div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => (
						<div className="group" key={t(`${key}.painPoints.${i}.heading`)}>
							<Caption className="mb-3 block text-brand-readable tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</Caption>
							<H3>{t(`${key}.painPoints.${i}.heading`)}</H3>
							<Muted className="mt-3 leading-relaxed">
								{t(`${key}.painPoints.${i}.description`)}
							</Muted>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" surface="inverted">
				<div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
					<div>
						<H2>{td("featuresTitle")}</H2>
						<ol className="mt-8 border-grid-line border-t">
							{Array.from({ length: service.featureCount }, (_, i) => (
								<li
									className="flex items-baseline gap-5 border-grid-line border-b py-4"
									key={t(`${key}.features.${i}`)}
								>
									<Caption className="shrink-0 text-brand-readable tabular-nums">
										{String(i + 1).padStart(2, "0")}
									</Caption>
									<Body className="text-sm leading-relaxed">
										{t(`${key}.features.${i}`)}
									</Body>
								</li>
							))}
						</ol>
					</div>

					<div id="deliverables">
						<H2>{td("deliverablesTitle")}</H2>
						<div className="surface-card mt-8 divide-y divide-border/40">
							{Array.from({ length: service.deliverableCount }, (_, i) => (
								<div
									className="flex items-baseline gap-4 px-5 py-3.5"
									key={t(`${key}.deliverables.${i}`)}
								>
									<span
										aria-hidden="true"
										className="h-1.5 w-1.5 shrink-0 self-center bg-brand"
									/>
									<Muted className="text-foreground/90 text-sm leading-relaxed">
										{t(`${key}.deliverables.${i}`)}
									</Muted>
								</div>
							))}
						</div>
					</div>
				</div>
			</SectionWrapper>

			{service.faqCount > 0 && (
				<SectionWrapper id="faq" surface="alternate">
					<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
						<div>
							<H2>{td("faqTitle")}</H2>
						</div>
						<FaqAccordion
							items={Array.from({ length: service.faqCount }, (_, i) => ({
								question: t(`${key}.faq.${i}.question`),
								answer: t(`${key}.faq.${i}.answer`),
							}))}
						/>
					</div>
				</SectionWrapper>
			)}

			{slug === "wordpress-migration" && <WpHealthCta />}

			{(slug === "ai-automation" ||
				slug === "ai-consulting" ||
				slug === "full-stack-applications") && (
				<DetailPageSection className="pt-20 pb-20" id="trust-callout">
					<div className="flex items-start gap-5 border border-border/40 p-6 md:p-8">
						<Shield
							className="mt-0.5 h-5 w-5 shrink-0 text-brand-icon"
							strokeWidth={1.5}
						/>
						<div>
							<H3>{tt("title")}</H3>
							<Muted className="mt-1 max-w-lg leading-relaxed">
								{tt("description")}
							</Muted>
						</div>
					</div>
				</DetailPageSection>
			)}

			{relatedServiceData.length > 0 && (
				<DetailPageSection className="pt-20 pb-28" id="related-services">
					<H2>{td("relatedServicesTitle")}</H2>
					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{relatedServiceData.map((rs) => {
							const RsIcon = rs.icon;
							return (
								<Link
									className={relatedLinkCardClassName}
									href={{
										pathname: "/services/[slug]",
										params: { slug: rs.slug },
									}}
									key={rs.slug}
								>
									<RelatedLinkCardContent
										description={t(`${rs.translationKey}.tagline`)}
										icon={RsIcon}
										title={t(`${rs.translationKey}.title`)}
									/>
								</Link>
							);
						})}
					</div>
				</DetailPageSection>
			)}
		</>
	);
}
