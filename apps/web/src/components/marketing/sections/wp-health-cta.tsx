import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Body, Caption, H2, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

function PreviewScore({
	label,
	score,
	variant,
}: {
	label: string;
	score: number;
	variant: "danger" | "success";
}) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className={`flex h-16 w-16 items-center justify-center rounded-full border-[6px] ${
					variant === "success"
						? "border-success text-success"
						: "border-destructive text-destructive"
				}`}
			>
				<Body className="font-medium text-current text-lg">{score}</Body>
			</div>
			<Caption>{label}</Caption>
		</div>
	);
}

function WpHealthPreview({
	afterNextjs,
	desktop,
	mobile,
	submit,
	url,
	urlPlaceholder,
}: {
	afterNextjs: string;
	desktop: string;
	mobile: string;
	submit: string;
	url: string;
	urlPlaceholder: string;
}) {
	return (
		<div className="surface-card media-frame relative self-start p-6 md:p-8">
			<div className="grid gap-5">
				<div>
					<Caption className="block">{url}</Caption>
					<div className="mt-2 h-9 border border-border/70 bg-card px-3 py-2 text-muted-foreground text-xs">
						{urlPlaceholder}
					</div>
				</div>
				<div className="h-9 bg-brand px-3 py-2 text-center font-medium text-brand-foreground text-xs">
					{submit}
				</div>
			</div>
			<div className="mt-8 border-border/60 border-t pt-8">
				<div className="grid grid-cols-3 gap-4">
					<PreviewScore label={mobile} score={34} variant="danger" />
					<PreviewScore label={desktop} score={41} variant="danger" />
					<PreviewScore label={afterNextjs} score={95} variant="success" />
				</div>
			</div>
		</div>
	);
}

export default async function WpHealthCta() {
	const [t, tw] = await Promise.all([
		getTranslations("wpHealthReport.cta"),
		getTranslations("wpHealthReport"),
	]);

	return (
		<SectionWrapper id="wp-health">
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

				<WpHealthPreview
					afterNextjs={tw("results.afterNextjs")}
					desktop={tw("results.desktop")}
					mobile={tw("results.mobile")}
					submit={t("button")}
					url={tw("form.url")}
					urlPlaceholder={tw("form.urlPlaceholder")}
				/>
			</div>
		</SectionWrapper>
	);
}
