import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import {
	CaseStudyCard,
	measuredFigures,
} from "@/components/marketing/case-study-card";
import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import CaseStudyHeroImage from "@/components/marketing/case-study-hero-image";
import CaseStudyScenes from "@/components/marketing/case-study-scenes";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import { QuoteAuthor } from "@/components/marketing/quote-author";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H1, H2, H3 } from "@/components/ui/typography";
import {
	getCaseStudies,
	getCaseStudyBySlug,
	getRelatedCaseStudies,
} from "@/data/case-studies";
import {
	getOfferingBySlug,
	getOfferingTranslationKey,
	type Offering,
} from "@/data/offerings";
import { Link } from "@/i18n/navigation";
import { pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

const factLinkClassName =
	"underline decoration-foreground/25 underline-offset-4 outline-none transition-colors duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

export function generateStaticParams() {
	return getCaseStudies("en").map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	await pinLocale(params);
	const { slug } = await params;
	const locale = await getLocale();
	const cs = getCaseStudyBySlug(slug, locale);
	if (!cs) {
		return {};
	}

	const path = `/case-studies/${slug}`;

	return {
		title: cs.title,
		description: cs.excerpt,
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: cs.title,
			description: cs.excerpt,
			type: "article",
			siteName: "webvise",
			url: localizedUrl(path, locale),
			...(cs.coverImage && {
				images: [
					{
						url: cs.coverImage,
						width: 1512,
						height: 766,
						alt: `${cs.client} - ${cs.title}`,
					},
				],
			}),
		},
		twitter: {
			card: "summary_large_image",
			title: cs.title,
			description: cs.excerpt,
			...(cs.coverImage && { images: [cs.coverImage] }),
		},
	};
}

