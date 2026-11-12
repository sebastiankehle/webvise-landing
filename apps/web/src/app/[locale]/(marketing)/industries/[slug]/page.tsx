import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionArrow, ActionLink } from "@/components/marketing/action";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import Closing from "@/components/marketing/home/closing";
import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import { QuoteAuthor } from "@/components/marketing/quote-author";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H1, H2, H3 } from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import { getIndustryBySlug, industries } from "@/data/industries";
import { Link } from "@/i18n/navigation";
import { pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const items = ["0", "1", "2"] as const;

export function generateStaticParams() {
	return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	await pinLocale(params);
	const { slug } = await params;
	if (!getIndustryBySlug(slug)) {
		return {};
	}
	const [t, locale] = await Promise.all([
		getTranslations("industries"),
		getLocale(),
	]);
	const title = t(`items.${slug}.title`);
	const description = t(`items.${slug}.lead`);
	const path = `/industries/${slug}`;

	return {
		title,
		description,
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl(path, locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

/** One field webvise has built for: where the work gets stuck, what gets
 * built for it, and the real project that backs the page. */
export default async function IndustryPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	await pinLocale(params);
	const { slug } = await params;
	const industry = getIndustryBySlug(slug);
	if (!industry) {
		notFound();
	}

	const [t, th, locale] = await Promise.all([
		getTranslations("industries"),
		getTranslations("home"),
		getLocale(),
	]);
	const projects = industry.proof
		.map((proof) => getCaseStudyBySlug(proof, locale))
		.filter((project) => project !== undefined);
	const lead = projects[0];
	// The second project's scene stands beside the list of what gets built;
	// the first client with a quote speaks for the field.
	const second = projects[1];
	const voice = projects.find((project) => project.testimonial?.quote);

	return (
		<>
			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible grid gap-x-10 gap-y-12 lg:grid-cols-12 lg:items-center">
						<div className="lg:col-span-6">
							<H1>{t(`items.${slug}.title`)}</H1>
							<p className="mt-6 max-w-[54ch] text-foreground text-lg leading-[1.6]">
								{t(`items.${slug}.lead`)}
							</p>
							<ActionLink
								arrow
								className="mt-8"
								href={{ pathname: "/book", query: { topic: industry.topic } }}
								location="industry_detail"
							>
								{th("hero.cta")}
							</ActionLink>
						</div>
						{lead && hasProjectScene(lead.slug) && (
							<div className="rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] lg:col-span-6 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
								<div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
									<ProjectScene
										opening={lead.cardImage ?? lead.coverImage ?? ""}
										sizes="(min-width: 1024px) 620px, 100vw"
										slug={lead.slug}
									/>
								</div>
							</div>
						)}
					</div>
				</GridContainer>
			</section>

			<SectionWrapper id="problems" surface="alternate">
				<H2>{t("problemsTitle")}</H2>
				<StaggerChildren className="mt-10 grid gap-x-10 gap-y-10 md:mt-14 md:grid-cols-3 lg:gap-x-14">
					{items.map((item) => (
						<div key={item}>
							<H3 className="text-xl leading-snug">
								{t(`items.${slug}.problems.${item}.title`)}
							</H3>
							<p className="mt-3 text-base text-muted-foreground leading-[1.6]">
								{t(`items.${slug}.problems.${item}.description`)}
							</p>
						</div>
					))}
				</StaggerChildren>
			</SectionWrapper>

			<SectionWrapper id="builds">
				<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<div className="lg:sticky lg:top-28">
							<H2>{t("buildsTitle")}</H2>
							{second && hasProjectScene(second.slug) && (
								<Link
									className="group/arrow mt-8 block rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-ring/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
									href={{
										pathname: "/case-studies/[slug]",
										params: { slug: second.slug },
									}}
								>
									<div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
										<ProjectScene
											opening={second.cardImage ?? second.coverImage ?? ""}
											sizes="(min-width: 1024px) 480px, 100vw"
											slug={second.slug}
										/>
									</div>
									<span className="flex items-center justify-between gap-4 px-3 pt-3 pb-1.5 text-base text-foreground">
										{second.client}
										<span className="text-foreground/50 transition-colors group-hover/arrow:text-foreground">
											<ActionArrow />
										</span>
									</span>
								</Link>
							)}
						</div>
					</div>
					<StaggerChildren className="lg:col-span-6 lg:col-start-7">
						{items.map((item, index) => (
							<Link
								className="group/arrow -mx-3 flex items-start justify-between gap-6 rounded-[12px] px-3 py-5 outline-none transition-colors duration-150 hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]"
								href={{
									pathname: "/services/[slug]",
									params: { slug: industry.services[index] },
								}}
								key={item}
							>
								<div>
									<H3 className="text-xl leading-snug">
										{t(`items.${slug}.builds.${item}.title`)}
									</H3>
									<p className="mt-2 max-w-[52ch] text-base text-muted-foreground leading-[1.6]">
										{t(`items.${slug}.builds.${item}.description`)}
									</p>
								</div>
								<span className="mt-1 text-foreground/50 transition-colors group-hover/arrow:text-foreground">
									<ActionArrow />
								</span>
							</Link>
						))}
					</StaggerChildren>
				</div>
			</SectionWrapper>

			{voice?.testimonial && (
				<SectionWrapper id="voice" surface="alternate">
					<figure className="mx-auto flex max-w-[52rem] flex-col gap-8">
						<blockquote className="font-display text-2xl text-foreground leading-[1.35] md:text-3xl">
							{voice.testimonial.quote}
						</blockquote>
						<QuoteAuthor
							author={voice.testimonial.author}
							detail={voice.testimonial.role}
						/>
					</figure>
				</SectionWrapper>
			)}

			{projects.length > 0 && (
				<SectionWrapper hatch id="proof" surface="inverted">
					<H2>{t("proofTitle")}</H2>
					<StaggerChildren className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project) => (
							<CaseStudyCard caseStudy={project} key={project.slug} />
						))}
						{/* With two projects, the third place is the visitor's own. */}
						{projects.length % 3 !== 0 && (
							<Link
								className="surface-card group flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={{ pathname: "/book", query: { topic: industry.topic } }}
							>
								<div className="media-frame relative flex aspect-[16/10] w-full items-center justify-center bg-foreground/[0.04]">
									<span className="flex size-14 items-center justify-center rounded-[14px] border border-foreground/25 border-dashed text-foreground/45 transition-colors duration-300 group-hover:border-foreground/45 group-hover:text-foreground/70">
										<Plus aria-hidden="true" className="size-5" />
									</span>
								</div>
								<div className="flex flex-1 flex-col p-6 md:p-7">
									<H3>{t("yours.title")}</H3>
									<p className="mt-3 text-base text-muted-foreground leading-[1.6]">
										{t("yours.body")}
									</p>
									<span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-base text-foreground">
										{th("hero.cta")}
										<ActionArrow />
									</span>
								</div>
							</Link>
						)}
					</StaggerChildren>
				</SectionWrapper>
			)}

			<Closing />
		</>
	);
}
