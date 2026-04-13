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
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div
						key={key}
						className="group border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-last:border-r md:not-last:border-b-0 md:p-10"
					>
						<Icon className="h-5 w-5 text-brand shrink-0" strokeWidth={1.5} />
						<H3 className="mt-5">{t(`${key}.title`)}</H3>
						<Muted className="mt-3">{t(`${key}.description`)}</Muted>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
