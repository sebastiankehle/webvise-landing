"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import HyyveBeam from "@/components/marketing/home/scenes/hyyve-beam";
import {
	CellsFigure,
	RetrievalFigure,
	SourceFigure,
} from "@/components/marketing/home/scenes/hyyve-figures";
import HyyveOrbit from "@/components/marketing/home/scenes/project-hyyve";
import KernspanDamper from "@/components/marketing/home/scenes/project-kernspan";
import type { ProjectSceneSlug } from "@/components/marketing/home/scenes/project-scene-slugs";
import WhenNear from "@/components/marketing/home/scenes/when-near";
import { SceneLayer, ScenePlayer } from "@/components/marketing/scene-player";
import { versioned } from "@/data/asset-version";
import { cn } from "@/lib/utils";

type Locale = "de" | "en";

const AutomateScene = dynamic(
	() => import("@/components/marketing/home/scenes/automate-scene"),
	{ ssr: false }
);
const FzScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-fz"),
	{ ssr: false }
);
const VpScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-vp"),
	{ ssr: false }
);
const KeelScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-keel"),
	{ ssr: false }
);
const HeroScene = dynamic(
	() => import("@/components/marketing/home/scenes/hero-scene"),
	{ ssr: false }
);
const LaunchScene = dynamic(
	() => import("@/components/marketing/home/scenes/launch-scene"),
	{ ssr: false }
);
const MpbScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-mpb"),
	{ ssr: false }
);
const OperateScene = dynamic(
	() => import("@/components/marketing/home/scenes/operate-scene"),
	{ ssr: false }
);
const OwlScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-owl"),
	{ ssr: false }
);
const RbScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-rb"),
	{ ssr: false }
);
const ScScene = dynamic(
	() => import("@/components/marketing/home/scenes/project-sc"),
	{ ssr: false }
);
const FzSummaryScene = dynamic(
	() => import("@/components/marketing/home/scenes/case-fz-summary"),
	{ ssr: false }
);
const TakeoffScene = dynamic(
	() => import("@/components/marketing/home/scenes/case-mpb-takeoff"),
	{ ssr: false }
);
const VaultScene = dynamic(
	() => import("@/components/marketing/home/scenes/case-rb-vault"),
	{ ssr: false }
);
const HyyveStepsScene = dynamic(
	() => import("@/components/marketing/home/scenes/case-hyyve-steps"),
	{ ssr: false }
);

/** What the page knows about the project, for the lines under the tiles. */
interface Facts {
	imageAlts?: string[];
	images?: string[];
	metrics?: { label: string; value: string }[];
	results?: string[];
}

/** One tile: a live scene, one of the project's own screens (`image`, an
 * index into its pictures, or a picture's file name without its locale
 * suffix) or a metric drawn as a ring (`ring`, an index into its metrics).
 * `line` is the result or metric the tile stands for. `frame` replaces the
 * shape's classes, for a scene with its own shapes. A scene has a `name` (a
 * key of scenes.names) and pause and restart buttons, unless `controls` is
 * false (it holds still or ends within 5 s) or puts them elsewhere;
 * `interactive` scenes name
 * their picture themselves; `stills` are what the server sends until the
 * scene loads, and all there is without JavaScript. */
interface Tile {
	controls?: string | false;
	frame?: string;
	id: string;
	image?: number | string;
	interactive?: true;
	line?: (facts: Facts) => string | undefined;
	name?: string;
	render?: (locale: Locale, facts: Facts) => ReactNode;
	ring?: number;
	shape: "film" | "full" | "tall" | "wide";
	/** For a screen whose crop has to be chosen: the sheet's top, its shape
	 * and where the screen sits in it. */
	sheet?: { aspect: number; position: string; top: string };
	stills?: (locale: Locale) => { compact: string; wide: string };
}

const result = (index: number) => (facts: Facts) => facts.results?.[index];

const PICTURE_SUFFIX = /(-de)?\.webp$/;

