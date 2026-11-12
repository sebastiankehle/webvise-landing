import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionArrow } from "@/components/marketing/action";
import Closing from "@/components/marketing/home/closing";
import ServiceScene from "@/components/marketing/home/scenes/service-scene";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, H2, H3 } from "@/components/ui/typography";
import { getOfferingTranslationKey, offeringGroups } from "@/data/offerings";
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
		getTranslations("services"),
		getLocale(),
	]);
	const title = t("hub.title");
	const description = t("subtitle");
	return {
		title,
		description,
		alternates: generateAlternates("/services", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/services", locale),
		},
	};
}

/** Every offering on one page, in its three groups. Each group opens with
 * its live scene and lists what can be ordered under it. */
export default async function ServicesPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [t, tc, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getLocale(),
	]);

	return (
		<>
			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible">
						<H1 className="max-w-[16ch]">{t("hub.title")}</H1>
						<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
							{t("subtitle")}
						</p>
						<ul className="mt-9 flex flex-wrap gap-2">
							{offeringGroups.map((group) => (
								<li key={group.key}>
									<a
										className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-4 text-base text-foreground shadow-[0_0_0_1px_rgba(14,18,23,0.09)] outline-none transition-colors duration-150 hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
										href={`#${group.key}`}
									>
										{t(`groups.${group.key}.title`)}
										<span className="text-muted-foreground">
											{group.items.length}
										</span>
									</a>
								</li>
							))}
						</ul>
						<Link
							className="group/arrow mt-6 inline-flex items-center gap-1.5 text-base text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
							href="/industries"
						>
							{t("hub.byIndustry")}
							<ActionArrow />
						</Link>
					</div>
				</GridContainer>
			</section>

			{offeringGroups.map((group, index) => (
				<SectionWrapper
					id={group.key}
					key={group.key}
					surface={index % 2 === 0 ? "alternate" : "default"}
				>
					<div className="grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:items-start">
						<div className="lg:sticky lg:top-28 lg:col-span-5">
							<div className="rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
								<div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
									<ServiceScene
										kind={group.key}
										locale={locale === "de" ? "de" : "en"}
									/>
								</div>
							</div>
						</div>
						<div className="lg:col-span-6 lg:col-start-7">
							<p className="text-brand-readable text-sm">
								{t(`groups.${group.key}.line`)}
							</p>
							<H2 className="mt-2">{t(`groups.${group.key}.title`)}</H2>
							<p className="mt-4 max-w-[52ch] text-lg text-muted-foreground leading-[1.6]">
								{t(`groups.${group.key}.description`)}
							</p>
							<ul className="mt-8 border-foreground/[0.07] border-t">
								{group.items.map((item) => {
									const key = getOfferingTranslationKey(item);
									return (
										<li
											className="border-foreground/[0.07] border-b"
											key={item.slug}
										>
											<Link
												className="group/arrow -mx-3 flex items-start justify-between gap-6 rounded-[12px] px-3 py-5 outline-none transition-colors duration-150 hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]"
												href={{
													pathname: "/services/[slug]",
													params: { slug: item.slug },
												}}
											>
												<div>
													<H3 className="text-xl leading-snug">
														{item.kind === "service"
															? t(`${key}.title`)
															: tc(`items.${key}.title`)}
													</H3>
													<p className="mt-2 max-w-[52ch] text-base text-muted-foreground leading-[1.6]">
														{item.kind === "service"
															? t(`${key}.description`)
															: tc(`items.${key}.description`)}
													</p>
												</div>
												<span className="mt-1 text-foreground/50 transition-colors group-hover/arrow:text-foreground">
													<ActionArrow />
												</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</SectionWrapper>
			))}

			<Closing />
		</>
	);
}
