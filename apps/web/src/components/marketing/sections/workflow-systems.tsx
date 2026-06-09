import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
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
import { solutions } from "@/data/solutions";
import { Link } from "@/i18n/navigation";

const boardRows = ["Intake", "Review", "Build", "Launch"] as const;

function WorkflowBoard() {
	return (
		<div className="border border-border/40 bg-background/60">
			<div className="grid grid-cols-[1fr_auto] border-border/40 border-b p-4">
				<Small className="text-foreground">workflow map</Small>
				<Caption>live scope</Caption>
			</div>
			<div className="grid sm:grid-cols-4">
				{boardRows.map((row, index) => (
					<div
						className="border-border/40 border-b p-4 sm:border-r sm:border-b-0 sm:last:border-r-0"
						key={row}
					>
						<Caption>0{index + 1}</Caption>
						<Small className="mt-2 block text-foreground">{row}</Small>
						<div className="mt-5 flex flex-col gap-2">
							<span className="h-1.5 w-10 bg-brand" />
							<span className="h-1.5 w-16 bg-muted" />
							<span className="h-1.5 w-12 bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default async function WorkflowSystems() {
	const t = await getTranslations("homepageSystems");
	const ts = await getTranslations("solutions.items");

	return (
		<SectionWrapper id="solutions">
			<div className="grid items-end gap-10 md:grid-cols-2 md:gap-16">
				<div className="max-w-[620px]">
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 leading-relaxed">{t("intro")}</Lead>
				</div>
				<WorkflowBoard />
			</div>

			<StaggerChildren className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-2 lg:grid-cols-3">
				{solutions.map((solution, index) => (
					<Link
						className="group relative flex flex-col border-grid-line border-b p-6 transition-colors hover:bg-muted/20 md:min-h-[280px] md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
						href={{
							pathname: "/solutions/[slug]",
							params: { slug: solution.slug },
						}}
						key={solution.slug}
					>
						<div className="flex items-start justify-between gap-6">
							<solution.icon
								className="h-5 w-5 shrink-0 text-brand-icon"
								strokeWidth={1.5}
							/>
							<Caption>0{index + 1}</Caption>
						</div>
						<H3 className="mt-6 transition-colors group-hover:text-brand-readable">
							{ts(`${solution.translationKey}.title`)}
						</H3>
						<Muted className="mt-4 leading-relaxed">
							{ts(`${solution.translationKey}.description`)}
						</Muted>
						<div className="mt-auto flex flex-wrap gap-2 pt-8">
							{Array.from({ length: 3 }, (_, i) => (
								<Caption
									className="border border-border/40 px-2.5 py-1"
									key={ts(`${solution.translationKey}.examples.${i}`)}
								>
									{ts(`${solution.translationKey}.examples.${i}`)}
								</Caption>
							))}
						</div>
						<ArrowRight className="absolute right-6 bottom-6 h-4 w-4 text-brand-readable opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 md:right-8 md:bottom-8" />
					</Link>
				))}
			</StaggerChildren>

			<div className="mt-12 flex flex-col gap-4 sm:flex-row">
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "workflow_systems",
						variant: "primary",
						destination: "solutions",
					}}
				>
					<Button
						render={<Link href="/solutions" />}
						size="lg"
						variant="outline"
					>
						{t("cta")}
					</Button>
				</TrackClick>
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "workflow_systems",
						variant: "secondary",
						destination: "services",
					}}
				>
					<Button
						render={<Link href={{ pathname: "/", hash: "services" }} />}
						size="lg"
						variant="ghost"
					>
						{t("secondaryCta")}
					</Button>
				</TrackClick>
			</div>
		</SectionWrapper>
	);
}
