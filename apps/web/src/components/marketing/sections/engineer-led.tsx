import { getTranslations } from "next-intl/server";

import CardHoverIcon from "@/components/marketing/card-hover-icon";
import { MarketingArrowLink } from "@/components/marketing/marketing-arrow-link";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { ActivityIcon } from "@/components/ui/activity";
import { GaugeIcon } from "@/components/ui/gauge";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { H2, H3, Lead, Muted } from "@/components/ui/typography";

const bulletCount = 7;
const benefitKeys = [
	{ key: "speed", icon: GaugeIcon },
	{ key: "futureProof", icon: ShieldCheckIcon },
	{ key: "performance", icon: ActivityIcon },
];

export default async function EngineerLed() {
	const [t, tb] = await Promise.all([
		getTranslations("engineerLed"),
		getTranslations("benefits"),
	]);

	return (
		<SectionWrapper className="md:py-32" hideOnMobile id="engineer-led">
			<div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[620px] leading-relaxed">
						{t("paragraphs.0")}
					</Lead>
					<Lead className="mt-5 max-w-[620px] leading-relaxed">
						{t("paragraphs.1")}
					</Lead>
					<MarketingArrowLink className="mt-6" href="/about">
						{t("cta")}
					</MarketingArrowLink>
				</div>
				<ul className="surface-card divide-y divide-border/60 self-start overflow-hidden">
					{Array.from({ length: bulletCount }, (_, i) => {
						const bullet = t(`bullets.${i}`);

						return (
							<li className="px-5 py-4 md:px-6" key={bullet}>
								<Muted className="text-foreground text-sm leading-6">
									{bullet}
								</Muted>
							</li>
						);
					})}
				</ul>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div className="surface-card p-6 md:p-7" key={key}>
						<CardHoverIcon className="shrink-0 text-brand-icon" icon={Icon} />
						<H3 className="mt-5">{tb(`${key}.title`)}</H3>
						<Muted className="mt-3">{tb(`${key}.description`)}</Muted>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
