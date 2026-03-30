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

const COMPARISON_FEATURE_COUNT = 15;

export default async function Pricing() {
	const t = await getTranslations("pricing");

	return (
		<SectionWrapper id="pricing" alternate>
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
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
									<h3 className="font-display text-2xl">
										{t(`tiers.${key}.name`)}
									</h3>
									{hasBadge && (
										<span className="border border-brand bg-brand px-2 py-0.5 text-[10px] text-white uppercase tracking-wider">
											{t(`tiers.${key}.badge`)}
										</span>
									)}
								</div>
								<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
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
								<p className="font-display text-3xl tracking-tight">
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

				{/* Feature comparison table */}
				<div className="mt-14 overflow-x-auto">
					<h3 className="mb-6 font-display text-2xl tracking-tight">
						{t("comparison.title")}
					</h3>
					<table className="w-full border border-border/40 text-sm">
						<thead>
							<tr className="border-border/40 border-b bg-muted/30">
								<th className="px-5 py-3 text-left font-mono text-[10px] text-foreground uppercase tracking-widest">
									Feature
								</th>
								{tiers.map(({ key }) => (
									<th
										key={key}
										className="px-5 py-3 text-center font-mono text-[10px] text-foreground uppercase tracking-widest"
									>
										{t(`tiers.${key}.name`)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from(
								{ length: COMPARISON_FEATURE_COUNT },
								(_, i) => (
									<tr
										key={t(`comparison.features.${i}.name`)}
										className="border-border/40 border-b last:border-0"
									>
										<td className="px-5 py-3 text-muted-foreground">
											{t(`comparison.features.${i}.name`)}
										</td>
										{(["project", "growth", "enterprise"] as const).map(
											(tierKey) => (
												<td
													key={tierKey}
													className="px-5 py-3 text-center"
												>
													{t(`comparison.features.${i}.${tierKey}`) ===
													"true" ? (
														<span className="text-brand">&#10003;</span>
													) : (
														<span className="text-muted-foreground/40">
															&mdash;
														</span>
													)}
												</td>
											),
										)}
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
		</SectionWrapper>
	);
}
