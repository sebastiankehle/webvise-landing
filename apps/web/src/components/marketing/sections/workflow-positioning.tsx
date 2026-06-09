import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import {
	Caption,
	H2,
	H3,
	Lead,
	Muted,
	Small,
} from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

const workflowSignals = ["intake", "approval", "handoff", "follow-up"] as const;

export async function WorkflowProblem() {
	const t = await getTranslations("workflowProblem");

	return (
		<SectionWrapper alternate className="py-20 md:py-28" id="workflow-problem">
			<div className="grid items-start gap-12 md:grid-cols-[1fr_0.8fr] md:gap-20">
				<div className="max-w-[780px]">
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
					<Lead className="mt-6 leading-relaxed">{t("body")}</Lead>
				</div>
				<div className="border border-border/40 bg-background/50">
					<div className="border-border/40 border-b p-4">
						<Small className="text-foreground">operational friction</Small>
					</div>
					<div className="grid grid-cols-2">
						{workflowSignals.map((signal) => (
							<div
								className="border-border/40 border-r border-b p-5 last:border-b-0 even:border-r-0 [&:nth-last-child(2)]:border-b-0"
								key={signal}
							>
								<Caption>{signal}</Caption>
								<div className="mt-4 flex items-center gap-2">
									<span className="h-1.5 w-8 bg-brand" />
									<span className="h-1.5 w-12 bg-muted" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}

export async function SeniorDelivery() {
	const t = await getTranslations("seniorDelivery");

	return (
		<SectionWrapper alternate id="senior-delivery">
			<div className="grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
				<div className="max-w-[560px]">
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
					<Lead className="mt-6 leading-relaxed">{t("body")}</Lead>
				</div>
				<div className="border-grid-line border-t">
					{Array.from({ length: 7 }, (_, i) => (
						<div
							className="grid grid-cols-[auto_1fr] gap-5 border-grid-line border-b py-5"
							key={t(`bullets.${i}`)}
						>
							<Caption>0{i + 1}</Caption>
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
				<div className="max-w-[560px]">
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
					<Lead className="mt-6 leading-relaxed">{t("body")}</Lead>
				</div>
				<div>
					<div className="grid border-grid-line border-t sm:grid-cols-2">
						{Array.from({ length: 4 }, (_, i) => (
							<div
								className="border-grid-line border-b p-5 sm:border-r sm:[&:nth-child(2n)]:border-r-0"
								key={t(`items.${i}.title`)}
							>
								<Caption>0{i + 1}</Caption>
								<H3 className="mt-4 text-xl">{t(`items.${i}.title`)}</H3>
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
