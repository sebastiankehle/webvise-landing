import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { solutions } from "@/data/solutions";
import { Link } from "@/i18n/navigation";

export default async function WorkflowSystems() {
	const t = await getTranslations("homepageSystems");
	const ts = await getTranslations("solutions.items");

	return (
		<SectionWrapper id="solutions">
			<div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
				<div>
					<Caption className="mb-4 block">{t("eyebrow")}</Caption>
					<H2>{t("title")}</H2>
				</div>
				<Lead className="max-w-[620px] md:pt-8">{t("intro")}</Lead>
			</div>

			<StaggerChildren className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-2 lg:grid-cols-3">
				{solutions.map((solution) => (
					<Link
						className="group flex min-h-[300px] flex-col justify-between border-grid-line border-b p-6 transition-colors hover:bg-muted/30 md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
						href={{
							pathname: "/solutions/[slug]",
							params: { slug: solution.slug },
						}}
						key={solution.slug}
					>
						<div>
							<solution.icon
								className="h-5 w-5 text-brand-icon"
								strokeWidth={1.5}
							/>
							<H3 className="mt-5 transition-colors group-hover:text-brand-readable">
								{ts(`${solution.translationKey}.title`)}
							</H3>
							<Muted className="mt-4 leading-relaxed">
								{ts(`${solution.translationKey}.description`)}
							</Muted>
						</div>
						<div className="mt-8 flex flex-wrap gap-2">
							{Array.from({ length: 3 }, (_, i) => (
								<Caption
									className="border border-border/40 px-2.5 py-1"
									key={ts(`${solution.translationKey}.examples.${i}`)}
								>
									{ts(`${solution.translationKey}.examples.${i}`)}
								</Caption>
							))}
						</div>
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
