import Image from "next/image";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H2, Lead, Muted } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const t = await getTranslations("wpHealthReport.cta");

	return (
		<SectionWrapper id="wp-health" surface="alternate">
			<div className="surface-card grid overflow-hidden lg:grid-cols-[1fr_1.05fr]">
				<div className="flex flex-col p-7 md:p-10">
					<Caption className="text-brand-readable">{t("badge")}</Caption>
					<H2 className="mt-4">{t("title")}</H2>
					<Lead className="mt-4 max-w-[480px]">{t("description")}</Lead>

					<div className="mt-10 max-w-[440px] space-y-4">
						<div>
							<div className="mb-2 flex items-baseline justify-between">
								<Caption>{t("scoreLabel")}</Caption>
								<span className="font-display text-base text-brand-readable tabular-nums">
									32
								</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div className="h-full w-[32%] rounded-full bg-brand" />
							</div>
						</div>
						<div>
							<div className="mb-2 flex items-baseline justify-between">
								<Caption>{t("afterNextjsLabel")}</Caption>
								<span className="font-display text-base text-success tabular-nums">
									95
								</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div className="h-full w-[95%] rounded-full bg-success" />
							</div>
						</div>
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-auto lg:pt-10">
						<TrackClick
							event="cta_clicked"
							properties={{
								location: "wp-health-cta",
								variant: "analyzer",
								destination: "wp-health-report",
							}}
						>
							<Button
								className="px-8"
								render={<Link href="/wp-health-report" />}
								size="lg"
								variant="brand"
							>
								{t("button")}
							</Button>
						</TrackClick>
						<Muted className="text-xs">{t("trustLine")}</Muted>
					</div>
				</div>

				<div className="relative overflow-hidden border-border/60 border-t lg:border-t-0 lg:border-l">
					<div className="h-full pt-7 pl-7 md:pt-10 md:pl-10">
						<div className="relative aspect-[1512/766] overflow-hidden rounded-tl-xl">
							<Image
								alt={t("title")}
								className="object-cover object-left-top"
								fill
								sizes="(min-width: 1024px) 48vw, 100vw"
								src="/images/case-studies/webvise/wp-health-report-v3.png"
							/>
						</div>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
