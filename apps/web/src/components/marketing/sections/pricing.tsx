import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import {
	Caption,
	H2,
	H3,
	Label,
	Lead,
	Muted,
	Stat,
} from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

const tiers = [
	{ key: "project", featureCount: 5, hasBadge: false },
	{ key: "growth", featureCount: 6, hasBadge: true },
	{ key: "enterprise", featureCount: 7, hasBadge: false },
];

export default async function Pricing() {
	const t = await getTranslations("pricing");

	return (
		<SectionWrapper id="pricing" alternate>
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-16 -mx-6 grid items-stretch border-t border-grid-line md:grid-cols-3">
				{tiers.map(({ key, featureCount, hasBadge }) => {
					const featureKeys = Array.from({ length: featureCount }, (_, i) =>
						String(i),
					);

					return (
						<div
							key={key}
							className={`flex flex-col justify-between border-b border-grid-line p-6 md:border-r md:p-8 md:[&:nth-child(3n)]:border-r-0 ${
								hasBadge ? "bg-muted/20" : ""
							}`}
						>
							<div>
								<div className="flex items-center gap-3">
									<H3 className="text-xl">{t(`tiers.${key}.name`)}</H3>
									{hasBadge && (
										<Label className="border border-brand bg-brand px-2 py-0.5 text-[10px] text-white">
											{t(`tiers.${key}.badge`)}
										</Label>
									)}
								</div>
								<Muted className="mt-3">{t(`tiers.${key}.description`)}</Muted>
								<ul className="mt-8 space-y-3">
									{featureKeys.map((i) => (
										<li
											key={i}
											className="border-grid-line border-b pb-3 text-sm last:border-b-0 last:pb-0"
										>
											{t(`tiers.${key}.features.${i}`)}
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10">
								<Stat className="text-2xl text-foreground md:text-3xl">
									{t(`tiers.${key}.price`)}
								</Stat>
								<Caption className="mt-1 block">
									{t(`tiers.${key}.basis`)}
								</Caption>
								<TrackClick event="cta_clicked" properties={{ location: "pricing", variant: key, destination: "contact" }}>
									<Button
										size="sm"
										className="mt-5 w-full border-transparent bg-brand text-white [&]:hover:bg-brand/80"
										render={<Link href={{ pathname: "/", hash: "contact" }} />}
									>
										{t("cta")}
									</Button>
								</TrackClick>
							</div>
						</div>
					);
				})}
			</StaggerChildren>
		</SectionWrapper>
	);
}
