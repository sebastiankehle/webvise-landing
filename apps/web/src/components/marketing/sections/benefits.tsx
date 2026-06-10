import { getTranslations } from "next-intl/server";

import CardHoverIcon from "@/components/marketing/card-hover-icon";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { ActivityIcon } from "@/components/ui/activity";
import { GaugeIcon } from "@/components/ui/gauge";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { H2, H3, Lead, Muted } from "@/components/ui/typography";

const benefitKeys = [
	{ key: "speed", icon: GaugeIcon },
	{ key: "futureProof", icon: ShieldCheckIcon },
	{ key: "performance", icon: ActivityIcon },
];

export default async function Benefits() {
	const t = await getTranslations("benefits");

	return (
		<SectionWrapper id="benefits">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div className="surface-card p-6 md:p-7" key={key}>
						<CardHoverIcon className="shrink-0 text-brand-icon" icon={Icon} />
						<H3 className="mt-5">{t(`${key}.title`)}</H3>
						<Muted className="mt-3">{t(`${key}.description`)}</Muted>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
