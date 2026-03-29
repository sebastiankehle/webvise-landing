import { Activity, Gauge, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const benefitKeys = [
	{ key: "speed", icon: Gauge },
	{ key: "futureProof", icon: ShieldCheck },
	{ key: "performance", icon: Activity },
];

export default async function Benefits() {
	const t = await getTranslations("benefits");

	return (
		<SectionWrapper id="benefits">
			<div className="max-w-2xl">
				<h2 className="font-display text-4xl tracking-tight md:text-5xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div
						key={key}
						className="group border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-last:border-r md:not-last:border-b-0 md:p-10"
					>
						<div className="flex h-10 w-10 items-center justify-center border border-brand/20 bg-brand/5">
							<Icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
						</div>
						<h3 className="mt-5 font-display text-xl">{t(`${key}.title`)}</h3>
						<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
							{t(`${key}.description`)}
						</p>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