/** Where a tile's picture sits in the project's pictures. */
function pictureIndex(tile: Tile, images: string[] | undefined) {
	if (typeof tile.image !== "string") {
		return tile.image;
	}
	const name = tile.image;
	const index = images?.findIndex(
		(src) =>
			src.split("?")[0].split("/").at(-1)?.replace(PICTURE_SUFFIX, "") === name
	);
	return index === undefined || index < 0 ? undefined : index;
}
const metric = (index: number) => (facts: Facts) => {
	const entry = facts.metrics?.[index];
	return entry ? `${entry.value} ${entry.label}` : undefined;
};

const tiles: Record<ProjectSceneSlug, Tile[]> = {
	finanzierungszertifikat: [
		{
			id: "form",
			shape: "wide",
			line: result(1),
			name: "fz",
			render: () => <FzScene />,
		},
		{
			id: "admin",
			shape: "tall",
			line: result(3),
			name: "operate",
			render: () => <OperateScene />,
		},
		{
			id: "summary",
			shape: "wide",
			line: result(2),
			name: "summary",
			render: () => <FzSummaryScene />,
		},
		{ id: "certificate", shape: "tall", line: result(4), image: 1 },
	],
	hyyve: [
		{
			id: "orbit",
			shape: "wide",
			name: "hyyveOrbit",
			render: () => <HyyveOrbit />,
		},
		{
			id: "beam",
			shape: "tall",
			line: metric(3),
			name: "hyyveBeam",
			render: () => <HyyveBeam />,
		},
		{
			id: "steps",
			shape: "wide",
			line: metric(1),
			name: "steps",
			render: () => <HyyveStepsScene />,
		},
		{ id: "screen", shape: "tall", image: 2 },
	],
	keel: [
		{
			id: "calls",
			shape: "wide",
			line: metric(3),
			name: "keel",
			render: () => <KeelScene />,
		},
		{ id: "guard", shape: "tall", line: metric(2), image: 0 },
	],
	kernspan: [
		{
			id: "film",
			interactive: true,
			shape: "film",
			line: metric(1),
			name: "kernspan",
			render: (locale) => (
				<KernspanDamper
					label={
						locale === "de"
							? "Position in der Zerlegung"
							: "Position in the sequence"
					}
					rail
					sizes="(min-width: 768px) 55vw, 100vw"
				/>
			),
		},
		{ id: "first", shape: "wide", line: metric(0), image: 1 },
		{ id: "second", shape: "tall", line: metric(2), image: 2 },
	],
	"maerkische-projekt-bau": [
		// The site's own first screen leads: the house, half drawing, half built.
		{ id: "hero", shape: "full", line: result(0), image: 3 },
		{
			id: "gaeb",
			shape: "wide",
			line: result(4),
			name: "mpb",
			render: () => <MpbScene />,
		},
		{
			id: "assistant",
			shape: "tall",
			line: result(2),
			name: "automate",
			render: () => <AutomateScene />,
		},
		{
			id: "takeoff",
			shape: "wide",
			line: result(5),
			name: "takeoff",
			render: () => <TakeoffScene />,
		},
		{ id: "site", shape: "tall", line: result(1), image: 1 },
	],
	morrow: [
		{ id: "first", shape: "wide", image: 0 },
		{ id: "second", shape: "tall", image: 1 },
	],
	"old-world-labs": [
		{
			id: "languages",
			shape: "wide",
			line: metric(1),
			name: "owl",
			render: () => <OwlScene />,
		},
		{
			id: "launch",
			shape: "tall",
			line: metric(2),
			name: "launch",
			render: (locale) => <LaunchScene locale={locale} />,
		},
		{ id: "score", shape: "wide", ring: 0 },
		{ id: "site", shape: "tall", image: 0 },
	],
	"rautenberg-pitch-engine": [
		{
			id: "session",
			shape: "wide",
			line: result(2),
			name: "rb",
			render: (locale) => <RbScene locale={locale} />,
		},
		{
			// A still: nothing moves
			controls: false,
			id: "vault",
			shape: "tall",
			line: result(0),
			name: "vault",
			render: (_locale, facts) => (
				<VaultScene
					facts={[metric(2)(facts), metric(1)(facts)].filter(
						(fact): fact is string => Boolean(fact)
					)}
				/>
			),
		},
	],
	relay: [
		{ id: "first", shape: "wide", image: 0 },
		{ id: "second", shape: "tall", image: 1 },
	],
	screencurve: [
		{
			id: "ask",
			shape: "full",
			// The scene's phone design runs until the wide one is readable
			// (1000px); a hairline keeps the dark scene's edge on a dark page
			frame:
				"aspect-[358/376] bg-[#0f1214] @[1000px]:aspect-[1164/592] dark:ring-1 dark:ring-white/10",
			// On the phone design the composer runs along the foot, so the
			// buttons sit over the film still at the top
			controls: "top-3 right-3 @[1000px]:top-auto @[1000px]:bottom-3",
			line: result(1),
			name: "ask",
			render: (locale) => <HeroScene locale={locale} />,
			// The scene's own still (its last frame, as reduced motion shows it),
			// in both designs
			stills: (locale) => {
				const suffix = locale === "de" ? "-de" : "";
				const base = "/images/case-studies/screencurve/ask-the-film-scene";
				return {
					compact: versioned(`${base}-compact${suffix}.webp`),
					wide: versioned(`${base}${suffix}.webp`),
				};
			},
		},
		{
			id: "constellation",
			shape: "wide",
			line: result(2),
			name: "sc",
			render: (locale) => <ScScene locale={locale} />,
		},
		// The Formatbibel from inside the panel's edge past its text column
		// (14–61.7% of the screen's width, so the text keeps 16px and more clear
		// of the tile's edges); the sheet ends between its first chapter and the
		// next heading (69% of its height), so no sentence is cut
		{
			id: "formatbibel",
			shape: "tall",
			line: result(0),
			image: "formatbibel",
			sheet: { aspect: 1.193, position: "35.5% 0%", top: "9%" },
		},
	],
	"von-platen-coaching": [
		{
			// Comes to rest within 5 s
			controls: false,
			id: "scale",
			shape: "wide",
			line: result(5),
			name: "vp",
			render: (locale) => <VpScene locale={locale} />,
		},
		{ id: "topics", shape: "tall", line: result(3), image: 1 },
		{ id: "method", shape: "wide", line: result(2), image: 0 },
		{ id: "contact", shape: "tall", line: result(4), image: 2 },
	],
};

