import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H1, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { getServiceBySlug } from "@/data/services";
import { getSolutionBySlug, solutions } from "@/data/solutions";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export function generateStaticParams() {
	return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const solution = getSolutionBySlug(slug);
	if (!solution) {
		return {};
	}

	const [t, locale] = await Promise.all([
		getTranslations(`solutions.items.${solution.translationKey}`),
		getLocale(),
	]);
	const path = `/solutions/${slug}`;

	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: t("metaTitle"),
			description: t("metaDescription"),
			siteName: "webvise",
			url: localizedUrl(path, locale),
		},
		twitter: {
			card: "summary_large_image",
			title: t("metaTitle"),
			description: t("metaDescription"),
		},
	};
}

export default async function SolutionDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const solution = getSolutionBySlug(slug);
	if (!solution) {
		notFound();
	}

	const t = await getTranslations(`solutions.items.${solution.translationKey}`);
	const common = await getTranslations("solutions.detail");
	const serviceT = await getTranslations("services");
	const relatedServices = solution.relatedServices
		.map((serviceSlug) => getServiceBySlug(serviceSlug))
		.filter(
			(service): service is NonNullable<ReturnType<typeof getServiceBySlug>> =>
				Boolean(service)
		);

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Service",
				"@id": `https://webvise.io/solutions/${solution.slug}#service`,
				name: t("title"),
				description: t("description"),
				provider: { "@id": "https://webvise.io/#organization" },
				serviceType: t("title"),
			},
			{
				"@type": "BreadcrumbList",
				"@id": `https://webvise.io/solutions/${solution.slug}#breadcrumb`,
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
						name: common("breadcrumb"),
						item: "https://webvise.io/solutions",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: t("title"),
						item: `https://webvise.io/solutions/${solution.slug}`,
					},
				],
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-32">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<Link
						className="text-muted-foreground text-sm hover:text-foreground"
						href="/solutions"
					>
						{common("backLink")}
					</Link>
					<solution.icon
						className="mt-10 h-5 w-5 text-brand-icon"
						strokeWidth={1.5}
					/>
					<H1 className="mt-6 max-w-4xl">{t("title")}</H1>
					<Lead className="mt-6 max-w-2xl">{t("description")}</Lead>
					<div className="mt-10 flex flex-col gap-4 sm:flex-row">
						<TrackClick
							event="cta_clicked"
							properties={{
								location: "solution_detail_hero",
								variant: solution.slug,
								destination: "contact",
							}}
						>
							<Button
								className="[&]:hover:!bg-brand-hover border-transparent bg-brand text-brand-foreground"
								render={<Link href={{ pathname: "/", hash: "contact" }} />}
								size="lg"
							>
								{common("cta")}
							</Button>
						</TrackClick>
						<Button
							render={<Link href={{ pathname: "/", hash: "pricing" }} />}
							size="lg"
							variant="ghost"
						>
							{common("pricingCta")}
						</Button>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper alternate id="problem">
				<div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
					<div>
						<Caption>{common("problemEyebrow")}</Caption>
						<H2 className="mt-4">{t("problemTitle")}</H2>
					</div>
					<div className="grid border-grid-line border-t md:grid-cols-2">
						{Array.from({ length: solution.problemCount }, (_, i) => (
							<div
								className="border-grid-line border-b p-5 md:border-r md:[&:nth-child(2n)]:border-r-0"
								key={t(`problems.${i}`)}
							>
								<Muted className="text-foreground leading-relaxed">
									{t(`problems.${i}`)}
								</Muted>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper dark id="features">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
					<div>
						<H2>{t("featuresTitle")}</H2>
						<Lead className="mt-5 leading-relaxed">{t("featuresIntro")}</Lead>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						{Array.from({ length: solution.featureCount }, (_, i) => (
							<div
								className="border border-grid-line p-4"
								key={t(`features.${i}`)}
							>
								<Muted className="text-foreground leading-relaxed">
									{t(`features.${i}`)}
								</Muted>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="process">
				<div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
					<div>
						<Caption>{common("processEyebrow")}</Caption>
						<H2 className="mt-4">{common("processTitle")}</H2>
						<Lead className="mt-5 leading-relaxed">{t("processIntro")}</Lead>
					</div>
					<div className="grid border-grid-line border-t">
						{Array.from({ length: solution.processCount }, (_, i) => (
							<div
								className="border-grid-line border-b py-5"
								key={t(`process.${i}`)}
							>
								<Caption className="mb-2 block">0{i + 1}</Caption>
								<H3 className="text-xl">{t(`process.${i}`)}</H3>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper alternate id="related-services">
				<div className="max-w-[680px]">
					<H2>{common("relatedServicesTitle")}</H2>
					<Lead className="mt-5">{common("relatedServicesSubtitle")}</Lead>
				</div>
				<div className="mt-12 grid gap-4 md:grid-cols-3">
					{relatedServices.map((service) => (
						<Link
							className="group border border-border/40 p-5 transition-colors hover:border-brand-border"
							href={{
								pathname: "/services/[slug]",
								params: { slug: service.slug },
							}}
							key={service.slug}
						>
							<H3 className="text-xl transition-colors group-hover:text-brand-readable">
								{serviceT(`${service.translationKey}.title`)}
							</H3>
							<Muted className="mt-2 line-clamp-2">
								{serviceT(`${service.translationKey}.tagline`)}
							</Muted>
						</Link>
					))}
				</div>
			</SectionWrapper>
		</>
	);
}
