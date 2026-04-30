import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	Caption,
	H2,
	H3,
	Label,
	Lead,
	Muted,
} from "@/components/ui/typography";

const options = [
	{ key: "webvise", highlight: true },
	{ key: "inhouse", highlight: false },
	{ key: "agency", highlight: false },
];

const attrKeys = ["time", "cost", "ownership", "risk"];

export default async function Comparison() {
	const t = await getTranslations("comparison");

	return (
		<SectionWrapper alternate id="comparison">
			<div className="max-w-[640px]">
				<H2 className="text-balance">
					{t.rich("title", {
						brand: (chunks) => <span className="text-brand">{chunks}</span>,
					})}
				</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="-mx-6 mt-16 grid items-stretch border-grid-line border-t md:grid-cols-3">
				{options.map(({ key, highlight }) => (
					<div
						className={`relative flex flex-col border-grid-line border-b p-6 md:border-r md:p-8 md:[&:nth-child(3n)]:border-r-0 ${
							highlight ? "bg-muted/30" : ""
						}`}
						key={key}
					>
						{highlight && (
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-brand"
							/>
						)}
						<div className="flex items-center gap-3">
							<H3 className="text-xl">{t(`options.${key}.name`)}</H3>
							{highlight && (
								<Label className="border border-brand bg-brand px-2 py-0.5 text-[10px] text-white">
									{t(`options.${key}.badge`)}
								</Label>
							)}
						</div>
						<Muted className="mt-3">{t(`options.${key}.description`)}</Muted>
						<ul className="mt-8 space-y-4">
							{attrKeys.map((attr) => (
								<li
									className="border-grid-line border-b pb-4 last:border-b-0 last:pb-0"
									key={attr}
								>
									<Caption>{t(`attrs.${attr}`)}</Caption>
									<p
										className={`mt-1 text-sm leading-[1.5] ${
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
