import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import { Mark } from "@/components/logo";
import { ActionLink, actionVariants } from "@/components/marketing/action";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";

const FACTS = ["files", "grounds", "sizes", "updated"] as const;

/** Every file in the kit comes on these three grounds, in the CI colours. */
const GROUNDS = [
	{ key: "light", hex: "#f8fafb", logo: "#0e1217" },
	{ key: "inverted", hex: "#050a0f", logo: "#ffffff" },
	{ key: "brand", hex: "#ff8918", logo: "#ffffff" },
] as const;

/** The media kit's cover, built as the brand guidelines' cover is: title,
 * lead and facts on the dark surface, then the three grounds every file
 * comes on, rising in turn. */
export function MediaHero() {
	const t = useTranslations("media");

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
						<a className={actionVariants({ size: "lg" })} href="#logo">
							{t("hero.files")}
						</a>
						<ActionLink href="/brand" location="media_hero" variant="quiet">
							{t("hero.guidelines")}
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

			<ul className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 md:mt-24">
				{GROUNDS.map(({ hex, key, logo }, i) => (
					<li className="brand-hero-step" data-step={i + 1} key={key}>
						<div
							className="flex aspect-[4/3] items-center justify-center rounded-[1.25rem] ring-1 ring-foreground/10 ring-inset"
							style={{ backgroundColor: hex, "--logo": logo } as CSSProperties}
						>
							<Mark className="h-auto w-1/3" />
						</div>
						<p className="mt-3 text-foreground text-sm">
							{t(`grounds.${key}`)}
						</p>
						<p className="text-muted-foreground text-sm tabular-nums">{hex}</p>
					</li>
				))}
			</ul>
		</SectionWrapper>
	);
}