export default async function CaseStudyPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	await pinLocale(params);
	const { slug } = await params;
	const locale = await getLocale();
	const cs = getCaseStudyBySlug(slug, locale);

	if (!cs) {
		notFound();
	}

	const [t, ts, tc, tschema] = await Promise.all([
		getTranslations("caseStudies"),
		getTranslations("services"),
		getTranslations("customSystems"),
		getTranslations("schema"),
	]);
	const csUrl = localizedUrl(`/case-studies/${slug}`, locale);
	const relatedCaseStudies = getRelatedCaseStudies(slug, locale, 3);
	const offeringLinks = cs.services
		.map((serviceSlug) => getOfferingBySlug(serviceSlug))
		.filter((offering): offering is Offering => Boolean(offering))
		.map((offering) => {
			const key = getOfferingTranslationKey(offering);
			return {
				slug: offering.slug,
				title:
					offering.kind === "service"
						? ts(`${key}.title`)
						: tc(`items.${key}.title`),
			};
		});
	const figures = measuredFigures(cs);
	const facts = [
		{ label: t("industry"), value: cs.industry },
		{ label: t("location"), value: cs.location },
		{ label: t("deliveryTime"), value: cs.deliveryTime },
	].filter((fact): fact is { label: string; value: string } =>
		Boolean(fact.value)
	);

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BreadcrumbList",
				"@id": `${csUrl}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: tschema("home"),
						item: localizedUrl("/", locale),
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("title"),
						item: localizedUrl("/case-studies", locale),
					},
					{
						"@type": "ListItem",
						position: 3,
						name: cs.title,
						item: csUrl,
					},
				],
			},
			{
				"@type": "Article",
				"@id": `${csUrl}#article`,
				headline: cs.title,
				description: cs.excerpt,
				datePublished: cs.date,
				author: {
					"@type": "Organization",
					name: "webvise",
					url: "https://www.webvise.io",
				},
				publisher: {
					"@type": "Organization",
					name: "webvise",
					url: "https://www.webvise.io",
				},
				mainEntityOfPage: csUrl,
				...(cs.coverImage && { image: `${SITE_URL}${cs.coverImage}` }),
			},
			...(cs.testimonial
				? [
						{
							"@type": "Review",
							"@id": `${csUrl}#review`,
							reviewBody: cs.testimonial.quote,
							author: {
								"@type": "Person",
								name: cs.testimonial.author,
							},
							itemReviewed: {
								"@type": "Organization",
								name: "webvise",
							},
						},
					]
				: []),
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible">
						<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-end">
							<div className="lg:col-span-8">
								<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
									<H1>{cs.client}</H1>
									{cs.kind === "concept" && (
										<span className="text-base text-muted-foreground">
											{t("conceptNote")}
										</span>
									)}
								</div>
								<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
									{cs.excerpt}
								</p>
							</div>
							<dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-3 lg:col-start-10 lg:grid-cols-1">
								{facts.map((fact) => (
									<div key={fact.label}>
										<dt className="text-muted-foreground text-sm">
											{fact.label}
										</dt>
										<dd className="mt-1 text-base text-foreground">
											{fact.value}
										</dd>
									</div>
								))}
								{cs.liveUrl && (
									<div>
										<dt className="text-muted-foreground text-sm">
											{t("liveProject")}
										</dt>
										<dd className="mt-1 text-base text-foreground">
											<a
												aria-label={cs.liveUrlLabel}
												className={factLinkClassName}
												href={cs.liveUrl}
												rel="noopener noreferrer"
												target="_blank"
											>
												{new URL(cs.liveUrl).hostname.replace("www.", "")}
											</a>
										</dd>
									</div>
								)}
							</dl>
						</div>

						{/* Measured figures lead, before any picture */}
						{figures.length > 0 && (
							<dl
								className={cn(
									"mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-foreground/[0.08] border-y py-7 md:mt-14",
									figures.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
								)}
							>
								{figures.slice(0, 4).map((metric) => (
									<div className="flex flex-col-reverse" key={metric.label}>
										<dt className="mt-2.5 text-muted-foreground text-sm leading-5">
											{metric.label}
										</dt>
										<dd className="font-display text-3xl text-foreground leading-none md:text-4xl">
											{metric.value}
										</dd>
									</div>
								))}
							</dl>
						)}

						{cs.coverImage && !hasProjectScene(cs.slug) && (
							<div className="mt-12 md:mt-16">
								<CaseStudyHeroImage
									alt={`${cs.client}: ${cs.title}`}
									fullPageImage={cs.fullPageImage}
									src={cs.coverImage}
								/>
							</div>
						)}
						{hasProjectScene(cs.slug) && (
							<CaseStudyScenes
								alt={`${cs.client}: ${cs.title}`}
								images={cs.images}
								metrics={cs.metrics}
								results={cs.results}
								slug={cs.slug}
							/>
						)}
					</div>
				</GridContainer>
			</section>

			{cs.signature && (
				<SectionWrapper id="signature" surface="inverted">
					<StaggerChildren className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
						<H2 className="lg:col-span-6">{cs.signature.title}</H2>
						<p className="max-w-[56ch] text-foreground/85 text-lg leading-[1.6] lg:col-span-5 lg:col-start-8">
							{cs.signature.body}
						</p>
					</StaggerChildren>
				</SectionWrapper>
			)}

			<SectionWrapper id="challenge-solution">
				<StaggerChildren className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<H2>{t("challenge")}</H2>
						<p className="mt-5 text-base text-foreground/80 leading-[1.6]">
							{cs.challenge}
						</p>
					</div>
					<div className="lg:col-span-6 lg:col-start-7">
						<H2>{t("solution")}</H2>
						<p className="mt-5 text-base text-foreground/80 leading-[1.6]">
							{cs.solution}
						</p>
					</div>
				</StaggerChildren>
				{cs.images && cs.images.length > 0 && (
					<div className="mt-14 md:mt-20">
						<CaseStudyGallery alt={cs.client} images={cs.images} />
					</div>
				)}
			</SectionWrapper>

			<SectionWrapper id="case-study-build" surface="alternate">
				<StaggerChildren className="grid gap-x-6 gap-y-14 lg:grid-cols-12">
					{!(cs.results && cs.results.length > 0) && (
						<h2 className="sr-only">{t("detailsTitle")}</h2>
					)}
					{cs.results && cs.results.length > 0 && (
						<div className="lg:col-span-12">
							<H2>{t("built")}</H2>
							<ol className="mt-8 grid gap-x-10 border-foreground/[0.08] border-t md:grid-cols-2">
								{cs.results.map((item, index) => (
									<li
										className="flex gap-5 border-foreground/[0.08] border-b py-4 text-base text-foreground leading-[1.6]"
										key={item}
									>
										<span
											aria-hidden="true"
											className="w-6 shrink-0 text-muted-foreground text-sm tabular-nums leading-[1.75]"
										>
											{String(index + 1).padStart(2, "0")}
										</span>
										{item}
									</li>
								))}
							</ol>
						</div>
					)}

					{cs.testimonial && (
						<figure className="lg:col-span-6">
							<blockquote className="text-foreground text-lg leading-[1.6]">
								{cs.testimonial.quote}
							</blockquote>
							<div className="mt-8">
								<QuoteAuthor
									author={cs.testimonial.author}
									detail={cs.testimonial.role}
								/>
							</div>
						</figure>
					)}

					<div
						className={
							cs.testimonial
								? "grid content-start gap-8 lg:col-span-5 lg:col-start-8"
								: "grid gap-x-6 gap-y-8 md:grid-cols-2 lg:col-span-12"
						}
					>
						{offeringLinks.length > 0 && (
							<div>
								<H3>{t("servicesLabel")}</H3>
								<ul className="mt-3 grid gap-1.5">
									{offeringLinks.map((offering) => (
										<li key={offering.slug}>
											<Link
												className={`text-base text-foreground ${factLinkClassName}`}
												href={{
													pathname: "/services/[slug]",
													params: { slug: offering.slug },
												}}
											>
												{offering.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
						{cs.techStack.length > 0 && (
							<div>
								<H3>{t("techStackLabel")}</H3>
								<p className="mt-3 max-w-[48ch] text-base text-foreground/80 leading-[1.6]">
									{cs.techStack.join(", ")}
								</p>
							</div>
						)}
					</div>
				</StaggerChildren>
			</SectionWrapper>

			{relatedCaseStudies.length > 0 && (
				<SectionWrapper id="related-case-studies">
					<H2>{t("relatedTitle")}</H2>
					<StaggerChildren className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
						{relatedCaseStudies.map((related) => (
							<CaseStudyCard caseStudy={related} key={related.slug} />
						))}
					</StaggerChildren>
				</SectionWrapper>
			)}
		</>
	);
}
