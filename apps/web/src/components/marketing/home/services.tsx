import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import ServiceScene from "@/components/marketing/home/scenes/service-scene";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getOfferingTranslationKey, offeringGroups } from "@/data/offerings";
import { Link } from "@/i18n/navigation";

/** Three kinds of work. Each card opens with a live scene drawn from a real
 * project and lists the offerings behind it. */
export default async function Services() {
	const [ts, tc, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getLocale(),
	]);

	return (
		<SectionWrapper id="services" surface="alternate">
			<SectionHeading description={ts("subtitle")} title={ts("title")} />
			<StaggerChildren className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
				{offeringGroups.map((group) => {
					return (
						<section
							aria-labelledby={`services-${group.key}-title`}
							className="group/card flex scroll-mt-28 flex-col rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
							id={`services-${group.key}`}
							key={group.key}
						>
							{/* The scene, on a quiet plain ground */}
							<div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
								<ServiceScene
									kind={group.key}
									locale={locale === "de" ? "de" : "en"}
								/>
							</div>

							<div className="flex flex-1 flex-col px-4 pt-4 pb-3 md:px-5">
								<h3
									className="font-display text-foreground text-xl leading-snug"
									id={`services-${group.key}-title`}
								>
									{ts(`groups.${group.key}.title`)}
								</h3>
								<p className="mt-2 text-base text-muted-foreground leading-[1.6] lg:min-h-[4.8em]">
									{ts(`groups.${group.key}.description`)}
								</p>
								<ul className="mt-5 border-foreground/[0.07] border-t">
									{group.items.map((item) => {
										const key = getOfferingTranslationKey(item);
										return (
											<li
												className="border-foreground/[0.07] border-b last:border-b-0"
												key={item.slug}
											>
												<Link
													className="group/row -mx-2 flex items-center justify-between gap-4 rounded-[8px] px-2 py-3 text-base text-foreground outline-none transition-colors duration-150 hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]"
													href={{
														pathname: "/services/[slug]",
														params: { slug: item.slug },
													}}
												>
													{item.kind === "service"
														? ts(`${key}.title`)
														: tc(`items.${key}.title`)}
													<span className="flex size-6 shrink-0 items-center justify-center rounded-full text-foreground/35 transition-[background-color,color,translate] duration-150 ease-out group-hover/row:translate-x-0.5 group-hover/row:bg-brand group-hover/row:text-brand-foreground group-focus-visible/row:bg-brand group-focus-visible/row:text-brand-foreground">
														<ArrowRight
															aria-hidden="true"
															className="size-3.5"
														/>
													</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</section>
					);
				})}
			</StaggerChildren>
		</SectionWrapper>
	);
}
