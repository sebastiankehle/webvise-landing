import { ArrowRight } from "lucide-react";
import Image from "next/image";

import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import { Caption, H3, Muted } from "@/components/ui/typography";
import type { CaseStudy } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CardCaseStudy = Pick<
	CaseStudy,
	| "cardImage"
	| "client"
	| "coverImage"
	| "excerpt"
	| "industry"
	| "metrics"
	| "slug"
	| "title"
>;

/** Website projects whose card shows the site's real first screen. The other
 * projects keep their live scene, so a row mixes photographs and interfaces. */
const SCREEN_FIRST = new Set([
	"finanzierungszertifikat",
	"maerkische-projekt-bau",
	"old-world-labs",
	"von-platen-coaching",
]);

export function screenFirst(
	caseStudy: Pick<CardCaseStudy, "coverImage" | "slug">
) {
	return SCREEN_FIRST.has(caseStudy.slug) && Boolean(caseStudy.coverImage);
}

/** Projects that lead with figures: each has at least one measured result (a
 * score, a load time, hours saved) beside facts about what was delivered.
 * The other projects only count parts of a build ("3 boards designed"),
 * which says nothing as a headline number, so their figures are not shown. */
const MEASURED_FIGURES = new Set([
	"finanzierungszertifikat",
	"maerkische-projekt-bau",
	"old-world-labs",
	"rautenberg-pitch-engine",
]);

export function measuredFigures(
	caseStudy: Pick<CardCaseStudy, "metrics" | "slug">
) {
	return MEASURED_FIGURES.has(caseStudy.slug) ? (caseStudy.metrics ?? []) : [];
}

/** A project as picture, industry, title and excerpt. */
export function CaseStudyCard({
	caseStudy,
	className,
	priority = false,
	sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
}: {
	caseStudy: CardCaseStudy;
	className?: string;
	priority?: boolean;
	sizes?: string;
}) {
	const screen = screenFirst(caseStudy);
	const image = screen
		? (caseStudy.coverImage ?? caseStudy.cardImage)
		: (caseStudy.cardImage ?? caseStudy.coverImage);
	return (
		<Link
			className={cn(
				"surface-card group flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
				className
			)}
			href={{
				pathname: "/case-studies/[slug]",
				params: { slug: caseStudy.slug },
			}}
		>
			{image && (
				<div className="media-frame relative aspect-[16/10] w-full bg-foreground/[0.04]">
					{hasProjectScene(caseStudy.slug) && !screen ? (
						<ProjectScene opening={image} sizes={sizes} slug={caseStudy.slug} />
					) : (
						<Image
							alt={`${caseStudy.client} - ${caseStudy.title}`}
							className="object-cover object-left-top transition-all duration-500 group-hover:brightness-110"
							fill
							priority={priority}
							sizes={sizes}
							src={image}
						/>
					)}
				</div>
			)}
			<div className="flex flex-1 flex-col p-6 md:p-7">
				<Caption className="block text-brand-readable">
					{caseStudy.industry}
				</Caption>
				<H3 className="mt-3">{caseStudy.title}</H3>
				<Muted className="mt-3 line-clamp-4">{caseStudy.excerpt}</Muted>
				<div className="mt-auto flex items-center justify-end pt-6">
					<ArrowRight className="h-4 w-4 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
				</div>
			</div>
		</Link>
	);
}

/** The card of the work overview: text first, the picture set in below. */
export function CaseStudyListCard({
	caseStudy,
	priority = false,
}: {
	caseStudy: CardCaseStudy;
	priority?: boolean;
}) {
	return (
		<Link
			className="surface-card group relative flex min-h-[340px] flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:min-h-0"
			href={{
				pathname: "/case-studies/[slug]",
				params: { slug: caseStudy.slug },
			}}
		>
			<div className="flex items-start justify-between gap-4 p-5 md:p-6 md:pb-4">
				<div className="min-w-0">
					<Caption className="block text-brand-readable">
						{caseStudy.client} &middot; {caseStudy.industry}
					</Caption>
					<H3 className="mt-1.5 line-clamp-2 text-lg leading-snug">
						{caseStudy.title}
					</H3>
					<Muted className="mt-2 line-clamp-2">{caseStudy.excerpt}</Muted>
					{/* Two figures from the project, where it has measured ones */}
					{measuredFigures(caseStudy).length > 0 && (
						<dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
							{measuredFigures(caseStudy)
								.slice(0, 2)
								.map((metric) => (
									<div
										className="flex items-baseline gap-1.5"
										key={metric.label}
									>
										<dd className="font-medium text-foreground">
											{metric.value}
										</dd>
										<dt className="text-muted-foreground">{metric.label}</dt>
									</div>
								))}
						</dl>
					)}
				</div>
				<ArrowRight className="h-4 w-4 shrink-0 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
			</div>
			{caseStudy.coverImage && (
				<div className="relative mt-auto min-h-0 flex-1 pl-5 md:pl-6">
					{hasProjectScene(caseStudy.slug) && !screenFirst(caseStudy) ? (
						<div className="media-frame relative aspect-[16/10] w-full bg-foreground/[0.04]">
							<ProjectScene
								opening={caseStudy.cardImage ?? caseStudy.coverImage}
								sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
								slug={caseStudy.slug}
							/>
						</div>
					) : (
						<div className="media-frame relative h-full min-h-[180px] w-full">
							<Image
								alt={`${caseStudy.client}: ${caseStudy.title}`}
								className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
								fill
								priority={priority}
								sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
								src={caseStudy.coverImage}
							/>
						</div>
					)}
				</div>
			)}
		</Link>
	);
}
