"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import "./results-tiles.css";

export type ResultKind =
	| "lighthouse"
	| "projects"
	| "raised"
	| "users"
	| "weeks";

export interface ResultItem {
	kind: ResultKind;
	label: string;
	value: string;
}

export interface ResultThumb {
	alt: string;
	src: string;
}

/** One real site that went live in three weeks: its first screen and address. */
export interface ResultLaunch {
	host: string;
	src: string;
}

const index = (i: number) => ({ "--i": i }) as CSSProperties;

// The small product cards inside each tile are light, like the screens they show.
const card =
	"rounded-[12px] bg-white text-[#0e1217] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(14,18,23,0.08)]";

// Google's pass green, as its tools print a good value.
const GOOGLE_PASS = "#188038";

// What Lighthouse 12.8 measured on www.webvise.io, desktop, on 12 Nov 2026:
// the median of five runs. The performance score itself comes in as the
// tile's own figure. The four tones are Search Console's report tiles.
const CATEGORIES: { label: string; score?: string; tone: string }[] = [
	{ label: "Performance", tone: "#4285f4" },
	{ label: "Accessibility", score: "97", tone: "#5e35b1" },
	{ label: "Best Practices", score: "100", tone: "#00897b" },
	{ label: "SEO", score: "100", tone: "#e8710a" },
];
const METRICS: { name: string; value: string }[] = [
	{ name: "First Contentful Paint", value: "0.3 s" },
	{ name: "Largest Contentful Paint", value: "0.6 s" },
	{ name: "Total Blocking Time", value: "0 ms" },
	{ name: "Cumulative Layout Shift", value: "0" },
	{ name: "Speed Index", value: "0.5 s" },
];

/** The measurement in the look of Google's Search Console: the bar with the
 * address, the filter chips, the four coloured report tiles, then the table
 * of metrics. A phone shows it down to the tiles; from a tablet up the table
 * follows and the panel fills its stage. */
