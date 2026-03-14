import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { getCaseStudies, getCaseStudyBySlug } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
	return getCaseStudies("en").map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const cs = getCaseStudyBySlug(slug, "en");
	if (!cs) return {};

	return {
		title: `${cs.title} - webvise`,
		description: cs.excerpt,
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

	return (
		<>
			<section className="py-20 md:py-40">
				<div className="mx-auto max-w-[1200px] px-6">
					<div className="max-w-2xl">
						<Link
							href="/case-studies"
							className="font-light text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							&larr; {t("backLink")}
						</Link>
						<div className="mt-6">
							<span className="font-light text-brand text-xs uppercase tracking-wider">
								{cs.client} &middot; {cs.industry}
							</span>
							<h1 className="mt-2 font-normal text-3xl tracking-tight md:text-5xl">
								{cs.title}
							</h1>
							<p className="mt-3 font-light text-lg text-muted-foreground">
								{cs.excerpt}
							</p>
						</div>
						<div className="mt-6 flex flex-wrap gap-2">
							{cs.techStack.map((tech) => (
								<span
									key={tech}
									className="border border-border/40 px-3 py-1.5 font-light text-sm"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>

			{cs.coverImage && (
				<section className="pb-12">
					<div className="mx-auto max-w-[1200px] px-6">
						<div className="relative aspect-[8/5] w-full overflow-hidden border border-border/40">
							<Image
								src={cs.coverImage}
								alt={cs.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					</div>
				</section>
			)}

			<SectionWrapper id="challenge" alternate>
				<div className="grid gap-16 md:grid-cols-2">
					<div>
						<h2 className="font-normal text-2xl tracking-tight">
							{t("challenge")}
						</h2>
						<p className="mt-4 font-light text-muted-foreground leading-relaxed">
							{cs.challenge}
						</p>
					</div>
					<div>
						<h2 className="font-normal text-2xl tracking-tight">
							{t("solution")}
						</h2>
						<p className="mt-4 font-light text-muted-foreground leading-relaxed">
							{cs.solution}
						</p>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="results">
				<h2 className="font-normal text-2xl tracking-tight">{t("results")}</h2>
				<div className="mt-8 max-w-2xl border border-border/40">
					{cs.results.map((result, i) => (
						<div
							key={result}
							className="flex gap-4 not-last:border-border/40 not-last:border-b px-6 py-4"
						>
							<span className="text-brand/60 text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="font-light text-sm">{result}</span>
						</div>
					))}
				</div>
			</SectionWrapper>

			{cs.testimonial && (
				<SectionWrapper id="testimonial" alternate>
					<div className="max-w-2xl">
						<span className="block font-serif text-5xl text-brand/40 leading-none">
							&ldquo;
						</span>
						<p className="mt-4 font-light text-lg text-muted-foreground leading-relaxed">
							{cs.testimonial.quote}
						</p>
						<div className="mt-6">
							<p className="font-medium text-sm">{cs.testimonial.author}</p>
							<p className="font-light text-muted-foreground text-xs">
								{cs.testimonial.role}
							</p>
						</div>
					</div>
				</SectionWrapper>
			)}

			{cs.images && cs.images.length > 0 && (
				<SectionWrapper id="gallery">
					<div className="grid gap-4 md:grid-cols-2">
						{cs.images.map((image) => (
							<div
								key={image}
								className="relative aspect-[8/5] overflow-hidden border border-border/40"
							>
								<Image
									src={image}
									alt={cs.title}
									fill
									className="object-cover"
								/>
							</div>
						))}
					</div>
				</SectionWrapper>
			)}

			<SectionWrapper id="cta">
				<div className="max-w-xl">
					<h2 className="font-normal text-2xl tracking-tight">
						{t("ctaTitle")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("ctaDescription")}
					</p>
					<div className="mt-8 flex gap-3">
						<Button
							className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							render={<a href="/#contact" />}
						>
							{t("ctaButton")}
						</Button>
						<Button variant="outline" render={<Link href="/case-studies" />}>
							{t("ctaSecondary")}
						</Button>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
