import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import CaseStudyGallery from "@/components/marketing/case-study-gallery";
import CaseStudyHeroImage from "@/components/marketing/case-study-hero-image";
import { TechBadge } from "@/components/marketing/tech-badge";
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

					<div className="mt-10 grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<span className="font-mono text-[10px] text-brand uppercase tracking-widest">
								{cs.client} &middot; {cs.industry}
							</span>
							<h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
								{cs.title}
							</h1>
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
								{cs.excerpt}
							</p>

							{/* Metadata bar */}
							<div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-4 border-border/40 border-t pt-6">
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
										<span className="mt-1 block text-sm">
											{cs.deliveryTime}
										</span>
									</div>
								)}
								<div>
									<span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
										{t("liveProject")}
									</span>
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
										<span className="mt-1 block text-muted-foreground text-sm">
											{t("launchingSoon")}
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Tech stack box */}
						<div className="border border-border/40 p-6 md:p-8">
							<p className="mb-5 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
								{t("techStackLabel")}
							</p>
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
			<section className="pb-28">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-3 md:grid-cols-3">
						{/* Hero — spans 2 cols */}
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
							<div className="flex flex-col justify-between border border-border/40 p-8 md:p-10">
								<div>
									<span className="block select-none font-display text-5xl text-brand/30 leading-none">
										&ldquo;
									</span>
									<p className="mt-3 text-muted-foreground text-sm italic leading-relaxed">
										{cs.testimonial.quote}
									</p>
								</div>
								<div className="mt-8 border-border/40 border-t pt-5">
									<p className="text-sm">{cs.testimonial.author}</p>
									<p className="mt-0.5 text-muted-foreground text-xs">
										{cs.testimonial.role}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Metrics */}
			{cs.metrics && cs.metrics.length > 0 && (
				<section className="pb-28">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-4">
							{cs.metrics.map((metric) => (
								<div
									key={metric.label}
									className="border-border/40 not-last:border-b p-8 text-center md:not-last:border-r md:not-last:border-b-0"
								>
									<span className="block font-display text-3xl text-brand tracking-tight">
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

			{/* Challenge / Solution */}
			<section className="pb-28">
				<div className="mx-auto max-w-[1320px] px-6">
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
				</div>
			</section>

			{/* Image gallery */}
			{((cs.images && cs.images.length > 0) || cs.fullPageImage) && (
				<section className="pb-28">
					<div className="mx-auto max-w-[1320px] px-6">
						<CaseStudyGallery images={cs.images} alt={cs.client} />
					</div>
				</section>
			)}
		</>
	);
}
