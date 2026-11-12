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

export interface ResultScore {
	name: string;
	value: string;
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

/** The report as Lighthouse prints it: this site's score, and the scores of
 * three client sites measured the same way. */
function LighthousePicture({
	scores,
	value,
}: {
	scores: ResultScore[];
	value: string;
}) {
	return (
		<div className={cn(card, "w-[25rem] px-4 py-3.5")}>
			<div className={cn("flex items-center justify-between text-xs", quiet)}>
				<span>Performance</span>
				<span className="font-mono">Lighthouse</span>
			</div>
			<div className="mt-3 flex items-center gap-5">
				<span className="flex flex-col items-center gap-2">
					<Gauge
						className="size-20"
						stroke={9}
						textClassName="text-3xl"
						value={value}
					/>
					<span className="text-xs">webvise.io</span>
				</span>
				<ul className="min-w-0 flex-1">
					{scores.map((score, i) => (
						<li
							className="rt-fade flex items-center justify-between gap-3 border-[#0e1217]/[0.08] border-b py-1 text-sm last:border-b-0"
							key={score.name}
							style={index(i * 4)}
						>
							<span className="min-w-0 truncate">{score.name}</span>
							<Gauge
								className="size-8"
								stroke={12}
								textClassName="text-[0.6875rem]"
								value={score.value}
							/>
						</li>
					))}
				</ul>
			</div>
			{/* The report's own legend: fail, average, pass */}
			<ul
				className={cn(
					"mt-3 flex items-center gap-4 border-[#0e1217]/[0.08] border-t pt-2.5 font-mono text-[0.6875rem]",
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

/** Three weeks of one real launch: the page as a wireframe, half built,
 * and live under its own address. */
function WeeksPicture({
	launch,
	steps,
	week,
}: {
	launch: ResultLaunch;
	steps: string[];
	week: string;
}) {
	const shot = (className?: string) => (
		<Image
			alt=""
			className={cn("object-cover object-left-top", className)}
			fill
			sizes="200px"
			src={launch.src}
		/>
	);
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
		// Build: the real page, not yet released
		<span className="absolute inset-0" key="build">
			{shot("opacity-80 grayscale")}
		</span>,
		// Live: the same page under its address
		<span className="absolute inset-0" key="live">
			{shot()}
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
		<div className={cn(card, "relative w-[15rem] p-4")}>
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
		<div className={cn(card, "relative w-[15rem] p-4")}>
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
	scores,
	steps,
	thumbs,
	week,
}: {
	items: ResultItem[];
	launch: ResultLaunch;
	scores: ResultScore[];
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

	const find = (kind: ResultKind) => items.find((item) => item.kind === kind);
	// What webvise measures itself comes first; what clients went on to reach
	// with the work shares the last card.
	const cards: { figures: (ResultItem | undefined)[]; picture: ReactNode }[] = [
		{
			figures: [find("lighthouse")],
			picture: (
				<LighthousePicture
					scores={scores}
					value={find("lighthouse")?.value ?? ""}
				/>
			),
		},
		{
			figures: [find("projects")],
			picture: <ProjectsPicture thumbs={thumbs} />,
		},
		{
			figures: [find("weeks")],
			picture: <WeeksPicture launch={launch} steps={steps} week={week} />,
		},
		{
			figures: [find("raised"), find("users")],
			picture: (
				<div className="flex gap-4">
					<RaisedPicture value={find("raised")?.value ?? ""} />
					<UsersPicture value={find("users")?.value ?? ""} />
				</div>
			),
		},
	];

	return (
		<div
			className="rt mt-10 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-2"
			ref={root}
		>
			{cards.map((entry, i) => {
				const figures = entry.figures.filter((item) => item !== undefined);
				return (
					<div
						className="surface-card flex flex-col p-2"
						key={figures.map((item) => item.kind).join("-")}
					>
						{/* The picture: the thing the figure counts, drawn in detail */}
						<div
							aria-hidden="true"
							className="rt-stage flex h-52 items-center justify-center overflow-hidden rounded-[14px] md:h-64"
							data-kind={figures[0]?.kind}
						>
							<div
								className={cn(
									"sm:scale-100",
									i < 2 ? "scale-[0.78]" : "scale-[0.62]"
								)}
							>
								{entry.picture}
							</div>
						</div>
						<div
							className={cn(
								"grid gap-x-6 px-4 pt-5 pb-4 md:px-5",
								figures.length > 1 && "grid-cols-2"
							)}
						>
							{figures.map((item) => (
								<div key={item.kind}>
									<div className="font-display text-3xl text-foreground leading-none md:text-4xl">
										{item.value}
									</div>
									<div className="mt-2.5 text-base text-muted-foreground leading-snug">
										{item.label}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