const frame =
	"relative overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]";

const shapes: Record<Tile["shape"], string> = {
	film: "aspect-[4/3] bg-[#1f262d] @[600px]:aspect-[2/1]",
	full: "aspect-[358/268] bg-[#0f1214] @[600px]:aspect-[1164/592]",
	// No min-height here: with an aspect ratio it turns into a min-width
	// (340px tall is 453px wide at 4:3) and pushes the tile off a phone screen
	tall: "aspect-[4/3]",
	wide: "aspect-[16/10]",
};

const hyyveFigures = [SourceFigure, CellsFigure, RetrievalFigure];

// Lighthouse's own gauge: radius 56 in a 120 box, its pass green.
const RING = 2 * Math.PI * 56;
const LIGHTHOUSE_PASS = "#0cce6b";
const LIGHTHOUSE_ROWS = [
	["First Contentful Paint", 34],
	["Largest Contentful Paint", 42],
	["Total Blocking Time", 28],
	["Cumulative Layout Shift", 24],
	["Speed Index", 36],
] as const;

/** A Lighthouse score the way the report shows it: the green gauge, the
 * report's legend, and its metric rows. Only the score is a figure. The rows
 * name what the report measures and carry no values of their own. */
function MetricRing({ label, value }: { label: string; value: string }) {
	const share = Math.min(Number.parseFloat(value) || 0, 100) / 100;
	return (
		<div className="absolute inset-0 grid place-items-center p-5 md:p-8">
			<div className="flex w-full max-w-[540px] items-center gap-8 rounded-[14px] bg-card p-6 shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_28px_56px_-36px_rgba(14,18,23,0.4)] md:p-7 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
				<div className="mx-auto flex flex-none flex-col items-center gap-3">
					<div className="relative grid size-32 place-items-center">
						<svg
							aria-hidden="true"
							className="absolute inset-0 size-full -rotate-90"
							viewBox="0 0 120 120"
						>
							<circle
								cx="60"
								cy="60"
								fill={LIGHTHOUSE_PASS}
								fillOpacity="0.1"
								r="56"
							/>
							<circle
								cx="60"
								cy="60"
								fill="none"
								r="56"
								stroke={LIGHTHOUSE_PASS}
								strokeDasharray={`${RING * share} ${RING}`}
								strokeLinecap="round"
								strokeWidth="8"
							/>
						</svg>
						<span className="font-display text-4xl text-[#018642] tabular-nums leading-none tracking-[-0.03em] dark:text-[#0cce6b]">
							{value}
						</span>
					</div>
					<span className="text-foreground text-sm">{label}</span>
					<ul
						aria-hidden="true"
						className="flex items-center gap-3 font-mono text-[0.6875rem] text-muted-foreground"
					>
						<li className="flex items-center gap-1">
							<span className="size-0 border-x-[4px] border-x-transparent border-b-[#ff4e42] border-b-[7px]" />
							0–49
						</li>
						<li className="flex items-center gap-1">
							<span className="size-2 bg-[#ffa400]" />
							50–89
						</li>
						<li className="flex items-center gap-1">
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: LIGHTHOUSE_PASS }}
							/>
							90–100
						</li>
					</ul>
				</div>
				<ul
					aria-hidden="true"
					className="hidden min-w-0 flex-1 divide-y divide-foreground/[0.07] lg:block"
				>
					{LIGHTHOUSE_ROWS.map(([name, width]) => (
						<li
							className="flex items-center gap-2.5 py-2.5 text-foreground/80 text-sm"
							key={name}
						>
							<span
								className="size-2 flex-none rounded-full"
								style={{ backgroundColor: LIGHTHOUSE_PASS }}
							/>
							<span className="min-w-0 flex-1 truncate">{name}</span>
							<span
								className="h-2 flex-none rounded-full"
								style={{ backgroundColor: `${LIGHTHOUSE_PASS}40`, width }}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

function Line({ children }: { children?: string }) {
	return children ? (
		<figcaption className="mt-3 text-muted-foreground text-sm leading-5">
			{children}
		</figcaption>
	) : null;
}

/** Tiles two to a row. A full-width tile stands alone; the pairs swap sides
 * from row to row, so the page reads in a zigzag. */
function rows(list: Tile[]): Tile[][] {
	const out: Tile[][] = [];
	let pair: Tile[] = [];
	for (const tile of list) {
		if (tile.shape === "full" || tile.shape === "film") {
			out.push([tile]);
			continue;
		}
		pair.push(tile);
		if (pair.length === 2) {
			out.push(pair);
			pair = [];
		}
	}
	if (pair.length > 0) {
		out.push(pair);
	}
	return out;
}

/** A live scene in its tile: named for screen readers, with its pause and
 * restart buttons, and its stills until it loads. A scene with controls of
 * its own (the Kernspan rail) names its picture itself, so they stay
 * reachable. */
function SceneTile({
	facts,
	locale,
	tile,
}: {
	facts: Facts;
	locale: Locale;
	tile: Tile;
}) {
	const names = useTranslations("scenes.names");
	const label = tile.name ? names(tile.name) : undefined;
	const stills = tile.stills?.(locale);
	const body = (
		<>
			{stills && (
				<div className="absolute inset-0 group-has-[.ss-stage]/scene:hidden">
					<Image
						alt=""
						className="@[1000px]:hidden object-cover"
						fill
						sizes="100vw"
						src={stills.compact}
					/>
					<Image
						alt=""
						className="@[1000px]:block hidden object-cover"
						fill
						sizes="(min-width: 1280px) 1180px, 100vw"
						src={stills.wide}
					/>
				</div>
			)}
			<SceneLayer>
				<WhenNear>{tile.render?.(locale, facts)}</WhenNear>
			</SceneLayer>
		</>
	);
	return (
		<ScenePlayer className="absolute inset-0" controls={tile.controls}>
			{tile.interactive ? (
				<div className="group/scene absolute inset-0">{body}</div>
			) : (
				<div
					aria-label={label}
					className="group/scene absolute inset-0"
					role="img"
				>
					{body}
				</div>
			)}
		</ScenePlayer>
	);
}

/** The project in tiles: its live scenes, some of its own screens and a
 * score, each with the line of the case study it stands for. */
export default function CaseStudyScenes({
	alt,
	imageAlts,
	images,
	metrics,
	results,
	slug,
}: Facts & {
	alt: string;
	slug: ProjectSceneSlug;
}) {
	const locale: Locale = useLocale() === "de" ? "de" : "en";
	const facts: Facts = { imageAlts, images, metrics, results };

	const content = (tile: Tile) => {
		if (tile.render) {
			return <SceneTile facts={facts} locale={locale} tile={tile} />;
		}
		const index = pictureIndex(tile, images);
		const picture = index === undefined ? undefined : images?.[index];
		const pictureAlt =
			(index === undefined ? undefined : imageAlts?.[index]) ?? alt;
		if (picture && tile.shape === "full") {
			// A whole screen of the project, shown whole
			return (
				<Image
					alt={pictureAlt}
					className="object-cover object-top"
					fill
					sizes="(min-width: 1280px) 1180px, 100vw"
					src={picture}
				/>
			);
		}
		if (picture) {
			// One of the project's own screens, set like the scenes: a framed
			// sheet pinned top-left that runs off the right and the bottom
			return (
				<div
					className="absolute top-[9%] left-[7%] aspect-[16/10] w-[118%] overflow-hidden rounded-[10px] bg-card shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_24px_48px_-24px_rgba(14,18,23,0.4)]"
					style={
						tile.sheet && {
							aspectRatio: tile.sheet.aspect,
							top: tile.sheet.top,
						}
					}
				>
					<Image
						alt={pictureAlt}
						className="object-cover object-left-top"
						fill
						sizes="(min-width: 768px) 55vw, 120vw"
						src={picture}
						style={tile.sheet && { objectPosition: tile.sheet.position }}
					/>
				</div>
			);
		}
		const score = tile.ring === undefined ? undefined : metrics?.[tile.ring];
		return score ? (
			<MetricRing label={score.label} value={score.value} />
		) : null;
	};

	let pairs = 0;
	return (
		<div className="mt-12 grid grid-cols-1 gap-y-8 md:mt-16">
			{rows(tiles[slug]).map((row) => {
				const lone = row[0].shape === "full" || row[0].shape === "film";
				const flipped = !lone && pairs++ % 2 === 1;
				return (
					<div
						className={cn(
							"grid grid-cols-1 gap-x-5 gap-y-8",
							!lone &&
								(flipped
									? "md:grid-cols-[1.3333fr_1.6fr]"
									: "md:grid-cols-[1.6fr_1.3333fr]")
						)}
						key={row[0].id}
					>
						{row.map((tile) => (
							<figure
								className={cn(
									lone && "@container",
									flipped && tile.shape === "wide" && "md:order-2"
								)}
								key={tile.id}
							>
								<div className={cn(frame, tile.frame ?? shapes[tile.shape])}>
									{content(tile)}
								</div>
								<Line>{tile.line?.(facts)}</Line>
							</figure>
						))}
					</div>
				);
			})}
			{slug === "hyyve" && (
				<div className="grid gap-5 sm:grid-cols-3">
					{hyyveFigures.map((Figure) => (
						<div
							className={cn(
								frame,
								"grid aspect-[16/10] place-items-center bg-[#0b0c0e] [--accent-teal:#42d6c3]"
							)}
							key={Figure.name}
						>
							<Figure className="h-[62%] w-auto" />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
