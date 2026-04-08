import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Button } from "@/components/ui/button";
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
				<h2 className="font-display text-[24px] leading-[1.1] tracking-[-0.022em] md:text-[32px]">
					{t("title")}
				</h2>
				<p className="mt-5 max-w-[520px] text-[15px] text-muted-foreground leading-[1.6]">
					{t("subtitle")}
				</p>
			</div>
			<StaggerChildren className="mt-14 grid items-stretch gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{tiers.map(({ key, featureCount, hasBadge }) => {
					const featureKeys = Array.from({ length: featureCount }, (_, i) =>
						String(i),
					);

					return (
						<div
							key={key}
							className={`flex flex-col justify-between border-border/40 not-last:border-b p-8 md:not-last:border-r md:not-last:border-b-0 md:p-10 ${
								hasBadge
									? "border-t-2 border-t-brand bg-muted/30 md:-my-4 md:py-14"
									: ""
							}`}
						>
							<div>
								<div className="flex items-center gap-3">
									<h3 className="font-display text-2xl tracking-[-0.02em]">
										{t(`tiers.${key}.name`)}
									</h3>
									{hasBadge && (
										<span className="border border-brand bg-brand px-2 py-0.5 text-[10px] text-white">
											{t(`tiers.${key}.badge`)}
										</span>
									)}
								</div>
								<p className="mt-3 text-muted-foreground text-sm leading-[1.6]">
									{t(`tiers.${key}.description`)}
								</p>
								<ul className="mt-8 space-y-3">
									{featureKeys.map((i) => (
										<li
											key={i}
											className="border-border/40 border-b pb-3 text-sm last:border-b-0 last:pb-0"
										>
											{t(`tiers.${key}.features.${i}`)}
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10">
								<p className="font-display text-3xl tracking-[-0.03em]">
									{t(`tiers.${key}.price`)}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{t(`tiers.${key}.basis`)}
								</p>
								<Button
									size="sm"
									className="mt-5 w-full border-transparent bg-brand text-white [&]:hover:bg-brand/80"
									data-ph-capture-attribute-cta-location="pricing"
									data-ph-capture-attribute-cta-variant={key}
									render={<Link href={{ pathname: "/", hash: "contact" }} />}
								>
									{t("cta")}
								</Button>
							</div>
						</div>
					);
				})}
			</StaggerChildren>
		</SectionWrapper>
	);
}
