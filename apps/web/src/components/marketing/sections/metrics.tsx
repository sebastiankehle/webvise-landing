import { getTranslations } from "next-intl/server";

import MiniChart from "@/components/marketing/mini-chart";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const metricKeys = ["projects", "satisfaction", "launch", "support"];

export default async function Metrics() {
	const t = await getTranslations("metrics");

	return (
		<SectionWrapper id="metrics" alternate>
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<StaggerChildren
				className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border/40 md:grid-cols-4"
			>
				{metricKeys.map((key) => (
					<div
						key={key}
						className="border-border/40 p-6 md:p-8 [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(odd)]:border-r-0 md:[&:nth-child(-n+2)]:border-b-0 md:[&:not(:last-child)]:border-r"
					>
						<p className="font-normal text-3xl tracking-tight md:text-5xl">
							{t(`${key}.value`)}
						</p>
						<p className="mt-3 font-light text-muted-foreground text-sm">
							{t(`${key}.label`)}
						</p>
					</div>
				))}
			</StaggerChildren>
			<MiniChart />
		</SectionWrapper>
	);
}
