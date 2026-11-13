import { getTranslations } from "next-intl/server";

import { ActionArrow, actionVariants } from "@/components/marketing/action";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { WpHealthPageSpeedPreview } from "@/components/marketing/wp-health-pagespeed-preview";
import { H2, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** The free report, offered beside what a rebuild did to one site's score. */
export default async function WpHealthCta() {
	const [t, previewT] = await Promise.all([
		getTranslations("wpHealthReport.cta"),
		getTranslations("wpHealthReport.preview"),
	]);

	return (
		<SectionWrapper hideOnMobile id="wp-health">
			<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-center">
				<div className="lg:col-span-5">
					<H2 className="max-w-[16ch]">{t("title")}</H2>
					<Lead className="mt-5 max-w-[46ch]">{t("description")}</Lead>
					<TrackClick
						event="cta_clicked"
						properties={{
							destination: "wp-health-report",
							location: "wp-health-cta",
							variant: "analyzer",
						}}
					>
						<Link
							className={cn(actionVariants(), "mt-8")}
							href="/wp-health-report"
						>
							{t("button")}
							<ActionArrow />
						</Link>
					</TrackClick>
				</div>

				<figure className="rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] lg:col-span-7 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
					<div className="rounded-[14px] bg-foreground/[0.04] px-6 py-10 shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] md:px-8 md:py-12 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
						<WpHealthPageSpeedPreview />
					</div>
					<figcaption className="px-4 pt-4 pb-3 text-muted-foreground text-sm leading-6 md:px-5">
						{previewT("hint")}
					</figcaption>
				</figure>
			</div>
		</SectionWrapper>
	);
}
