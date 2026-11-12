import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionArrow } from "@/components/marketing/action";
import Closing from "@/components/marketing/home/closing";
import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, H3, inlineLinkClassName } from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import { industries } from "@/data/industries";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("industries"),
		getLocale(),
	]);
	const title = t("indexTitle");
	const description = t("indexLead");
	return {
		title,
		description,
		alternates: generateAlternates("/industries", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/industries", locale),
		},
	};
}

/** The fields webvise has built for, each opened by its proof project. */
export default async function IndustriesPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [t, tn, locale] = await Promise.all([
		getTranslations("industries"),
		getTranslations("nav"),
		getLocale(),
	]);

	return (
		<>
			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="stagger-visible">
						<H1 className="max-w-[18ch]">{t("indexTitle")}</H1>
						<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
							{t("indexLead")}
						</p>
						<div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
							{industries.map((industry) => {
								const project = getCaseStudyBySlug(industry.proof[0], locale);
								return (
									<Link
										className="group/arrow flex flex-col rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] outline-none transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(14,18,23,0.1),0_28px_56px_-32px_rgba(14,18,23,0.45)] focus-visible:ring-2 focus-visible:ring-ring/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
										href={{
											pathname: "/industries/[slug]",
											params: { slug: industry.slug },
										}}
										key={industry.slug}
									>
										<div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
											{project && hasProjectScene(project.slug) && (
												<ProjectScene
													opening={
														project.cardImage ?? project.coverImage ?? ""
													}
													sizes="(min-width: 1024px) 400px, 100vw"
													slug={project.slug}
												/>
											)}
										</div>
										<div className="flex flex-1 flex-col px-4 pt-4 pb-3 md:px-5">
											<div className="text-brand-readable text-sm">
												{t(`items.${industry.slug}.name`)}
											</div>
											<H3 className="mt-1.5 text-xl leading-snug">
												{t(`items.${industry.slug}.title`)}
											</H3>
											<span className="mt-5 inline-flex items-center gap-1.5 text-base text-foreground">
												{t("more")}
												<ActionArrow />
											</span>
										</div>
									</Link>
								);
							})}
						</div>
						<p className="mt-10 max-w-[62ch] text-base text-muted-foreground leading-[1.6]">
							<span className="text-foreground">{t("other.title")}</span>{" "}
							{t("other.body")}{" "}
							<Link className={inlineLinkClassName} href="/book">
								{tn("menuPromptCta")}
							</Link>
						</p>
					</div>
				</GridContainer>
			</section>
			<Closing />
		</>
	);
}
