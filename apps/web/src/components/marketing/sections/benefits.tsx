import { Activity, Gauge, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, H3, Lead, Muted } from "@/components/ui/typography";

const benefitKeys = [
	{ key: "speed", icon: Gauge },
	{ key: "futureProof", icon: ShieldCheck },
	{ key: "performance", icon: Activity },
];

export default async function Benefits() {
	const t = await getTranslations("benefits");

	return (
		<SectionWrapper id="benefits">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-16 -mx-6 grid border-t border-grid-line md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div key={key} className="group border-b border-grid-line p-6 md:border-r md:p-8 md:[&:nth-child(3n)]:border-r-0">
						<Icon
							className="h-5 w-5 shrink-0 text-brand opacity-60"
							strokeWidth={1.5}
						/>
						<H3 className="mt-5">{t(`${key}.title`)}</H3>
						<Muted className="mt-3">{t(`${key}.description`)}</Muted>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
