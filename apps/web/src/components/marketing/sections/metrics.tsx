import { getTranslations } from "next-intl/server";

import MiniChart from "@/components/marketing/mini-chart";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const metricKeys = ["projects", "satisfaction", "launch", "support"];

export default async function Metrics() {
	const t = await getTranslations("metrics");

	return (
		<SectionWrapper id="metrics" dark>
			<div className="max-w-2xl">
				<h2 className="font-display text-4xl tracking-tight md:text-5xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
			</div>
			<StaggerChildren className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-border md:grid-cols-4">
				{metricKeys.map((key) => (
					<div
						key={key}
						className="border-border nth-[-n+2]:border-b p-6 odd:border-r md:not-last:border-r md:nth-[-n+2]:border-b-0 md:p-10 md:odd:border-r-0"
					>
						<p className="font-display text-4xl tracking-tight md:text-6xl">
							{t(`${key}.value`)}
						</p>
						<p className="mt-3 text-muted-foreground text-sm">
							{t(`${key}.label`)}
						</p>
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
