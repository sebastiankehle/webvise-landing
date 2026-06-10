import { getTranslations } from "next-intl/server";

import CardHoverIcon from "@/components/marketing/card-hover-icon";
import MiniChartLazy from "@/components/marketing/mini-chart-lazy";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { BlocksIcon } from "@/components/ui/blocks";
import { CompassIcon } from "@/components/ui/compass";
import { H2, H3, Lead, Muted } from "@/components/ui/typography";
import { UserIcon } from "@/components/ui/user";
import { WrenchIcon } from "@/components/ui/wrench";

const metricKeys = [
	{ key: "projects", icon: UserIcon },
	{ key: "raised", icon: CompassIcon },
	{ key: "users", icon: BlocksIcon },
	{ key: "launch", icon: WrenchIcon },
];

export default async function Metrics() {
	const t = await getTranslations("metrics");

	return (
		<SectionWrapper hatch id="metrics" surface="inverted">
			<div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
				<div className="max-w-[640px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
				</div>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
				{metricKeys.map(({ key, icon: Icon }) => (
					<div className="surface-card p-6 md:p-7" key={key}>
						<CardHoverIcon className="shrink-0 text-brand-icon" icon={Icon} />
						<H3 className="mt-6 text-2xl md:mt-10 md:text-3xl">
							{t(`${key}.value`)}
						</H3>
						<Muted className="mt-2 leading-relaxed">{t(`${key}.label`)}</Muted>
					</div>
				))}
			</StaggerChildren>
			<MiniChartLazy
				translations={{
					conversionLabel: t("chart.conversionLabel"),
					conversionDescription: t("chart.conversionDescription"),
					engagementLabel: t("chart.engagementLabel"),
					engagementDescription: t("chart.engagementDescription"),
					speedLabel: t("chart.speedLabel"),
					speedDescription: t("chart.speedDescription"),
					before: t("chart.before"),
					afterWebvise: t("chart.afterWebvise"),
					after: t("chart.after"),
					resultNote: t("chart.resultNote"),
				}}
			/>
		</SectionWrapper>
	);
}
