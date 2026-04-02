import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
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
			title: `${cs.title} | webvise`,
			description: cs.excerpt,
			siteName: "webvise",
			url: localizedUrl(path, locale),
			...(cs.coverImage && { images: [{ url: cs.coverImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title: `${cs.title} | webvise`,
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
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			{/* Header */}
			<section className="py-24 md:py-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<Link
						href="/case-studies"
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						&larr; {t("backLink")}
					</Link>
					<div className="mt-10 max-w-3xl">
						<span className="font-mono text-[10px] text-brand uppercase tracking-widest">
							{cs.client} &middot; {cs.industry}
						</span>
						<h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
							{cs.title}
						</h1>
						<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
							{cs.excerpt}
						</p>
					</div>

					{/* Metadata bar */}
					<div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-border/40 border-t pt-6">
						{cs.location && (
							<div>
								<span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									{t("location")}
								</span>
								<span className="mt-1 block text-sm">{cs.location}</span>
							</div>
						)}
						{cs.deliveryTime && (
							<div>
								<span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									{t("deliveryTime")}
								</span>
								<span className="mt-1 block text-sm">{cs.deliveryTime}</span>
							</div>
						)}
						<div>
							<span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
								{t("techStackLabel")}
							</span>
							<span className="mt-1 block text-sm">
								{cs.techStack.slice(0, 4).join(", ")}
							</span>
						</div>
						{cs.liveUrl && (
							<div>
								<span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									{t("liveProject")}
								</span>
								<a
									href={cs.liveUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand transition-colors hover:text-brand/80"
								>
									{t("visitSite")}
									<ExternalLink className="h-3 w-3" />
								</a>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Hero image */}
			{cs.coverImage && (
				<section className="pb-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="relative aspect-video w-full overflow-hidden border border-border/40">
							<Image
								src={cs.coverImage}
								alt={`${cs.client} – ${cs.title}`}
								fill
								className="object-cover object-top"
								priority
							/>
						</div>
					</div>
				</section>
			)}

			{/* Challenge / Solution */}
			<SectionWrapper id="challenge" alternate>
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<h2 className="font-display text-2xl tracking-tight">
							{t("challenge")}
						</h2>
						<p className="mt-4 text-muted-foreground leading-relaxed">
							{cs.challenge}
						</p>
					</div>
					<div>
						<h2 className="font-display text-2xl tracking-tight">
							{t("solution")}
						</h2>
						<p className="mt-4 text-muted-foreground leading-relaxed">
							{cs.solution}
						</p>
					</div>
				</div>
			</SectionWrapper>

			{/* Image gallery */}
			{cs.images && cs.images.length > 0 && (
				<section className="py-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<CaseStudyGallery images={cs.images} alt={cs.client} />
					</div>
				</section>
			)}

			{/* Metrics */}
			{cs.metrics && cs.metrics.length > 0 && (
				<section className="pb-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-4">
							{cs.metrics.map((metric) => (
								<div
									key={metric.label}
									className="border-border/40 not-last:border-b p-8 text-center md:not-last:border-r md:not-last:border-b-0"
								>
									<span className="block font-display text-3xl tracking-tight text-brand">
										{metric.value}
									</span>
									<span className="mt-2 block text-muted-foreground text-sm">
										{metric.label}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Testimonial */}
			{cs.testimonial && (
				<SectionWrapper id="testimonial" dark>
					<div className="mx-auto max-w-3xl text-center">
						<span className="block font-display text-6xl text-brand/30 leading-none select-none">
							&ldquo;
						</span>
						<p className="mt-4 text-xl leading-relaxed text-muted-foreground md:text-2xl italic">
							{cs.testimonial.quote}
						</p>
						<div className="mt-8">
							<p className="text-sm">{cs.testimonial.author}</p>
							<p className="mt-1 text-muted-foreground text-xs">
								{cs.testimonial.role}
							</p>
						</div>
					</div>
				</SectionWrapper>
			)}

		</>
	);
}
