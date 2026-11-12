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

// Lighthouse's own gauge and its pass green, darkened for type on white.
const RADIUS = 52;
const RING = 2 * Math.PI * RADIUS;
const LIGHTHOUSE_PASS = "#0cce6b";
const index = (i: number) => ({ "--i": i }) as CSSProperties;

// The small product cards inside each tile are light, like the screens they show.
const card =
	"rounded-[12px] bg-white text-[#0e1217] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(14,18,23,0.08)]";
const quiet = "text-[#5b6470]";

function Gauge({
	className,
	stroke,
	textClassName,
	value,
}: {
	className: string;
	stroke: number;
	textClassName: string;
	value: string;
}) {
	return (
		<span
			className={cn("relative grid flex-none place-items-center", className)}
		>
			<svg
				aria-hidden="true"
				className="absolute inset-0 size-full -rotate-90"
				viewBox="0 0 120 120"
			>
				<circle
					cx="60"
					cy="60"
					fill={LIGHTHOUSE_PASS}
					fillOpacity="0.12"
					r={RADIUS}
				/>
				<circle
					className="rt-ring"
					cx="60"
					cy="60"
					fill="none"
					r={RADIUS}
					stroke={LIGHTHOUSE_PASS}
					strokeDasharray={RING}
					strokeLinecap="round"
					strokeWidth={stroke}
					style={
						{
							"--from": RING,
							"--to": RING * (1 - Number.parseFloat(value) / 100),
						} as CSSProperties
					}
				/>
			</svg>
			<span
				className={cn(
					"relative font-display text-[#018642] tabular-nums leading-none",
					textClassName
				)}
			>
				{value}
			</span>
		</span>
	);
}

// What Lighthouse 12.8 measured on www.webvise.io, mobile, on 12 Nov 2026.
// The performance score itself comes in as the tile's own figure.
const CATEGORIES: { label: string; score?: string }[] = [
	{ label: "Performance" },
	{ label: "Accessibility", score: "97" },
	{ label: "Best Practices", score: "100" },
	{ label: "SEO", score: "100" },
];
// Lighthouse marks a metric by its range: a green dot passes, an orange
// square needs work. LCP sits in the middle range on a phone.
const METRICS: { good: boolean; name: string; value: string }[] = [
	{ good: true, name: "First Contentful Paint", value: "1.4 s" },
	{ good: false, name: "Largest Contentful Paint", value: "2.9 s" },
	{ good: true, name: "Total Blocking Time", value: "10 ms" },
	{ good: true, name: "Cumulative Layout Shift", value: "0" },
	{ good: true, name: "Speed Index", value: "1.4 s" },
];

/** The Lighthouse report as Chrome prints it: the four category gauges, the
 * large performance gauge with its legend, then the five metrics. A low tile
 * shows the gauges and legend only; the tall tile shows the whole report. */
