"use client";

import Image from "next/image";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

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

/** A live project: its name, its address and its first screen. */
export interface ResultProject {
	host: string;
	name: string;
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

// Google Calendar's event colours: Peacock, Lavender, Basil.
const EVENT_TONES = ["#039be5", "#7986cb", "#0b8043"];
const WEEKDAYS = [0, 1, 2, 3, 4];

/** Three weeks of one real launch as a calendar month: a week per row, one
 * event across each, and the launch day marked as today. The last event
 * carries the address the site went live under. */
function WeeksPicture({
	days,
	host,
	steps,
	title,
	week,
}: {
	days: string[];
	host: string;
	steps: string[];
	title: string;
	week: string;
}) {
	return (
		<div className={cn(card, "w-[31rem] overflow-hidden text-[#202124]")}>
			<div className="flex items-center gap-2.5 border-[#dadce0] border-b px-3 py-1.5">
				<span className="rounded-full border border-[#dadce0] px-2.5 py-0.5 text-xs">
					Today
				</span>
				<svg
					aria-hidden="true"
					className="h-3 w-7 flex-none text-[#5f6368]"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 28 12"
				>
					<path d="M7 2 3 6l4 4M21 2l4 4-4 4" />
				</svg>
				<span className="text-[0.9375rem]">{title}</span>
				<span className="ml-auto flex items-center gap-1.5 rounded-full border border-[#dadce0] px-2.5 py-0.5 text-xs">
					Month
					<svg
						aria-hidden="true"
						className="size-2 text-[#5f6368]"
						fill="currentColor"
						viewBox="0 0 8 8"
					>
						<path d="M0 2h8L4 7z" />
					</svg>
				</span>
			</div>
			<div className="grid grid-cols-[3.75rem_repeat(5,minmax(0,1fr))] pb-1">
				<span />
				{WEEKDAYS.map((day) => (
					<span
						className="border-[#dadce0] border-l py-1 text-center font-medium text-[#5f6368] text-[0.625rem] leading-none"
						key={day}
					>
						{days[day]}
					</span>
				))}
				{steps.map((step, row) => (
					<div className="col-span-6 grid grid-cols-subgrid" key={step}>
						<span className="border-[#dadce0] border-t px-2 pt-1.5 text-[#5f6368] text-[0.625rem] leading-none">
							{week} {row + 1}
						</span>
						<div className="relative col-span-5 grid h-10 grid-cols-5 border-[#dadce0] border-t">
							{WEEKDAYS.map((day) => {
								const today = row === steps.length - 1 && day === 4;
								return (
									<span
										className="border-[#dadce0] border-l px-1 pt-1 text-[#5f6368] text-[0.625rem] leading-none"
										key={day}
									>
										<span
											className={cn(
												"inline-grid size-3.5 place-items-center",
												today && "rounded-full bg-[#1a73e8] text-white"
											)}
										>
											{row * 7 + day + 1}
										</span>
									</span>
								);
							})}
							<span
								className="rt-fade absolute inset-x-1 bottom-1 flex h-[1.125rem] items-center gap-2 rounded-[4px] px-2 font-medium text-[0.6875rem] text-white leading-none"
								style={{
									...index(row * 8),
									backgroundColor: EVENT_TONES[row % EVENT_TONES.length],
								}}
							>
								{step}
								{row === steps.length - 1 && host && (
									<span className="font-normal opacity-85">{host}</span>
								)}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Chrome's tab strip and toolbar icons, drawn at the size the window uses.
const icon = {
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	strokeWidth: 1.5,
} as const;

/** The live projects as tabs in one Chrome window. The window steps from tab
 * to tab, and the address bar and the page follow. */
function ProjectsPicture({ projects }: { projects: ResultProject[] }) {
	const [active, setActive] = useState(0);

	useEffect(() => {
		if (
			projects.length < 2 ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}
		const timer = window.setInterval(
			() => setActive((current) => (current + 1) % projects.length),
			2800
		);
		return () => window.clearInterval(timer);
	}, [projects.length]);

	return (
		<div className={cn(card, "w-[36rem] overflow-hidden text-[#202124]")}>
			<div className="flex h-9 items-end bg-[#dee1e6] pr-2 pl-3">
				<span className="mr-3 flex flex-none items-center gap-1.5 self-center">
					<i className="size-2.5 rounded-full bg-[#ff5f57]" />
					<i className="size-2.5 rounded-full bg-[#febc2e]" />
					<i className="size-2.5 rounded-full bg-[#28c840]" />
				</span>
				{projects.map((project, i) => (
					<span
						className={cn(
							"relative flex h-[1.875rem] min-w-0 flex-1 items-center gap-1.5 rounded-t-[8px] px-2.5 text-[0.6875rem] leading-none transition-colors duration-300",
							i === active ? "bg-white text-[#202124]" : "text-[#3c4043]"
						)}
						key={project.host}
					>
						{/* The divider between two tabs that are both in the back */}
						{i > 0 && i !== active && i - 1 !== active && (
							<i className="absolute top-2 left-0 h-3.5 w-px bg-[#9aa0a6]/60" />
						)}
						<svg
							aria-hidden="true"
							className="size-3 flex-none text-[#5f6368]"
							viewBox="0 0 12 12"
							{...icon}
							strokeWidth={1.1}
						>
							<circle cx="6" cy="6" r="4.6" />
							<path d="M1.4 6h9.2M6 1.4c1.5 1.4 2.2 3 2.2 4.6S7.5 9.2 6 10.6M6 1.4C4.5 2.8 3.8 4.4 3.8 6s.7 3.2 2.2 4.6" />
						</svg>
						<span className="min-w-0 flex-1 truncate">{project.name}</span>
						<svg
							aria-hidden="true"
							className="size-2 flex-none text-[#5f6368]"
							viewBox="0 0 8 8"
							{...icon}
						>
							<path d="m1.5 1.5 5 5m0-5-5 5" />
						</svg>
					</span>
				))}
				<svg
					aria-hidden="true"
					className="mb-2 ml-2 size-3 flex-none text-[#5f6368]"
					viewBox="0 0 12 12"
					{...icon}
				>
					<path d="M6 1.5v9M1.5 6h9" />
				</svg>
			</div>
			<div className="flex items-center gap-3 px-3 py-1.5 text-[#5f6368]">
				<svg
					aria-hidden="true"
					className="size-3 flex-none"
					viewBox="0 0 12 12"
					{...icon}
				>
					<path d="M10 6H2m3.5-3.5L2 6l3.5 3.5" />
				</svg>
				<svg
					aria-hidden="true"
					className="size-3 flex-none opacity-40"
					viewBox="0 0 12 12"
					{...icon}
				>
					<path d="M2 6h8M6.5 2.5 10 6 6.5 9.5" />
				</svg>
				<svg
					aria-hidden="true"
					className="size-3 flex-none"
					viewBox="0 0 12 12"
					{...icon}
				>
					<path d="M10 6a4 4 0 1 1-1.2-2.85M10 1.8v2.5H7.5" />
				</svg>
				<span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f1f3f4] px-3 py-1 text-[#202124] text-xs">
					<svg
						aria-hidden="true"
						className="size-3 flex-none text-[#5f6368]"
						viewBox="0 0 12 12"
						{...icon}
					>
						<path d="M2 3.5h5m2 0h1M2 8.5h1m2 0h5" />
						<circle cx="8" cy="3.5" r="1.2" />
						<circle cx="4" cy="8.5" r="1.2" />
					</svg>
					<span className="truncate">{projects[active]?.host}</span>
				</span>
				<span className="grid size-5 flex-none place-items-center rounded-full bg-[#1a73e8] font-medium text-[0.625rem] text-white leading-none">
					w
				</span>
			</div>
			<div className="relative aspect-[16/9] border-[#dadce0] border-t">
				{projects.map((project, i) => (
					<Image
						alt=""
						className={cn(
							"object-cover object-top transition-opacity duration-500",
							i === active ? "opacity-100" : "opacity-0"
						)}
						fill
						key={project.host}
						sizes="420px"
						src={project.src}
					/>
				))}
			</div>
		</div>
	);
}

const RANGES = ["1M", "6M", "YTD", "1Y", "5Y", "Max"];
const GROWTH = "M0 56C40 55 70 49 100 44S160 32 190 24S250 10 296 3";

/** A sum that grew, as Google's finance chart draws one: the range tabs,
 * then the line in its gain green, its end marked. */
function RaisedPicture({ value }: { value: string }) {
	return (
		<div className={cn(card, "w-[16.5rem] p-3.5 text-[#202124]")}>
			<div className="flex items-center gap-2">
				<span className="font-medium text-[0.9375rem] leading-none">
					{value}
				</span>
				<span className="rt-pop grid size-4 place-items-center rounded-full bg-[#e6f4ea]">
					<svg
						aria-hidden="true"
						className="size-2.5"
						fill="none"
						stroke={GOOGLE_PASS}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.6"
						viewBox="0 0 10 10"
					>
						<path d="M5 8.5v-7M2 4.5l3-3 3 3" />
					</svg>
				</span>
			</div>
			<div className="mt-2.5 flex gap-3 border-[#dadce0] border-b text-[#5f6368] text-[0.625rem] leading-none">
				{RANGES.map((range) => (
					<span
						className={cn(
							"-mb-px pb-1.5",
							range === "Max" &&
								"border-[#1a73e8] border-b-2 font-medium text-[#1a73e8]"
						)}
						key={range}
					>
						{range}
					</span>
				))}
			</div>
			<div className="relative mt-2.5 h-[3.75rem]">
				<span className="absolute inset-x-0 bottom-0 border-[#dadce0] border-b border-dashed" />
				<svg
					aria-hidden="true"
					className="absolute inset-0 size-full overflow-visible"
					fill="none"
					preserveAspectRatio="none"
					viewBox="0 0 300 60"
				>
					<path
						className="rt-fade"
						d={`${GROWTH}V60H0Z`}
						fill={GOOGLE_PASS}
						fillOpacity="0.1"
						style={index(18)}
					/>
					<path
						className="rt-draw"
						d={GROWTH}
						pathLength={1}
						stroke={GOOGLE_PASS}
						strokeLinecap="round"
						strokeWidth={2}
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
				<span
					className="rt-pop absolute top-0 right-0 size-2 rounded-full shadow-[0_0_0_3px_#fff]"
					style={{ backgroundColor: GOOGLE_PASS }}
				/>
			</div>
		</div>
	);
}

const BARS = [18, 24, 22, 31, 38, 36, 47, 55, 61, 72, 84, 100];

/** Reach as an analytics card shows it: the metric, its total, and bars
 * that rise to the latest one. */
function UsersPicture({ value }: { value: string }) {
	return (
		<div className={cn(card, "w-[16.5rem] p-3.5 text-[#202124]")}>
			<div className="flex items-start justify-between">
				<span>
					<span className="block text-[#5f6368] text-[0.6875rem] leading-none">
						Users
					</span>
					<span className="mt-1.5 block font-medium text-[0.9375rem] leading-none">
						{value}
					</span>
				</span>
				<span className="flex items-center gap-1.5 rounded-full border border-[#dadce0] px-2 py-1 text-[#5f6368] text-[0.625rem] leading-none">
					All time
					<svg
						aria-hidden="true"
						className="size-1.5"
						fill="currentColor"
						viewBox="0 0 8 8"
					>
						<path d="M0 2h8L4 7z" />
					</svg>
				</span>
			</div>
			<div className="mt-3 flex h-[4.5rem] items-end gap-1.5 border-[#dadce0] border-b">
				{BARS.map((height, i) => (
					<span
						className={cn(
							"rt-fade flex-1 rounded-t-[2px]",
							i === BARS.length - 1 ? "bg-[#174ea6]" : "bg-[#1a73e8]"
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
	days,
	host,
	items,
	steps,
	projects,
	week,
}: {
	/** Monday to Friday, as the locale abbreviates them. */
	days: string[];
	/** The address of one site that went live in three weeks. */
	host: string;
	items: ResultItem[];
	steps: string[];
	projects: ResultProject[];
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
				return <ProjectsPicture projects={projects} />;
			case "weeks":
				return (
					<WeeksPicture
						days={days}
						host={host}
						steps={steps}
						title={item.value}
						week={week}
					/>
				);
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
		projects: "h-32 items-start pt-3 md:h-40 md:pt-4",
		raised: "h-24 w-[46%] flex-none items-center md:h-40 md:w-auto",
		users: "h-24 w-[46%] flex-none items-center md:h-40 md:w-auto",
	};
	// Each picture is drawn once and scaled to the stage it stands on.
	const scale: Record<ResultKind, string> = {
		lighthouse: "",
		weeks: "scale-[0.56] md:scale-[0.6] xl:scale-[0.76]",
		projects: "origin-top scale-[0.48] md:scale-[0.54] xl:scale-[0.7]",
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
