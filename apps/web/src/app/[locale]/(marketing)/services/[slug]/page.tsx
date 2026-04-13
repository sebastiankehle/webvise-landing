import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Shield } from "lucide-react";

import FounderCard from "@/components/marketing/founder-card";
import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { FaqAccordion } from "@/components/marketing/sections/faq";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { Caption, H1, H2, H3, Label, Lead, Mono, Muted } from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import {
	getServiceBySlug,
	relatedServices,
	serviceCaseStudies,
	services,
} from "@/data/services";
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
	if (!service) return {};

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

	const locale = await getLocale();
	const t = await getTranslations("services");
	const td = await getTranslations("serviceDetail");
	const tt = await getTranslations("trust.serviceCallout");
	const key = service.translationKey;
	const relatedSlugs = serviceCaseStudies[slug] ?? [];
	const relatedCaseStudies = relatedSlugs
		.map((csSlug) => getCaseStudyBySlug(csSlug, locale))
		.filter(Boolean);

	const relatedServiceSlugs = relatedServices[slug] ?? [];
	const relatedServiceData = relatedServiceSlugs
		.map((s) => getServiceBySlug(s))
		.filter(Boolean);

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
					name: "Worldwide",
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
						name: "Home",
						item: "https://webvise.io",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Services",
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
			<section className="pb-24 pt-24 md:pb-36 md:pt-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<Caption>
								{t(`${key}.tagline`)} &middot; {t(`${key}.price`)} &middot; {t(`${key}.timeline`)}
							</Caption>
							<H1 className="mt-6">{t(`${key}.title`)}</H1>
							<Lead className="mt-5 max-w-lg">
								{t(`${key}.description`)}
							</Lead>
						</div>

						{/* Tools box */}
						<div className="border border-border/40 p-6 md:p-8">
							<Caption className="mb-5 block">
								{td("toolsTitle")}
							</Caption>
							<div className="flex flex-wrap gap-2">
								{Array.from({ length: service.toolCount }, (_, i) => (
									<span
										key={t(`${key}.tools.${i}`)}
										className="border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
									>
										{t(`${key}.tools.${i}`)}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<SectionWrapper id="why">
				<div className="max-w-2xl">
					<H2>{td("painPointsTitle")}</H2>
				</div>
				<div className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => (
						<div
							key={t(`${key}.painPoints.${i}.heading`)}
							className="border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-last:border-r md:not-last:border-b-0 md:p-10"
						>
							<H3>{t(`${key}.painPoints.${i}.heading`)}</H3>
							<Muted className="mt-3 leading-relaxed">
								{t(`${key}.painPoints.${i}.description`)}
							</Muted>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" alternate>
				<H2>{td("featuresTitle")}</H2>
				<div className="mt-10 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2">
					{Array.from({ length: service.featureCount }, (_, i) => (
						<div
							key={t(`${key}.features.${i}`)}
							className="border-border/40 not-last:border-b p-5 text-sm md:nth-last-[-n+2]:border-b-0 md:odd:not-last:border-r"
						>
							{t(`${key}.features.${i}`)}
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="deliverables">
				<H2>{td("deliverablesTitle")}</H2>
				<div className="mt-10 max-w-2xl border border-border/40">
					{Array.from({ length: service.deliverableCount }, (_, i) => (
						<div
							key={t(`${key}.deliverables.${i}`)}
							className="flex items-baseline gap-4 not-last:border-border/40 not-last:border-b px-6 py-5"
						>
							<Mono className="text-brand/50">
								{String(i + 1).padStart(2, "0")}
							</Mono>
							<span className="text-sm leading-relaxed">
								{t(`${key}.deliverables.${i}`)}
							</span>
						</div>
					))}
				</div>
			</SectionWrapper>

			{service.faqCount > 0 && (
				<SectionWrapper id="faq" alternate>
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

			{(slug === "ai-automation" || slug === "ai-consulting" || slug === "full-stack-applications") && (
				<section className="border-border/40 border-t pb-20 pt-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="flex items-start gap-5 border border-border/40 p-6 md:p-8">
							<Shield className="h-5 w-5 shrink-0 text-brand mt-0.5" strokeWidth={1.5} />
							<div>
								<H3 className="text-lg">{tt("title")}</H3>
								<Muted className="mt-1 max-w-lg leading-relaxed">
									{tt("description")}
								</Muted>
							</div>
						</div>
					</div>
				</section>
			)}

			<section className="border-border/40 border-t pb-20 pt-20">
				<div className="mx-auto max-w-[1320px] px-6">
					<FounderCard />
				</div>
			</section>

			{relatedCaseStudies.length > 0 && (
				<section className="border-border/40 border-t pb-28 pt-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<H2>{td("relatedWorkTitle")}</H2>
						<div className="mt-10 grid gap-6 md:grid-cols-2">
							{relatedCaseStudies.map((cs) => (
								<Link
									key={cs!.slug}
									href={{
										pathname: "/case-studies/[slug]",
										params: { slug: cs!.slug },
									}}
									className="group border border-border/40 transition-colors hover:border-brand/30"
								>
									{cs!.coverImage && (
										<Image
											src={cs!.coverImage}
											alt={`${cs!.client} - ${cs!.title}`}
											width={756}
											height={383}
											className="h-auto w-full"
											sizes="(max-width: 768px) 100vw, 50vw"
											quality={80}
										/>
									)}
									<div className="p-6">
										<Label>{cs!.client} &middot; {cs!.industry}</Label>
										<H3 className="mt-2 text-lg transition-colors group-hover:text-brand">
											{cs!.title}
										</H3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			{relatedServiceData.length > 0 && (
				<section className="border-border/40 border-t pb-28 pt-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<H2>{td("relatedServicesTitle")}</H2>
						<div className="mt-10 grid gap-6 md:grid-cols-2">
							{relatedServiceData.map((rs) => {
								const RsIcon = rs!.icon;
								return (
									<Link
										key={rs!.slug}
										href={{
											pathname: "/services/[slug]",
											params: { slug: rs!.slug },
										}}
										className="group flex items-start gap-5 border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<RsIcon className="h-5 w-5 shrink-0 text-brand mt-0.5" strokeWidth={1.5} />
										<div>
											<H3 className="text-lg transition-colors group-hover:text-brand">
												{t(`${rs!.translationKey}.title`)}
											</H3>
											<Muted className="mt-1 line-clamp-2 leading-relaxed">
												{t(`${rs!.translationKey}.tagline`)}
											</Muted>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>
		)}

		</>
	);
}
