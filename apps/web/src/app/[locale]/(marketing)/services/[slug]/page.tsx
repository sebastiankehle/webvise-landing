import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { FaqAccordion } from "@/components/marketing/sections/faq";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { TechBadge } from "@/components/marketing/tech-badge";
import {
	Caption,
	H1,
	H2,
	H3,
	Lead,
	Muted,
	Small,
} from "@/components/ui/typography";
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

	const t = await getTranslations("services");
	const td = await getTranslations("serviceDetail");
	const tt = await getTranslations("trust.serviceCallout");
	const key = service.translationKey;
	const ServiceIcon = service.icon;

	const relatedServiceSlugs = relatedServices[slug] ?? [];
	const relatedServiceData = relatedServiceSlugs
		.map((s) => getServiceBySlug(s))
		.filter(
			(
				relatedService,
			): relatedService is NonNullable<ReturnType<typeof getServiceBySlug>> =>
				Boolean(relatedService),
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
			<section className="pt-24 pb-24 md:pt-36 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<ServiceIcon className="h-5 w-5 text-brand" strokeWidth={1.5} />
							<H1 className="mt-6 max-w-3xl">{t(`${key}.title`)}</H1>
							<Lead className="mt-5 max-w-lg">{t(`${key}.description`)}</Lead>
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-border/40 border-t pt-6">
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

						{/* Tools box */}
						<div className="border border-border/40 p-6 md:p-8">
							<Caption className="mb-5 block">{td("toolsTitle")}</Caption>
							<div className="flex flex-wrap gap-2">
								{Array.from({ length: service.toolCount }, (_, i) => (
									<TechBadge
										key={t(`${key}.tools.${i}`)}
										name={t(`${key}.tools.${i}`)}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<SectionWrapper id="approach" className="pt-8 md:pt-12">
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<H2 className="text-2xl md:text-[30px]">{td("approachTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">{t(`${key}.approach`)}</Lead>
					</div>
					<div>
						<H2 className="text-2xl md:text-[30px]">{td("outcomeTitle")}</H2>
						<Lead className="mt-4 leading-relaxed">{t(`${key}.outcome`)}</Lead>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="why">
				<div className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => {
						const PainIcon = service.painPointIcons[i];
						return (
							<div
								key={t(`${key}.painPoints.${i}.heading`)}
								className="border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-last:border-r md:not-last:border-b-0 md:p-10"
							>
								<PainIcon
									className="mb-4 h-5 w-5 text-brand"
									strokeWidth={1.5}
								/>
								<H3>{t(`${key}.painPoints.${i}.heading`)}</H3>
								<Muted className="mt-3 leading-relaxed">
									{t(`${key}.painPoints.${i}.description`)}
								</Muted>
							</div>
						);
					})}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" dark className="py-16 md:py-24">
				<div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
					<div>
						<H2 className="text-2xl md:text-[30px]">{td("featuresTitle")}</H2>
						<ul className="mt-6 space-y-3">
							{Array.from({ length: service.featureCount }, (_, i) => (
								<li
									key={t(`${key}.features.${i}`)}
									className="flex items-start gap-3 text-sm"
								>
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
									<Muted className="text-foreground leading-relaxed">
										{t(`${key}.features.${i}`)}
									</Muted>
								</li>
							))}
						</ul>
					</div>

					<div id="deliverables">
						<H2 className="text-2xl md:text-[30px]">
							{td("deliverablesTitle")}
						</H2>
						<ul className="mt-6 space-y-3">
							{Array.from({ length: service.deliverableCount }, (_, i) => (
								<li
									key={t(`${key}.deliverables.${i}`)}
									className="flex items-start gap-3 text-sm"
								>
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
									<Muted className="text-foreground leading-relaxed">
										{t(`${key}.deliverables.${i}`)}
									</Muted>
								</li>
							))}
						</ul>
					</div>
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

			{(slug === "ai-automation" ||
				slug === "ai-consulting" ||
				slug === "full-stack-applications") && (
				<section className="border-border/40 border-t pt-20 pb-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="flex items-start gap-5 border border-border/40 p-6 md:p-8">
							<Shield
								className="mt-0.5 h-5 w-5 shrink-0 text-brand"
								strokeWidth={1.5}
							/>
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

			{relatedServiceData.length > 0 && (
				<section className="border-border/40 border-t pt-20 pb-28">
					<div className="mx-auto max-w-[1320px] px-6">
						<H2>{td("relatedServicesTitle")}</H2>
						<div className="mt-10 grid gap-6 md:grid-cols-2">
							{relatedServiceData.map((rs) => {
								const RsIcon = rs.icon;
								return (
									<Link
										key={rs.slug}
										href={{
											pathname: "/services/[slug]",
											params: { slug: rs.slug },
										}}
										className="group flex items-start gap-5 border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<RsIcon
											className="mt-0.5 h-5 w-5 shrink-0 text-brand"
											strokeWidth={1.5}
										/>
										<div>
											<H3 className="text-lg transition-colors group-hover:text-brand">
												{t(`${rs.translationKey}.title`)}
											</H3>
											<Muted className="mt-1 line-clamp-2 leading-relaxed">
												{t(`${rs.translationKey}.tagline`)}
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
