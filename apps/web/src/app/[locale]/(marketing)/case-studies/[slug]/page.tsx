import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
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
							href="/case-studies"
							className="transition-colors hover:text-foreground"
						>
							{t("title")}
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li className="truncate text-foreground">{cs.client}</li>
				</ol>
			</nav>

			{/* Header */}
			<section className="pb-24 pt-10 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
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
									<span className="block select-none font-display text-5xl text-brand/30 leading-none">
										&ldquo;
									</span>
									<blockquote className="mt-3 text-muted-foreground text-sm italic leading-relaxed">
										{cs.testimonial.quote}
									</blockquote>
								</div>
								<figcaption className="mt-8 border-border/40 border-t pt-5">
									<p className="text-sm">{cs.testimonial.author}</p>
									<p className="mt-0.5 text-muted-foreground text-xs">
										{cs.testimonial.role}
									</p>
								</figcaption>
							</figure>
						)}
					</div>
				</div>
			</section>

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

			{/* Metrics */}
			{cs.metrics && cs.metrics.length > 0 && (
				<section className="pb-28" aria-label="Project metrics">
					<div className="mx-auto max-w-[1320px] px-6">
						<dl className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-4">
							{cs.metrics.map((metric) => (
								<div
									key={metric.label}
									className="border-border/40 not-last:border-b p-8 text-center md:not-last:border-r md:not-last:border-b-0"
								>
									<dd className="block font-display text-3xl text-brand tracking-tight">
										{metric.value}
									</dd>
									<dt className="mt-2 block text-muted-foreground text-sm">
										{metric.label}
									</dt>
								</div>
							))}
						</dl>
					</div>
				</section>
			)}

			{/* Image gallery */}
			{cs.images && cs.images.length > 0 && (
				<section className="pb-28">
					<div className="mx-auto max-w-[1320px] px-6">
						<CaseStudyGallery images={cs.images} alt={cs.client} />
					</div>
				</section>
			)}

			{/* Related case studies */}
			{relatedCaseStudies.length > 0 && (
				<section className="border-border/40 border-t pb-28 pt-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<h2 className="font-display text-2xl tracking-tight">
							{t("relatedTitle")}
						</h2>
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
										<span className="font-mono text-[10px] text-brand uppercase tracking-widest">
											{related.client} &middot;{" "}
											{related.industry}
										</span>
										<h3 className="mt-2 font-display text-lg tracking-tight transition-colors group-hover:text-brand">
											{related.title}
										</h3>
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
