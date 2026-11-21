import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import { MARK_PARTS } from "@/components/logo";
import { ActionLink, actionVariants } from "@/components/marketing/action";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";

/** The three parts, left to right: what webvise does, in the order the work
 * runs. The same keys name them in the meaning section. */
export const PARTS = ["design", "development", "automation"] as const;

/** Where each part starts, as a share of the mark's 30.25 units: 0, 8.25 and
 * 19.25. Each part's caption starts there, under its part. */
const STEP_LEFTS = ["0%", "27.27%", "63.64%"] as const;

const FACTS = ["mark", "colours", "type", "updated"] as const;

/** The cover: the page title and the mark at full width on the one dark
 * surface of the page. The parts fade in left to right, as the work runs. */
export function BrandHero() {
	const t = useTranslations("brand");

	return (
		<SectionWrapper
			className="pt-12 pb-16 md:pt-20 md:pb-24"
			hatch
			id="top"
			surface="inverted"
		>
			<div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
				<div className="lg:col-span-7">
					<H1>{t("title")}</H1>
					<Lead className="mt-4 max-w-[52ch]">{t("lead")}</Lead>
					<div className="mt-8 flex flex-wrap gap-3">
						<a className={actionVariants({ size: "lg" })} href="#files">
							{t("hero.files")}
						</a>
						<ActionLink href="/media" location="brand_hero" variant="quiet">
							{t("hero.media")}
						</ActionLink>
					</div>
				</div>
				<dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end text-sm leading-6 lg:col-span-4 lg:col-start-9">
					{FACTS.map((key) => (
						<div key={key}>
							<dt className="text-muted-foreground">
								{t(`hero.facts.${key}.term`)}
							</dt>
							<dd className="text-foreground">
								{t(`hero.facts.${key}.value`)}
							</dd>
						</div>
					))}
				</dl>
			</div>

			<figure className="brand-hero mx-auto mt-16 max-w-[1040px] md:mt-24">
				<svg
					aria-label={t("hero.markLabel")}
					className="h-auto w-full text-logo"
					role="img"
					viewBox="0 0 30.25 15"
					xmlns="http://www.w3.org/2000/svg"
				>
					{MARK_PARTS.map((d, i) => (
						<path
							className="brand-hero-part"
							d={d}
							data-part={i + 1}
							fill="currentColor"
							key={d}
						/>
					))}
				</svg>
				<figcaption>
					<ol className="mt-8 border-grid-line border-t sm:relative sm:mt-10 sm:h-20 sm:border-t-0">
						{PARTS.map((key, i) => (
							<li
								className="brand-hero-step flex items-baseline gap-4 border-grid-line border-b py-3 sm:absolute sm:top-0 sm:left-(--step-left) sm:block sm:border-b-0 sm:py-0"
								data-step={i + 1}
								key={key}
								style={{ "--step-left": STEP_LEFTS[i] } as CSSProperties}
							>
								<span className="w-6 shrink-0 text-muted-foreground text-sm tabular-nums sm:block">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="sm:mt-1 sm:block">
									<span className="block font-display text-foreground text-lg leading-snug tracking-[-0.015em]">
										{t(`parts.${key}.name`)}
									</span>
									<span className="block text-muted-foreground text-sm leading-6">
										{t(`parts.${key}.step`)}
									</span>
								</span>
							</li>
						))}
					</ol>
				</figcaption>
			</figure>
		</SectionWrapper>
	);
}