function LighthousePicture({ value }: { value: string }) {
	return (
		<div
			className={cn(
				card,
				"@container flex w-full flex-col overflow-hidden text-[#202124]"
			)}
		>
			<div className="flex items-center gap-2.5 border-[#dadce0] border-b px-3 py-2">
				<span className="flex flex-none flex-col gap-[3px]">
					<i className="h-[1.5px] w-3.5 bg-[#5f6368]" />
					<i className="h-[1.5px] w-3.5 bg-[#5f6368]" />
					<i className="h-[1.5px] w-3.5 bg-[#5f6368]" />
				</span>
				<span className="flex-none text-[#5f6368] text-sm">Lighthouse</span>
				<span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-[#f1f3f4] px-2 py-1 text-[#5f6368] text-[0.6875rem]">
					<svg
						aria-hidden="true"
						className="size-3 flex-none"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="1.4"
						viewBox="0 0 12 12"
					>
						<circle cx="5.2" cy="5.2" r="3.4" />
						<path d="m7.8 7.8 2.6 2.6" />
					</svg>
					<span className="truncate">https://www.webvise.io/</span>
				</span>
				<span className="grid size-5 flex-none place-items-center rounded-full bg-[#1a73e8] font-medium text-[0.625rem] text-white leading-none">
					w
				</span>
			</div>
			<div className="flex items-center gap-1.5 px-3 pt-2.5 text-[0.6875rem] leading-none">
				<span className="rounded-full border border-[#dadce0] px-2 py-1">
					Device: Desktop
				</span>
				<span className="rounded-full border border-[#dadce0] px-2 py-1">
					Date: 12 Nov 2026
				</span>
				<span className="ml-auto @[24rem]:block hidden text-[#5f6368]">
					Lighthouse 12.8
				</span>
			</div>
			<ul className="mx-3 mt-2.5 mb-3 grid grid-cols-4 overflow-hidden rounded-lg md:mb-0">
				{CATEGORIES.map((category, i) => (
					<li
						className="rt-fade flex flex-col gap-1.5 @[24rem]:px-2 px-1.5 py-2 text-white"
						key={category.label}
						style={{ ...index(i * 3), backgroundColor: category.tone }}
					>
						<span className="flex min-h-[1.375rem] items-start gap-1 @[24rem]:text-[0.625rem] text-[0.5625rem] leading-[1.2]">
							<svg
								aria-hidden="true"
								className="mt-px @[24rem]:block hidden size-2.5 flex-none"
								viewBox="0 0 12 12"
							>
								<rect fill="#fff" height="12" rx="2" width="12" />
								<path
									d="M3 6.2 5.1 8.3 9 4"
									fill="none"
									stroke={category.tone}
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.6"
								/>
							</svg>
							{category.label}
						</span>
						<span className="@[24rem]:text-2xl text-xl tabular-nums leading-none">
							{category.score ?? value}
						</span>
					</li>
				))}
			</ul>
			<div className="hidden flex-1 flex-col px-3 pt-1 pb-1.5 md:flex">
				<div className="flex justify-between border-[#dadce0] border-b py-2 font-medium text-[#5f6368] text-[0.6875rem] leading-none">
					<span>Metric</span>
					<span>Value</span>
				</div>
				{METRICS.map((metric, i) => (
					<div
						className="rt-fade flex min-h-7 flex-1 items-center gap-2 border-[#dadce0] border-b text-[0.8125rem] last:border-b-0"
						key={metric.name}
						style={index(8 + i * 3)}
					>
						<span
							className="size-2 flex-none rounded-full"
							style={{ backgroundColor: GOOGLE_PASS }}
						/>
						<span className="min-w-0 flex-1 truncate">{metric.name}</span>
						<span
							className="flex-none tabular-nums"
							style={{ color: GOOGLE_PASS }}
						>
							{metric.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

/** A small browser window: its bar, then whatever the page shows. */
function Frame({
	children,
	className,
	style,
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<span
			className={cn(
				"block overflow-hidden rounded-[9px] bg-white shadow-[0_22px_44px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(14,18,23,0.08)]",
				className
			)}
			style={style}
		>
			<span className="flex h-4 items-center gap-1 bg-[#eef0f3] px-2">
				<i className="size-1 rounded-full bg-[#0e1217]/20" />
				<i className="size-1 rounded-full bg-[#0e1217]/20" />
				<i className="size-1 rounded-full bg-[#0e1217]/20" />
			</span>
			<span className="relative block aspect-[16/10]">{children}</span>
		</span>
	);
}

// Five windows, the middle one in front: order, size and dimming by distance.
const FAN = [
	{ dim: 0.5, scale: 0.7, z: 1 },
	{ dim: 0.78, scale: 0.85, z: 2 },
	{ dim: 1, scale: 1, z: 3 },
	{ dim: 0.78, scale: 0.85, z: 2 },
	{ dim: 0.5, scale: 0.7, z: 1 },
];

/** Real project screens as a fan of browser windows. */
function ProjectsPicture({ thumbs }: { thumbs: ResultThumb[] }) {
	// The first project sits in the middle, the next ones to its sides.
	const order = [3, 1, 0, 2, 4].flatMap((i) => (thumbs[i] ? [thumbs[i]] : []));
	return (
		<div className="flex w-[36rem] items-center justify-center">
			{order.map((thumb, i) => {
				const place = FAN[i + Math.floor((FAN.length - order.length) / 2)];
				return (
					<Frame
						className="rt-fade relative -mx-[8%] w-[42%] flex-none"
						key={thumb.src}
						style={{
							...index(Math.abs(i - 2) * 5),
							filter: `brightness(${place?.dim ?? 1})`,
							scale: String(place?.scale ?? 1),
							zIndex: place?.z ?? 1,
						}}
					>
						<Image
							alt={thumb.alt}
							className="object-cover object-left-top"
							fill
							sizes="260px"
							src={thumb.src}
						/>
					</Frame>
				);
			})}
		</div>
	);
}

// Week two's editor: a component's lines, by indent and token. Tags are green,
// keywords and props orange, everything else plain.
const CODE_TONES = {
	key: "bg-brand",
	tag: "bg-[#6fd3a1]",
	text: "bg-white/45",
} as const;
const CODE: {
	id: string;
	indent: number;
	parts: [keyof typeof CODE_TONES, number][];
}[] = [
	{
		id: "export",
		indent: 0,
		parts: [
			["key", 16],
			["text", 30],
		],
	},
	{ id: "return", indent: 6, parts: [["key", 14]] },
	{
		id: "section",
		indent: 12,
		parts: [
			["tag", 22],
			["key", 12],
			["text", 26],
		],
	},
	{
		id: "h1",
		indent: 18,
		parts: [
			["tag", 8],
			["text", 52],
		],
	},
	{
		id: "h1b",
		indent: 18,
		parts: [
			["text", 40],
			["tag", 9],
		],
	},
	{
		id: "p",
		indent: 18,
		parts: [
			["tag", 6],
			["text", 64],
		],
	},
	{
		id: "button",
		indent: 18,
		parts: [
			["tag", 18],
			["key", 14],
			["text", 20],
		],
	},
	{
		id: "image",
		indent: 18,
		parts: [
			["tag", 16],
			["key", 10],
			["text", 34],
		],
	},
	{ id: "close", indent: 12, parts: [["tag", 24]] },
	{ id: "end", indent: 6, parts: [["text", 6]] },
];

/** Three weeks of one real launch: the page as a wireframe, as code in the
 * editor, and live under its own address. */
function WeeksPicture({
	launch,
	steps,
	week,
}: {
	launch: ResultLaunch;
	steps: string[];
	week: string;
}) {
	const states: ReactNode[] = [
		// Design: the layout, before any picture or word is final
		<span className="absolute inset-0 flex bg-white" key="design">
			<span className="flex w-3/5 flex-col justify-center gap-1.5 px-2.5">
				<span className="h-1.5 w-4/5 rounded-full bg-[#0e1217]/30" />
				<span className="h-1.5 w-3/5 rounded-full bg-[#0e1217]/30" />
				<span className="mt-1 h-1 w-full rounded-full bg-[#0e1217]/10" />
				<span className="h-1 w-2/3 rounded-full bg-[#0e1217]/10" />
				<span className="mt-1.5 h-2.5 w-9 rounded-[3px] bg-[#0e1217]/70" />
			</span>
			<span className="rt-hatch m-1.5 flex-1 rounded-[4px]" />
		</span>,
		// Build: the page as code in an editor, its lines coloured by kind
		<span
			className="absolute inset-0 flex gap-1.5 bg-[#0e1217] p-2"
			key="build"
		>
			<span className="flex flex-col gap-[5px] pt-px">
				{CODE.map((line) => (
					<i className="h-[3px] w-1.5 rounded-full bg-white/15" key={line.id} />
				))}
			</span>
			<span className="flex min-w-0 flex-1 flex-col gap-[5px] pt-px">
				{CODE.map((line) => (
					<span
						className="flex gap-1"
						key={line.id}
						style={{ paddingLeft: line.indent }}
					>
						{line.parts.map(([tone, width]) => (
							<i
								className={cn("h-[3px] rounded-full", CODE_TONES[tone])}
								key={`${tone}-${width}`}
								style={{ width }}
							/>
						))}
					</span>
				))}
			</span>
		</span>,
		// Live: the same page under its address
		<span className="absolute inset-0" key="live">
			<Image
				alt=""
				className="object-cover object-left-top"
				fill
				sizes="200px"
				src={launch.src}
			/>
			<span className="rt-pop absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[#0e1217] text-[0.5625rem] leading-none shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)]">
				<i className="size-1.5 rounded-full bg-success" />
				{launch.host}
			</span>
		</span>,
	];
	return (
		<div className="flex w-[31rem] flex-col gap-4">
			<div className="grid grid-cols-3 gap-3">
				{states.map((state, i) => (
					<Frame className="rt-fade" key={steps[i]} style={index(i * 9)}>
						{state}
					</Frame>
				))}
			</div>
			<div className="relative h-px bg-foreground/15">
				<span
					className="rt-fill absolute inset-0 bg-foreground/70"
					style={index(0.6)}
				/>
			</div>
			<ol className="grid grid-cols-3 gap-3">
				{steps.map((step, i) => (
					<li
						className="flex items-baseline gap-1.5 text-foreground text-xs"
						key={step}
					>
						<span className="text-foreground/55 tabular-nums">
							{week} {i + 1}
						</span>
						{step}
					</li>
				))}
			</ol>
		</div>
	);
}

/** A sum that grew, on a small chart, with its end marked. */
function RaisedPicture({ value }: { value: string }) {
	return (
		<div className={cn(card, "relative w-[16.5rem] p-4")}>
			<span className="rt-pop absolute top-3 right-3 rounded-full bg-[#0e1217] px-2 py-0.5 text-white text-xs">
				{value}
			</span>
			<div className="relative mt-5 h-[5.25rem]">
				<span className="absolute inset-x-0 top-0 h-px bg-[#0e1217]/[0.07]" />
				<span className="absolute inset-x-0 top-1/3 h-px bg-[#0e1217]/[0.07]" />
				<span className="absolute inset-x-0 top-2/3 h-px bg-[#0e1217]/[0.07]" />
				<span className="absolute inset-x-0 bottom-0 h-px bg-[#0e1217]/[0.14]" />
				<svg
					aria-hidden="true"
					className="absolute inset-0 size-full overflow-visible"
					fill="none"
					preserveAspectRatio="none"
					viewBox="0 0 300 84"
				>
					<path
						className="rt-fade fill-brand/15"
						d="M0 78C40 76 70 68 100 62S160 46 190 36S250 16 296 6V84H0Z"
						style={index(18)}
					/>
					<path
						className="rt-draw stroke-brand"
						d="M0 78C40 76 70 68 100 62S160 46 190 36S250 16 296 6"
						pathLength={1}
						strokeLinecap="round"
						strokeWidth={2.5}
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
				<span className="rt-pop absolute top-[2px] right-0 size-2.5 rounded-full bg-brand shadow-[0_0_0_3px_#fff]" />
			</div>
		</div>
	);
}

const BARS = [18, 24, 22, 31, 38, 36, 47, 55, 61, 72, 84, 100];

/** Reach as a rising count, the latest bar marked. */
function UsersPicture({ value }: { value: string }) {
	return (
		<div className={cn(card, "relative w-[16.5rem] p-4")}>
			<span className="rt-pop absolute top-3 right-3 rounded-full bg-[#0e1217] px-2 py-0.5 text-white text-xs">
				{value}
			</span>
			<div className="mt-5 flex h-[5.25rem] items-end gap-1.5 border-[#0e1217]/[0.14] border-b">
				{BARS.map((height, i) => (
					<span
						className={cn(
							"rt-fade flex-1 rounded-t-[3px]",
							i === BARS.length - 1 ? "bg-brand" : "bg-[#0e1217]/70"
						)}
						key={height}
						style={{ ...index(i * 2), height: `${height}%` }}
					/>
				))}
			</div>
		</div>
	);
}

export default function ResultsTiles({
	items,
	launch,
	steps,
	thumbs,
	week,
}: {
	items: ResultItem[];
	launch: ResultLaunch;
	steps: string[];
	thumbs: ResultThumb[];
	week: string;
}) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = root.current;
		if (!el) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					el.dataset.seen = "true";
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const picture = (item: ResultItem): ReactNode => {
		switch (item.kind) {
			case "lighthouse":
				return <LighthousePicture value={item.value} />;
			case "projects":
				return <ProjectsPicture thumbs={thumbs} />;
			case "weeks":
				return <WeeksPicture launch={launch} steps={steps} week={week} />;
			case "raised":
				return <RaisedPicture value={item.value} />;
			default:
				return <UsersPicture value={item.value} />;
		}
	};
	// The bento: Google's panel stands tall on the left. Beside it the launch
	// and the projects stack wide, the two client figures narrow. A tablet sets
	// two columns; a phone stacks the tiles and lays the two charts flat beside
	// their figures.
	const tile: Record<ResultKind, string> = {
		lighthouse:
			"flex-col md:row-span-2 lg:col-span-9 lg:col-start-1 lg:row-start-1",
		weeks: "flex-col lg:col-span-9 lg:col-start-10 lg:row-start-1",
		projects: "flex-col lg:col-span-9 lg:col-start-10 lg:row-start-2",
		raised:
			"flex-row-reverse md:flex-col lg:col-span-6 lg:col-start-19 lg:row-start-1",
		users:
			"flex-row-reverse md:flex-col lg:col-span-6 lg:col-start-19 lg:row-start-2",
	};
	const stage: Record<ResultKind, string> = {
		lighthouse: "items-stretch p-2.5 md:flex-1 md:p-3.5",
		weeks: "h-32 items-center md:h-40",
		projects: "h-32 items-center md:h-40",
		raised: "h-24 w-[46%] flex-none items-center md:h-40 md:w-auto",
		users: "h-24 w-[46%] flex-none items-center md:h-40 md:w-auto",
	};
	// Each picture is drawn once and scaled to the stage it stands on.
	const scale: Record<ResultKind, string> = {
		lighthouse: "",
		weeks: "scale-[0.56] md:scale-[0.6] xl:scale-[0.8]",
		projects: "scale-[0.62] md:scale-[0.72] lg:scale-[0.6] xl:scale-[0.7]",
		raised: "scale-[0.46] md:scale-100 lg:scale-75 xl:scale-[0.94]",
		users: "scale-[0.46] md:scale-100 lg:scale-75 xl:scale-[0.94]",
	};
	const text: Record<ResultKind, string> = {
		lighthouse: "",
		weeks: "",
		projects: "",
		raised: "min-w-0 flex-1 justify-center md:flex-none md:justify-start",
		users: "min-w-0 flex-1 justify-center md:flex-none md:justify-start",
	};

	return (
		<div
			className="rt mt-10 grid grid-cols-1 gap-3 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-24"
			ref={root}
		>
			{items.map((item) => (
				<div
					className={cn("surface-card flex p-2", tile[item.kind])}
					key={item.kind}
				>
					{/* The picture: the thing the figure counts, drawn in detail */}
					<div
						aria-hidden="true"
						className={cn(
							"rt-stage flex justify-center overflow-hidden rounded-[14px]",
							stage[item.kind]
						)}
						data-kind={item.kind}
					>
						{item.kind === "lighthouse" ? (
							picture(item)
						) : (
							<div className={scale[item.kind]}>{picture(item)}</div>
						)}
					</div>
					<div
						className={cn(
							"flex flex-col px-3 pt-4 pb-3 md:px-4",
							text[item.kind]
						)}
					>
						<div className="whitespace-nowrap font-display text-[1.625rem] text-foreground leading-none xl:text-3xl">
							{item.value}
						</div>
						<div className="mt-2 text-base text-muted-foreground leading-snug">
							{item.label}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
