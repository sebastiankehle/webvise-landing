import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H1, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { services } from "@/data/services";
import { solutions } from "@/data/solutions";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("solutions.index.meta"),
		getLocale(),
	]);

	return {
		title: t("title"),
		description: t("description"),
		alternates: generateAlternates("/solutions", locale),
		openGraph: {
			title: t("title"),
			description: t("description"),
			siteName: "webvise",
			url: localizedUrl("/solutions", locale),
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
		},
	};
}

export default async function SolutionsPage() {
	const t = await getTranslations("solutions.index");
	const ts = await getTranslations("solutions.items");
	const serviceT = await getTranslations("services");

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"@id": "https://webvise.io/solutions#webpage",
				url: "https://webvise.io/solutions",
				name: t("meta.title"),
				description: t("meta.description"),
				isPartOf: { "@id": "https://webvise.io/#website" },
			},
			{
				"@type": "ItemList",
				"@id": "https://webvise.io/solutions#solutions",
				itemListElement: solutions.map((solution, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: ts(`${solution.translationKey}.title`),
					url: `https://webvise.io/solutions/${solution.slug}`,
				})),
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-32">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<Caption>{t("eyebrow")}</Caption>
					<H1 className="mt-6 max-w-4xl">{t("title")}</H1>
					<Lead className="mt-6 max-w-2xl">{t("subtitle")}</Lead>
					<div className="mt-10 flex flex-col gap-4 sm:flex-row">
						<TrackClick
							event="cta_clicked"
							properties={{
								location: "solutions_index_hero",
								variant: "primary",
								destination: "contact",
							}}
						>
							<Button
								className="[&]:hover:!bg-brand-hover border-transparent bg-brand text-brand-foreground"
								render={<Link href={{ pathname: "/", hash: "contact" }} />}
								size="lg"
							>
								{t("cta")}
							</Button>
						</TrackClick>
						<Button
							render={<Link href={{ pathname: "/", hash: "services" }} />}
							size="lg"
							variant="ghost"
						>
							{t("secondaryCta")}
						</Button>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper alternate id="workflow-problems">
				<div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
					<Caption>{t("problem.eyebrow")}</Caption>
					<div>
						<H2>{t("problem.title")}</H2>
						<Lead className="mt-5 max-w-2xl leading-relaxed">
							{t("problem.body")}
						</Lead>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="solution-cards">
				<div className="max-w-[680px]">
					<H2>{t("cardsTitle")}</H2>
					<Lead className="mt-5">{t("cardsSubtitle")}</Lead>
				</div>
				<StaggerChildren className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-2 lg:grid-cols-3">
					{solutions.map((solution) => (
						<Link
							className="group flex min-h-[320px] flex-col justify-between border-grid-line border-b p-6 transition-colors hover:bg-muted/30 md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
							href={{
								pathname: "/solutions/[slug]",
								params: { slug: solution.slug },
							}}
							key={solution.slug}
						>
							<div>
								<solution.icon
									className="h-5 w-5 text-brand-icon"
									strokeWidth={1.5}
								/>
								<H3 className="mt-5 transition-colors group-hover:text-brand-readable">
									{ts(`${solution.translationKey}.title`)}
								</H3>
								<Muted className="mt-4 leading-relaxed">
									{ts(`${solution.translationKey}.description`)}
								</Muted>
							</div>
							<Caption className="mt-8 text-brand-readable">
								{t("readMore")}
							</Caption>
						</Link>
					))}
				</StaggerChildren>
			</SectionWrapper>

			<SectionWrapper alternate id="how-we-build">
				<div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
					<div>
						<H2>{t("process.title")}</H2>
						<Lead className="mt-5 leading-relaxed">{t("process.body")}</Lead>
					</div>
					<div className="grid border-grid-line border-t">
						{Array.from({ length: 5 }, (_, i) => (
							<div
								className="border-grid-line border-b py-5"
								key={t(`process.steps.${i}`)}
							>
								<Muted className="text-foreground">
									{t(`process.steps.${i}`)}
								</Muted>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="related-services">
				<div className="max-w-[680px]">
					<H2>{t("relatedServicesTitle")}</H2>
					<Lead className="mt-5">{t("relatedServicesSubtitle")}</Lead>
				</div>
				<div className="mt-12 grid gap-4 md:grid-cols-3">
					{services.map((service) => (
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
