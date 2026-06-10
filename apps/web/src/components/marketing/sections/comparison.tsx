import { getTranslations } from "next-intl/server";

import { MarketingTag } from "@/components/marketing/marketing-tag";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";

const options = [
	{ key: "webvise", highlight: true },
	{ key: "inhouse", highlight: false },
	{ key: "agency", highlight: false },
];

const attrKeys = ["time", "cost", "ownership", "risk"];

export default async function Comparison() {
	const t = await getTranslations("comparison");

	return (
		<SectionWrapper id="comparison" surface="alternate">
			<div className="max-w-[640px]">
				<H2 className="text-balance">
					{t.rich("title", {
						brand: (chunks) => (
							<span className="text-brand-readable">{chunks}</span>
						),
					})}
				</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-10 grid items-stretch gap-5 md:mt-16 md:grid-cols-3">
				{options.map(({ key, highlight }) => (
					<div
						className="surface-card relative flex flex-col p-6 md:p-8"
						key={key}
					>
						<div className="flex items-center gap-3">
							<H3 className="text-xl">{t(`options.${key}.name`)}</H3>
							{highlight && (
								<MarketingTag variant="brand">
									{t(`options.${key}.badge`)}
								</MarketingTag>
							)}
						</div>
						<Muted className="mt-3">{t(`options.${key}.description`)}</Muted>
						<ul className="mt-8 space-y-4">
							{attrKeys.map((attr) => (
								<li
									className="border-border/60 border-b pb-4 last:border-b-0 last:pb-0"
									key={attr}
								>
									<Caption>{t(`attrs.${attr}`)}</Caption>
									<p
										className={`mt-1 text-sm leading-normal ${
											highlight
												? "font-medium text-foreground"
												: "text-muted-foreground"
										}`}
									>
										{t(`options.${key}.${attr}`)}
									</p>
								</li>
							))}
						</ul>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
