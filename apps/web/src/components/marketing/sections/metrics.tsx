import { getTranslations } from "next-intl/server";

import MiniChart from "@/components/marketing/mini-chart";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, Lead, Small, Stat } from "@/components/ui/typography";

const metricKeys = ["projects", "raised", "users", "launch"];

export default async function Metrics() {
	const t = await getTranslations("metrics");

	return (
		<SectionWrapper id="metrics" dark hatch>
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-16 -mx-6 grid grid-cols-2 border-t border-grid-line md:grid-cols-4">
				{metricKeys.map((key) => (
					<div key={key} className="border-b border-grid-line p-6 md:border-r md:p-8 md:[&:nth-child(4n)]:border-r-0">
						<Stat className="text-foreground">{t(`${key}.value`)}</Stat>
						<Small className="mt-3 block">{t(`${key}.label`)}</Small>
					</div>
				))}
			</StaggerChildren>
			<MiniChart
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
				}}
			/>
		</SectionWrapper>
	);
}
