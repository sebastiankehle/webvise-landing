import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import CaseStudyHeroImage from "@/components/marketing/case-study-hero-image";
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
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import {
	Caption,
	H1,
	H2,
	H3,
	Lead,
	Muted,
	QuoteMark,
	Small,
} from "@/components/ui/typography";
import {
	getCaseStudies,
	getCaseStudyBySlug,
	getRelatedCaseStudies,
} from "@/data/case-studies";
import {
	getOfferingBySlug,
	getOfferingIcon,
	getOfferingTranslationKey,
	type Offering,
} from "@/data/offerings";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const testimonialAvatars: Record<string, string> = {
	"Anna-Maria von Platen": "/images/testimonials/anna-maria-von-platen.png",
	"Felix Rautenberg": "/images/testimonials/felix-rautenberg.jpeg",
	"Joshua Kunish": "/images/testimonials/joshua-kunish.png",
	"Nick Liverman": "/images/testimonials/nick-liverman.jpg",
	"Richard Heinbach": "/images/testimonials/richard-heinbach.jpeg",
	"Sebastian Kundoch": "/images/testimonials/sebastian-kundoch.jpeg",
};

const whitespacePattern = /\s+/;

function CaseStudySummary({
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

	const [t, td, ts, tc, tschema] = await Promise.all([
		getTranslations("caseStudies"),
		getTranslations("serviceDetail"),
		getTranslations("services"),
		getTranslations("customSystems"),
		getTranslations("schema"),
	]);
	const csUrl = localizedUrl(`/case-studies/${slug}`, locale);
	const relatedCaseStudies = getRelatedCaseStudies(slug, locale);
	const relatedOfferings = cs.services
		.map((serviceSlug) => getOfferingBySlug(serviceSlug))
		.filter((offering): offering is Offering => Boolean(offering))
		.slice(0, 2);
	const summaryItems = [
		{ label: t("location"), value: cs.location ?? "" },
		{ label: t("deliveryTime"), value: cs.deliveryTime ?? "" },
	];

	const getRelatedTitle = (offering: Offering) => {
		const key = getOfferingTranslationKey(offering);

		return offering.kind === "service"
			? ts(`${key}.title`)
			: tc(`items.${key}.title`);
	};
	const getRelatedDescription = (offering: Offering) => {
		const key = getOfferingTranslationKey(offering);

		return offering.kind === "service"
			? ts(`${key}.tagline`)
			: tc(`items.${key}.description`);
	};

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

			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
						<div>
							<Caption className="text-brand-readable">
								{cs.client} &middot; {cs.industry}
							</Caption>
							<H1 className="mt-4 max-w-3xl md:text-4xl">{cs.title}</H1>
							<Lead className="mt-5 max-w-xl">{cs.excerpt}</Lead>
							<CaseStudySummary items={summaryItems} />
						</div>

						{cs.coverImage && (
							<CaseStudyHeroImage
								alt={`${cs.client} - ${cs.title}`}
								fullPageImage={cs.fullPageImage}
								src={cs.coverImage}
							/>
						)}
					</div>
				</GridContainer>
			</section>

			<SectionWrapper
				className="pt-8 pb-20 md:pt-12 md:pb-28"
				id="challenge-solution"
			>
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<H3>{t("challenge")}</H3>
						<Lead className="mt-4 leading-relaxed">{cs.challenge}</Lead>
					</div>
					<div>
						<H3>{t("solution")}</H3>
						<Lead className="mt-4 leading-relaxed">{cs.solution}</Lead>
					</div>
				</div>
			</SectionWrapper>

			{cs.images && cs.images.length > 0 && (
				<SectionWrapper
					className="pt-8 pb-20 md:pt-12 md:pb-28"
					id="case-study-images"
				>
					<CaseStudyGallery alt={cs.client} images={cs.images} />
				</SectionWrapper>
			)}

			<SectionWrapper id="case-study-build" surface="inverted">
				<div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
					<div>
						{cs.testimonial ? (
							<figure>
								<QuoteMark />
								<blockquote className="mt-4 max-w-2xl text-base text-muted-foreground leading-7">
									{cs.testimonial.quote}
								</blockquote>
								<figcaption className="mt-8 flex items-center gap-3 border-grid-line border-t pt-5">
									{testimonialAvatars[cs.testimonial.author] ? (
										<Image
											alt=""
											className="size-10 shrink-0 rounded-full object-cover"
											height={40}
											src={testimonialAvatars[cs.testimonial.author]}
											width={40}
										/>
									) : (
										<div
											aria-hidden="true"
											className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground text-xs"
										>
											{cs.testimonial.author
												.split(whitespacePattern)
												.map((part) => part[0])
												.join("")
												.slice(0, 2)}
										</div>
									)}
									<div className="min-w-0">
										<Small className="text-foreground">
											{cs.testimonial.author}
										</Small>
										<Caption className="mt-0.5 block">
											{cs.testimonial.role}
										</Caption>
									</div>
								</figcaption>
							</figure>
						) : (
							<div>
								<H3>{cs.client}</H3>
								<Lead className="mt-4 max-w-2xl leading-relaxed">
									{cs.excerpt}
								</Lead>
							</div>
						)}
					</div>

					{cs.techStack.length > 0 && (
						<div>
							<H3>{t("techStackLabel")}</H3>
							<div className="mt-8 flex flex-wrap gap-2">
								{cs.techStack.map((tech) => (
									<MarketingTag
										className="bg-foreground/10 text-foreground"
										key={tech}
										variant="subtle"
									>
										{tech}
									</MarketingTag>
								))}
							</div>
						</div>
					)}
				</div>
			</SectionWrapper>

			{relatedCaseStudies.length > 0 && (
				<DetailPageSection className="pt-20 pb-28" id="related-case-studies">
					<H2>{t("relatedTitle")}</H2>
					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{relatedCaseStudies.map((related) => (
							<Link
								className="surface-card media-frame group outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
									<H3 className="mt-2 text-base">{related.title}</H3>
								</div>
							</Link>
						))}
					</div>
				</DetailPageSection>
			)}

			<CaseStudyNextStep
				ctaButton={td("ctaButton")}
				ctaDescription={td("ctaDescription")}
				ctaEyebrow={td("ctaEyebrow")}
				ctaTitle={td("ctaTitle")}
				getRelatedDescription={getRelatedDescription}
				getRelatedTitle={getRelatedTitle}
				locale={locale}
				relatedOfferings={relatedOfferings}
				relatedTitle={td("relatedOfferingsTitle")}
			/>
		</>
	);
}

function CaseStudyNextStep({
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
		<SectionWrapper id="case-study-next-step" surface="inverted">
			<div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:gap-16">
				<div className="max-w-xl">
					<Caption className="text-brand-readable">{ctaEyebrow}</Caption>
					<H2 className="mt-3">{ctaTitle}</H2>
					<Muted className="mt-4 leading-relaxed">{ctaDescription}</Muted>
					<TrackClick
						event="cta_clicked"
						properties={{
							location: "case_study_detail",
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