function LighthousePicture({ value }: { value: string }) {
	return (
		<div className={cn(card, "w-[25rem] px-4 py-3.5 lg:w-[22rem] lg:p-5")}>
			<div
				className={cn("flex items-center justify-between gap-3 text-xs", quiet)}
			>
				<span className="truncate">https://www.webvise.io/</span>
				<span className="flex-none">Mobile</span>
			</div>
			<ul className="mt-3 grid grid-cols-4 gap-1 lg:mt-4">
				{CATEGORIES.map((category, i) => (
					<li
						className="rt-fade flex flex-col items-center gap-1.5 text-center"
						key={category.label}
						style={index(i * 3)}
					>
						<Gauge
							className="size-11"
							stroke={10}
							textClassName="text-sm"
							value={category.score ?? value}
						/>
						<span className="text-[0.625rem] leading-tight">
							{category.label}
						</span>
					</li>
				))}
			</ul>
			<div className="mt-4 hidden flex-col items-center border-[#0e1217]/[0.08] border-t pt-5 lg:flex">
				<Gauge
					className="size-32"
					stroke={8}
					textClassName="text-5xl"
					value={value}
				/>
				<span className="mt-3 text-xl">Performance</span>
			</div>
			{/* The report's own legend: fail, average, pass */}
			<ul
				className={cn(
					"mt-3 flex items-center justify-center gap-4 font-mono text-[0.6875rem]",
					quiet
				)}
			>
				<li className="flex items-center gap-1.5">
					<span className="size-0 border-x-[4px] border-x-transparent border-b-[#ff4e42] border-b-[7px]" />
					0–49
				</li>
				<li className="flex items-center gap-1.5">
					<span className="size-2 bg-[#ffa400]" />
					50–89
				</li>
				<li className="flex items-center gap-1.5">
					<span
						className="size-2 rounded-full"
						style={{ backgroundColor: LIGHTHOUSE_PASS }}
					/>
					90–100
				</li>
			</ul>
			<div className="mt-4 hidden border-[#0e1217]/[0.08] border-t pt-3 lg:block">
				<p className={cn("font-mono text-[0.625rem] tracking-[0.08em]", quiet)}>
					METRICS
				</p>
				<ul className="mt-1.5">
					{METRICS.map((metric, i) => (
						<li
							className="rt-fade flex items-center gap-2.5 border-[#0e1217]/[0.08] border-b py-1.5 text-[0.8125rem] last:border-b-0"
							key={metric.name}
							style={index(8 + i * 3)}
						>
							<span
								className={cn(
									"size-2 flex-none",
									metric.good ? "rounded-full" : "bg-[#ffa400]"
								)}
								style={
									metric.good ? { backgroundColor: LIGHTHOUSE_PASS } : undefined
								}
							/>
							<span className="min-w-0 flex-1 truncate">{metric.name}</span>
							<span
								className={cn(
									"flex-none tabular-nums",
									metric.good ? "text-[#018642]" : "text-[#c33300]"
								)}
							>
								{metric.value}
							</span>
						</li>
					))}
				</ul>
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
		<div className={cn(card, "relative w-[16.5rem] p-4 lg:w-[24rem] lg:p-5")}>
			<span className="rt-pop absolute top-3 right-3 rounded-full bg-[#0e1217] px-2 py-0.5 text-white text-xs">
				{value}
			</span>
			<div className="relative mt-5 h-[5.25rem] lg:h-28">
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
		<div className={cn(card, "relative w-[16.5rem] p-4 lg:w-[24rem] lg:p-5")}>
			<span className="rt-pop absolute top-3 right-3 rounded-full bg-[#0e1217] px-2 py-0.5 text-white text-xs">
				{value}
			</span>
			<div className="mt-5 flex h-[5.25rem] items-end gap-1.5 border-[#0e1217]/[0.14] border-b lg:h-28 lg:gap-2">
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
	// The bento: the Lighthouse report stands tall on the left, the projects
	// and the three-week launch stack beside it, the two client figures share
	// the row below.
	const span: Record<ResultKind, string> = {
		lighthouse: "lg:col-span-5 lg:row-span-2",
		projects: "lg:col-span-7",
		weeks: "lg:col-span-7",
		raised: "lg:col-span-6",
		users: "lg:col-span-6",
	};

	return (
		<div
			className="rt mt-10 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-12"
			ref={root}
		>
			{items.map((item) => (
				<div
					className={cn("surface-card flex flex-col p-2", span[item.kind])}
					key={item.kind}
				>
					{/* The picture: the thing the figure counts, drawn in detail */}
					<div
						aria-hidden="true"
						className={cn(
							"rt-stage flex h-52 items-center justify-center overflow-hidden rounded-[14px] md:h-64",
							item.kind === "lighthouse" && "lg:h-auto lg:flex-1"
						)}
						data-kind={item.kind}
					>
						<div
							className={cn(
								"sm:scale-100",
								item.kind === "weeks" ? "scale-[0.62]" : "scale-[0.78]"
							)}
						>
							{picture(item)}
						</div>
					</div>
					<div className="px-4 pt-5 pb-4 md:px-5">
						<div className="font-display text-3xl text-foreground leading-none md:text-4xl">
							{item.value}
						</div>
						<div className="mt-2.5 text-base text-muted-foreground leading-snug">
							{item.label}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
