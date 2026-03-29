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
			<section className="py-24 md:py-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<Link
						href="/case-studies"
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
					>
						&larr; {t("backLink")}
					</Link>
					<div className="mt-10 grid gap-12 md:grid-cols-[1fr_1fr] md:items-end">
						<div>
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
						<div className="flex flex-wrap gap-2 md:justify-end">
							{cs.techStack.map((tech) => (
								<span
									key={tech}
									className="border border-border/40 px-3 py-1.5 text-sm"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>

			{cs.coverImage && (
				<section className="pb-20">
					<div className="mx-auto max-w-[1320px] px-6">
						<div className="relative aspect-video w-full overflow-hidden border border-border/40">
							<Image
								src={cs.coverImage}
								alt={cs.title}
								fill
								className="object-cover object-top"
								priority
							/>
						</div>
					</div>
				</section>
			)}

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

			<SectionWrapper id="results">
				<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:items-start">
					<h2 className="font-display text-2xl tracking-tight">
						{t("results")}
					</h2>
					<div className="border border-border/40">
						{cs.results.map((result, i) => (
							<div
								key={result}
								className="flex gap-4 not-last:border-border/40 not-last:border-b px-6 py-5"
							>
								<span className="mt-0.5 font-display text-brand/50 text-xs">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="text-sm leading-relaxed">
									{result}
								</span>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

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

			<SectionWrapper id="cta">
				<div className="max-w-xl">
					<h2 className="font-display text-2xl tracking-tight">
						{t("ctaTitle")}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">
						{t("ctaDescription")}
					</p>
					<div className="mt-8 flex gap-3">
						<Button
							className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
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
