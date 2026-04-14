import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import { GridFrame } from "@/components/marketing/section-wrapper";
import CaseStudyHeroImage from "@/components/marketing/case-study-hero-image";
import { TechBadge } from "@/components/marketing/tech-badge";
import {
	Caption,
	H1,
	H2,
	H3,
	Lead,
	Muted,
	QuoteMark,
	Small,
	Stat,
} from "@/components/ui/typography";
import { getCaseStudies, getCaseStudyBySlug } from "@/data/case-studies";
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
	if (!cs) return {};

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
						alt: `${cs.client} – ${cs.title}`,
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
	const csUrl = localizedUrl(`/case-studies/${slug}`, locale);

	const allCaseStudies = getCaseStudies(locale);
	const relatedCaseStudies = allCaseStudies
		.filter((other) => other.slug !== slug)
		.slice(0, 2);

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
						name: "Home",
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
				<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
					<div className="h-full border-x border-grid-line" />
				</div>
				<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
				<GridFrame className="inset-0" />
				<div className="relative mx-auto max-w-[1320px] px-6">
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
									{cs.liveUrl ? (
										<a
											href={cs.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-1 inline-flex items-center gap-1.5 text-brand text-sm transition-colors hover:text-brand/80"
										>
											{t("visitSite")}
											<ExternalLink className="h-3 w-3" />
										</a>
									) : (
										<Small className="mt-1 block">{t("launchingSoon")}</Small>
									)}
								</div>
							</div>
						</div>

						{/* Tech stack box */}
						<div className="border border-border/40 p-6 md:p-8">
							<Caption className="mb-5 block">{t("techStackLabel")}</Caption>
							<div className="flex flex-wrap gap-2">
								{cs.techStack.map((tech) => (
									<TechBadge key={tech} name={tech} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Hero image + Testimonial */}
			<section className="relative py-20 md:py-28">
				<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
					<div className="h-full border-x border-grid-line" />
				</div>
				<div className="relative mx-auto max-w-[1320px]">
					<div className="grid items-start gap-3 md:grid-cols-3">
						{/* Hero - spans 2 cols */}
						{cs.coverImage && (
							<div className="md:col-span-2">
								<CaseStudyHeroImage
									src={cs.coverImage}
									fullPageImage={cs.fullPageImage}
									alt={`${cs.client} – ${cs.title}`}
								/>
							</div>
						)}
						{/* Quote card */}
						{cs.testimonial && (
							<figure className="flex flex-col justify-between border border-border/40 p-8 md:p-10">
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
				<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
					<div className="h-full border-x border-grid-line" />
				</div>
				<div className="relative mx-auto max-w-[1320px] px-6">
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
				</div>
			</section>

			{/* Metrics */}
			{cs.metrics && cs.metrics.length > 0 && (
				<section className="relative py-20 md:py-28" aria-label="Project metrics">
					<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
						<div className="h-full border-x border-grid-line" />
					</div>
					<div className="relative mx-auto max-w-[1320px] px-6">
						<dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
							{cs.metrics.map((metric) => (
								<div key={metric.label} className="text-center">
									<dd>
										<Stat>{metric.value}</Stat>
									</dd>
									<dt>
										<Muted className="mt-2">{metric.label}</Muted>
									</dt>
								</div>
							))}
						</dl>
					</div>
				</section>
			)}

			{/* Image gallery */}
			{cs.images && cs.images.length > 0 && (
				<section className="relative py-20 md:py-28">
					<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
						<div className="h-full border-x border-grid-line" />
					</div>
					<div className="relative mx-auto max-w-[1320px] px-6">
						<CaseStudyGallery images={cs.images} alt={cs.client} />
					</div>
				</section>
			)}

			{/* Related case studies */}
			{relatedCaseStudies.length > 0 && (
				<section className="relative border-grid-line border-t pt-20 pb-28">
					{/* Constructed grid */}
					<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
						<div className="h-full border-x border-grid-line" />
					</div>
					<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
					<GridFrame className="inset-0" />
					<div className="relative mx-auto max-w-[1320px] px-6">
						<H2>{t("relatedTitle")}</H2>
						<div className="mt-10 grid gap-6 md:grid-cols-2">
							{relatedCaseStudies.map((related) => (
								<Link
									key={related.slug}
									href={{
										pathname: "/case-studies/[slug]",
										params: { slug: related.slug },
									}}
									className="group border border-border/40 transition-colors hover:border-brand/30"
								>
									{related.coverImage && (
										<Image
											src={related.coverImage}
											alt={`${related.client} – ${related.title}`}
											width={756}
											height={383}
											className="h-auto w-full"
											sizes="(max-width: 768px) 100vw, 50vw"
											quality={80}
										/>
									)}
									<div className="p-6">
										<Caption>
											{related.client} &middot; {related.industry}
										</Caption>
										<H3 className="mt-2 text-lg transition-colors group-hover:text-brand">
											{related.title}
										</H3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
