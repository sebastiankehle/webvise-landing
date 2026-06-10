import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import CaseStudyHeroImage from "@/components/marketing/case-study-hero-image";
import {
	ConstructedGrid,
	DetailPageSection,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { TechBadge } from "@/components/marketing/tech-badge";
import {
	Caption,
	H1,
	H2,
	H3,
	inlineLinkClassName,
	Lead,
	QuoteMark,
	Small,
} from "@/components/ui/typography";
import {
	getCaseStudies,
	getCaseStudyBySlug,
	getRelatedCaseStudies,
} from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export function generateStaticParams() {
	return getCaseStudies("en").map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const locale = await getLocale();
	const cs = getCaseStudyBySlug(slug, locale);

	if (!cs) {
		notFound();
	}

	const t = await getTranslations("caseStudies");
	const tschema = await getTranslations("schema");
	const csUrl = localizedUrl(`/case-studies/${slug}`, locale);

	const relatedCaseStudies = getRelatedCaseStudies(slug, locale);

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
					url: "https://webvise.io",
				},
				publisher: {
					"@type": "Organization",
					name: "webvise",
					url: "https://webvise.io",
				},
				mainEntityOfPage: csUrl,
				...(cs.coverImage && { image: `https://webvise.io${cs.coverImage}` }),
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

			{/* Header */}
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<Caption>
								{cs.client} &middot; {cs.industry}
							</Caption>
							<H1 className="mt-3">{cs.title}</H1>
							<Lead className="mt-5 max-w-[620px]">{cs.excerpt}</Lead>

							{/* Metadata bar */}
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-border/40 border-t pt-6">
								{cs.location && (
									<div>
										<Caption className="block">{t("location")}</Caption>
										<Small className="mt-1 block text-foreground">
											{cs.location}
										</Small>
									</div>
								)}
								{cs.deliveryTime && (
									<div>
										<Caption className="block">{t("deliveryTime")}</Caption>
										<Small className="mt-1 block text-foreground">
											{cs.deliveryTime}
										</Small>
									</div>
								)}
								<div>
									<Caption className="block">{t("liveProject")}</Caption>
									{(() => {
										if (cs.liveUrl) {
											return (
												<a
													className={`${inlineLinkClassName} mt-1 inline-flex items-center gap-1.5`}
													href={cs.liveUrl}
													rel="noopener noreferrer"
													target="_blank"
												>
													{cs.liveUrlLabel ?? t("visitSite")}
													<ExternalLink className="h-3 w-3" />
												</a>
											);
										}
										if (cs.liveUrlLabel) {
											return (
												<Small className="mt-1 block text-foreground">
													{cs.liveUrlLabel}
												</Small>
											);
										}
										return (
											<Small className="mt-1 block">{t("launchingSoon")}</Small>
										);
									})()}
								</div>
							</div>
						</div>

						{/* Tech stack box */}
						<div className="surface-card p-6 md:p-8">
							<Caption className="mb-5 block">{t("techStackLabel")}</Caption>
							<div className="flex flex-wrap gap-2">
								{cs.techStack.map((tech) => (
									<TechBadge key={tech} name={tech} />
								))}
							</div>
						</div>
					</div>
				</GridContainer>
			</section>

			{/* Hero image + Testimonial */}
			<section className="relative py-20 md:py-28">
				<ConstructedGrid hatch variant="content" />
				<div className="relative mx-auto max-w-[1320px]">
					<div className="grid items-start gap-5 md:grid-cols-3">
						{/* Hero - spans 2 cols */}
						{cs.coverImage && (
							<div className="md:col-span-2">
								<CaseStudyHeroImage
									alt={`${cs.client} - ${cs.title}`}
									fullPageImage={cs.fullPageImage}
									src={cs.coverImage}
								/>
							</div>
						)}
						{/* Quote card */}
						{cs.testimonial && (
							<figure className="surface-card flex flex-col justify-between p-8 md:p-10">
								<div>
									<QuoteMark />
									<blockquote className="mt-3 text-muted-foreground text-sm leading-relaxed">
										{cs.testimonial.quote}
									</blockquote>
								</div>
								<figcaption className="mt-8 border-border/40 border-t pt-5">
									<Small className="text-foreground">
										{cs.testimonial.author}
									</Small>
									<Caption className="mt-0.5 block">
										{cs.testimonial.role}
									</Caption>
								</figcaption>
							</figure>
						)}
					</div>
				</div>
			</section>

			{/* Challenge / Solution */}
			<section className="relative py-20 md:py-28">
				<ConstructedGrid hatch variant="content" />
				<GridContainer>
					<div className="grid gap-16 md:grid-cols-2 md:gap-20">
						<div>
							<H2>{t("challenge")}</H2>
							<Lead className="mt-4 leading-relaxed">{cs.challenge}</Lead>
						</div>
						<div>
							<H2>{t("solution")}</H2>
							<Lead className="mt-4 leading-relaxed">{cs.solution}</Lead>
						</div>
					</div>
				</GridContainer>
			</section>

			{/* Image gallery */}
			{cs.images && cs.images.length > 0 && (
				<section className="relative py-20 md:py-28">
					<ConstructedGrid hatch variant="content" />
					<GridContainer>
						<CaseStudyGallery alt={cs.client} images={cs.images} />
					</GridContainer>
				</section>
			)}

			{/* Related case studies */}
			{relatedCaseStudies.length > 0 && (
				<DetailPageSection className="pt-20 pb-28" id="related-case-studies">
					<H2>{t("relatedTitle")}</H2>
					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{relatedCaseStudies.map((related) => (
							<Link
								className="surface-card group overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={{
									pathname: "/case-studies/[slug]",
									params: { slug: related.slug },
								}}
								key={related.slug}
							>
								{related.coverImage && (
									<Image
										alt={`${related.client} - ${related.title}`}
										className="h-auto w-full"
										height={383}
										quality={80}
										sizes="(max-width: 768px) 100vw, 50vw"
										src={related.coverImage}
										width={756}
									/>
								)}
								<div className="p-6">
									<Caption>
										{related.client} &middot; {related.industry}
									</Caption>
									<H3 className="mt-2 text-lg transition-colors group-hover:text-brand-readable">
										{related.title}
									</H3>
								</div>
							</Link>
						))}
					</div>
				</DetailPageSection>
			)}
		</>
	);
}
