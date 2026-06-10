import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MarketingArrowLink } from "@/components/marketing/marketing-arrow-link";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2, Lead, Muted } from "@/components/ui/typography";

const bulletCount = 7;

export default async function SeniorLed() {
	const t = await getTranslations("seniorLed");

	return (
		<SectionWrapper className="md:py-32" id="senior-led">
			<div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[620px] leading-relaxed">
						{t("paragraphs.0")}
					</Lead>
					<Muted className="mt-5 max-w-[580px] leading-relaxed">
						{t("paragraphs.1")}
					</Muted>
					<MarketingArrowLink className="mt-6" href="/about">
						{t("cta")}
					</MarketingArrowLink>
				</div>
				<ul className="surface-card divide-y divide-border/60 self-start overflow-hidden">
					{Array.from({ length: bulletCount }, (_, i) => {
						const bullet = t(`bullets.${i}`);

						return (
							<li className="flex items-start gap-3.5 px-6 py-4" key={bullet}>
								<Check
									className="mt-0.5 h-4 w-4 shrink-0 text-brand-icon"
									strokeWidth={1.7}
								/>
								<Muted className="text-foreground leading-relaxed">
									{bullet}
								</Muted>
							</li>
						);
					})}
				</ul>
			</div>
		</SectionWrapper>
	);
}
