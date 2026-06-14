import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { WpHealthPageSpeedPreview } from "@/components/marketing/wp-health-pagespeed-preview";
import { Button } from "@/components/ui/button";
import { H2, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const [t, previewT] = await Promise.all([
		getTranslations("wpHealthReport.cta"),
		getTranslations("wpHealthReport.preview"),
	]);

	return (
		<SectionWrapper hideOnMobile id="wp-health" surface="inverted">
			<div className="grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
				<div className="max-w-[560px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-5">{t("description")}</Lead>
					<TrackClick
						event="cta_clicked"
						properties={{
							destination: "wp-health-report",
							location: "wp-health-cta",
							variant: "analyzer",
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

				<WpHealthPageSpeedPreview
					className="self-center"
					hint={previewT("hint")}
				/>
			</div>
		</SectionWrapper>
	);
}
