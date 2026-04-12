import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Shield } from "lucide-react";

import FounderCard from "@/components/marketing/founder-card";
import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
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
	const Icon = service.icon;

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

			{/* Breadcrumb */}
			<nav
				aria-label="Breadcrumb"
				className="mx-auto max-w-[1320px] px-6 pt-24 md:pt-36"
			>
				<ol className="flex items-center gap-2 text-sm text-muted-foreground">
					<li>
						<Link
							href="/"
							className="transition-colors hover:text-foreground"
						>
							Home
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li>
						<Link
							href={{ pathname: "/", hash: "services" }}
							className="transition-colors hover:text-foreground"
						>
							{t("title")}
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li className="truncate text-foreground">{t(`${key}.title`)}</li>
				</ol>
			</nav>

			{/* Header */}
			<section className="pb-24 pt-10 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<span className="font-[510] text-brand text-xs tracking-[-0.011em]">
								{t(`${key}.price`)} &middot; {t(`${key}.timeline`)}
							</span>
							<h1 className="mt-3 font-display text-[40px] leading-[1.1] md:text-[56px]">
								{t(`${key}.title`)}
							</h1>
							<p className="mt-4 text-lg text-muted-foreground leading-[1.5]">
								{t(`${key}.tagline`)}
							</p>

							{/* Metadata bar */}
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-border/40 border-t pt-6">
								<div>
									<span className="block text-muted-foreground text-xs tracking-[-0.011em]">
										{td("aboutTitle")}
									</span>
									<p className="mt-1 max-w-lg text-sm leading-[1.5]">
										{t(`${key}.description`)}
									</p>
								</div>
							</div>
						</div>

						{/* Tools box */}
						<div className="border border-border/40 p-6 md:p-8">
							<p className="mb-5 text-muted-foreground/50 text-xs tracking-[-0.011em]">
								{td("toolsTitle")}
							</p>
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
					<h2 className="font-display text-[28px] leading-[1.15] md:text-[40px]">
						{td("painPointsTitle")}
					</h2>
				</div>
				<div className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => (
						<div
							key={t(`${key}.painPoints.${i}.heading`)}
							className="border-border/40 border-t-2 border-t-brand not-last:border-b p-8 md:not-last:border-r md:not-last:border-b-0 md:p-10"
						>
							<h3 className="font-display text-[16px] leading-[21px] tracking-[-0.011em]">
								{t(`${key}.painPoints.${i}.heading`)}
							</h3>
							<p className="mt-3 text-muted-foreground text-sm leading-[1.5]">
								{t(`${key}.painPoints.${i}.description`)}
							</p>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" alternate>
				<h2 className="font-display text-2xl tracking-[-0.011em]">
					{td("featuresTitle")}
				</h2>
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
				<h2 className="font-display text-2xl tracking-[-0.011em]">
					{td("deliverablesTitle")}
				</h2>
				<div className="mt-10 max-w-2xl border border-border/40">
					{Array.from({ length: service.deliverableCount }, (_, i) => (
						<div
							key={t(`${key}.deliverables.${i}`)}
							className="flex gap-4 not-last:border-border/40 not-last:border-b px-6 py-5"
						>
							<span className="text-brand/50 text-xs tracking-[-0.011em]">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="text-sm leading-[1.5]">
								{t(`${key}.deliverables.${i}`)}
							</span>
						</div>
					))}
				</div>
			</SectionWrapper>

			{service.faqCount > 0 && (
				<SectionWrapper id="faq" alternate>
					<h2 className="font-display text-2xl tracking-[-0.011em]">
						{td("faqTitle")}
					</h2>
					<div className="mt-10 max-w-2xl border border-border/40">
						{Array.from({ length: service.faqCount }, (_, i) => (
							<details
								key={t(`${key}.faq.${i}.question`)}
								className="group not-last:border-border/40 not-last:border-b"
							>
								<summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium transition-colors hover:bg-muted/30">
									{t(`${key}.faq.${i}.question`)}
									<span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
										+
									</span>
								</summary>
								<div className="px-6 pb-5 text-muted-foreground text-sm leading-[1.5]">
									{t(`${key}.faq.${i}.answer`)}
								</div>
							</details>
						))}
					</div>
				</SectionWrapper>
			)}

			{slug === "wordpress-migration" && <WpHealthCta />}

			{(slug === "ai-automation" || slug === "ai-consulting" || slug === "full-stack-applications") && (
				<section className="border-border/40 border-t pb-20 pt-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="flex items-start gap-5 border border-border/40 p-6 md:p-8">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
								<Shield className="h-5 w-5 text-brand" strokeWidth={1.5} />
							</div>
							<div>
								<h3 className="font-display text-[16px] leading-[21px] tracking-[-0.011em]">
									{tt("title")}
								</h3>
								<p className="mt-1 max-w-lg text-muted-foreground text-sm leading-[1.5]">
									{tt("description")}
								</p>
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
						<h2 className="font-display text-2xl tracking-[-0.011em]">
							{td("relatedWorkTitle")}
						</h2>
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
										<span className="font-[510] text-brand text-xs tracking-[-0.011em]">
											{cs!.client} &middot; {cs!.industry}
										</span>
										<h3 className="mt-2 font-display text-[16px] leading-[21px] tracking-[-0.011em] transition-colors group-hover:text-brand">
											{cs!.title}
										</h3>
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
						<h2 className="font-display text-2xl tracking-[-0.011em]">
							{td("relatedServicesTitle")}
						</h2>
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
										<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
											<RsIcon className="h-5 w-5 text-brand" strokeWidth={1.5} />
										</div>
										<div>
											<h3 className="font-display text-[16px] leading-[21px] tracking-[-0.011em] transition-colors group-hover:text-brand">
												{t(`${rs!.translationKey}.title`)}
											</h3>
											<p className="mt-1 line-clamp-2 text-muted-foreground text-sm leading-[1.5]">
												{t(`${rs!.translationKey}.tagline`)}
											</p>
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
