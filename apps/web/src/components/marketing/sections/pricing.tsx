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
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<StaggerChildren className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{tiers.map(({ key, featureCount, hasBadge }) => {
					const featureKeys = Array.from({ length: featureCount }, (_, i) =>
						String(i),
					);

					return (
						<div
							key={key}
							className="flex flex-col justify-between border-border/40 not-last:border-b p-6 md:not-last:border-r md:not-last:border-b-0 md:p-8"
						>
							<div>
								<div className="flex items-center gap-3">
									<h3 className="font-medium text-lg">
										{t(`tiers.${key}.name`)}
									</h3>
									{hasBadge && (
										<span className="border border-brand bg-brand px-2 py-0.5 text-white text-xs">
											{t(`tiers.${key}.badge`)}
										</span>
									)}
								</div>
								<p className="mt-2 font-light text-muted-foreground text-sm">
									{t(`tiers.${key}.description`)}
								</p>
								<ul className="mt-6 space-y-3">
									{featureKeys.map((i) => (
										<li
											key={i}
											className="border-border/40 border-b pb-3 font-light text-sm last:border-b-0 last:pb-0"
										>
											{t(`tiers.${key}.features.${i}`)}
										</li>
									))}
								</ul>
							</div>
							<div className="mt-8">
								<p className="font-normal text-2xl tracking-tight">
									{t(`tiers.${key}.price`)}
								</p>
								<p className="mt-1 font-light text-muted-foreground text-xs">
									{t(`tiers.${key}.basis`)}
								</p>
								<Button
									size="sm"
									className="mt-4 w-full"
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
