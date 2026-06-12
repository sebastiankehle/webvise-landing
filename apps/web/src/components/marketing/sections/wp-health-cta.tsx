import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { WpHealthScorePreview } from "@/components/marketing/wp-health-score-preview";
import { Button } from "@/components/ui/button";
import { H2, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const [t, tw] = await Promise.all([
		getTranslations("wpHealthReport.cta"),
		getTranslations("wpHealthReport"),
	]);

	return (
		<SectionWrapper id="wp-health" surface="inverted">
			<div className="grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
				<div className="max-w-[560px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-5">{t("description")}</Lead>
					<TrackClick
						event="cta_clicked"
						properties={{
							location: "wp-health-cta",
							variant: "analyzer",
							destination: "wp-health-report",
						}}
					>
						<Button
							className="mt-8 px-8"
							render={<Link href="/wp-health-report" />}
							size="lg"
							variant="brand"
						>
							{t("button")}
						</Button>
					</TrackClick>
				</div>

				<WpHealthScorePreview
					afterLabel={tw("results.afterNextjs")}
					className="self-center"
					currentLabel={tw("results.pageSpeed")}
					metricLabels={{
						cumulativeLayoutShift: tw(
							"results.previewMetrics.cumulativeLayoutShift"
						),
						firstContentfulPaint: tw(
							"results.previewMetrics.firstContentfulPaint"
						),
						interactionToNextPaint: tw(
							"results.previewMetrics.interactionToNextPaint"
						),
						largestContentfulPaint: tw(
							"results.previewMetrics.largestContentfulPaint"
						),
					}}
				/>
			</div>
		</SectionWrapper>
	);
}
