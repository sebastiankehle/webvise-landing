import NextLink from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { MarketingTag } from "@/components/marketing/marketing-tag";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { homepageSectionHref } from "@/lib/homepage-section-href";

const tiers = [
	{ key: "focused", featureCount: 4, featured: false },
	{ key: "system", featureCount: 5, featured: true },
	{ key: "support", featureCount: 4, featured: false },
];

export default async function Pricing() {
	const [locale, t] = await Promise.all([
		getLocale(),
		getTranslations("pricing"),
	]);

	return (
		<SectionWrapper id="scope" surface="alternate">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-10 grid items-stretch gap-5 md:mt-16 md:grid-cols-3">
				{tiers.map(({ key, featureCount, featured }) => (
					<div className="surface-card flex flex-col p-6 md:p-7" key={key}>
						<Caption className="block text-brand-readable">
							{t(`tiers.${key}.scope`)}
						</Caption>
						<div className="mt-3 flex items-center gap-3">
							<H3 className="text-xl">{t(`tiers.${key}.name`)}</H3>
							{featured && (
								<MarketingTag variant="brand">
									{t(`tiers.${key}.badge`)}
								</MarketingTag>
							)}
						</div>
						<Muted className="mt-3 leading-relaxed">
							{t(`tiers.${key}.description`)}
						</Muted>
						<ul className="mt-6 space-y-3 border-border/60 border-t pt-6">
							{Array.from({ length: featureCount }, (_, i) => (
								<li
									className="flex items-baseline gap-3"
									key={t(`tiers.${key}.features.${i}`)}
								>
									<span
										aria-hidden="true"
										className="h-1.5 w-1.5 shrink-0 self-center bg-brand"
									/>
									<Muted className="text-foreground/90 text-sm leading-relaxed">
										{t(`tiers.${key}.features.${i}`)}
									</Muted>
								</li>
							))}
						</ul>
					</div>
				))}
			</StaggerChildren>
			<div className="surface-card mt-5 flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-7">
				<Muted className="max-w-[640px] leading-relaxed">{t("note")}</Muted>
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "pricing",
						variant: "primary",
						destination: "contact",
					}}
				>
					<Button
						className="shrink-0"
						render={
							<NextLink
								aria-label={t("cta")}
								href={homepageSectionHref("contact", locale)}
							/>
						}
						size="lg"
						variant="brand"
					>
						{t("cta")}
					</Button>
				</TrackClick>
			</div>
		</SectionWrapper>
	);
}
