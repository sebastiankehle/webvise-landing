import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";

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
			<div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border/40 md:grid-cols-4">
				{metricKeys.map((key) => (
					<div
						key={key}
						className="border-border/40 p-8 text-center [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-b-0"
					>
						<p className="font-normal text-3xl tracking-tight md:text-4xl">
							{t(`${key}.value`)}
						</p>
						<p className="mt-2 font-light text-muted-foreground text-sm">
							{t(`${key}.label`)}
						</p>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
