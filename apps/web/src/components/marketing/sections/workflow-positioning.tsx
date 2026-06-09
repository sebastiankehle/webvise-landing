import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export async function WorkflowProblem() {
	const t = await getTranslations("workflowProblem");

	return (
		<SectionWrapper alternate className="py-20 md:py-28" id="workflow-problem">
			<div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
				<Caption>{t("eyebrow")}</Caption>
				<div className="max-w-[760px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-6 leading-relaxed">{t("body")}</Lead>
				</div>
			</div>
		</SectionWrapper>
	);
}

export async function SeniorDelivery() {
	const t = await getTranslations("seniorDelivery");

	return (
		<SectionWrapper alternate id="senior-delivery">
			<div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
				<div>
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
					<Lead className="mt-6 leading-relaxed">{t("body")}</Lead>
				</div>
				<div className="grid border-grid-line border-t md:grid-cols-2">
					{Array.from({ length: 7 }, (_, i) => (
						<div
							className="border-grid-line border-b p-5 md:border-r md:[&:nth-child(2n)]:border-r-0"
							key={t(`bullets.${i}`)}
						>
							<Muted className="text-foreground leading-relaxed">
								{t(`bullets.${i}`)}
							</Muted>
						</div>
					))}
				</div>
			</div>
		</SectionWrapper>
	);
}

export async function LaunchSupport() {
	const t = await getTranslations("launchSupport");

	return (
		<SectionWrapper dark id="support">
			<div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
				<div>
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
				</div>
				<div>
					<Lead className="leading-relaxed">{t("body")}</Lead>
					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						{Array.from({ length: 4 }, (_, i) => (
							<div
								className="border border-grid-line p-5"
								key={t(`items.${i}.title`)}
							>
								<H3 className="text-xl">{t(`items.${i}.title`)}</H3>
								<Muted className="mt-2 leading-relaxed">
									{t(`items.${i}.description`)}
								</Muted>
							</div>
						))}
					</div>
					<TrackClick
						event="cta_clicked"
						properties={{
							location: "launch_support",
							variant: "primary",
							destination: "contact",
						}}
					>
						<Button
							className="[&]:hover:!bg-brand-hover mt-8 border-transparent bg-brand text-brand-foreground"
							render={<Link href={{ pathname: "/", hash: "contact" }} />}
							size="lg"
						>
							{t("cta")}
							<ArrowRight data-icon="inline-end" />
						</Button>
					</TrackClick>
				</div>
			</div>
		</SectionWrapper>
	);
}
