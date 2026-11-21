"use client";

import { useLocale } from "next-intl";
import { type ReactNode, useId, useState } from "react";

import { MARK_PARTS } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
	after,
	Draw,
	GUIDE,
	INK,
	MUTED,
	markConstruction,
	Pop,
	Tile,
} from "./brand-figures";

export type ReadingKey = "craft" | "height" | "ai" | "angle";

export interface Reading {
	figure: string;
	key: ReadingKey;
	text: string;
	title: string;
}

/** The drawing's grid: the mark at 24 px a unit, its top-left corner at
 * (70, 80). `x` and `y` turn mark units into drawing pixels. */
const S = 24;
const x = (u: number) => 70 + u * S;
const y = (v: number) => 80 + v * S;

/** Each part's width along its top edge, for the craft reading: design and
 * development are the same bar, 7 wide; the wedge is 11. */
const PART_WIDTHS = [
	{ u1: 0, u2: 7, v: 3.667, value: 7 },
	{ u1: 8.25, u2: 15.25, v: 0, value: 7 },
	{ u1: 19.25, u2: 30.25, v: 0, value: 11 },
].map((width) => {
	const line = y(width.v) - 20;
	return {
		...width,
		line,
		d: `M${x(width.u1)} ${line - 8}V${line + 8}M${x(width.u1)} ${line}H${x(width.u2)}M${x(width.u2)} ${line - 8}V${line + 8}`,
	};
});

/** The lowest point of each part and its height, for the height reading. */
const PART_BOTTOMS = [
	{ u: 9.9, v: 15, value: 11.33 },
	{ u: 20.9, v: 15, value: 15 },
	{ u: 26.4, v: 7.667, value: 7.67 },
] as const;

const LEVEL_LINES = [0, 3.667, 7.667, 15]
	.map((v) => `M30 ${y(v)}H850`)
	.join("");

/** Dashed lines along the left edge of each part: one lean, 3 across for 4
 * down, so the three lines run parallel. */
const EDGE_LINES = [
	[-2, 1, 9.25, 16],
	[7.125, -1.5, 20.25, 16],
	[18.125, -1.5, 31.25, 16],
]
	.map(([u1, v1, u2, v2]) => `M${x(u1)} ${y(v1)}L${x(u2)} ${y(v2)}`)
	.join("");

/** The 3-4-5 triangle on the first part's left edge: legs of 6 across and 8
 * down, so its long side lies on the edge. */
const TRIANGLE = `M${x(0)} ${y(3.667)}V${y(11.667)}H${x(6)}M${x(0)} ${y(11.667) - 16}H${x(0) + 16}V${y(11.667)}`;
const TRIANGLE_SIDES = [
	{ cx: x(0) - 26, cy: y(7.667), value: 4 },
	{ cx: x(3), cy: y(11.667) + 28, value: 3 },
	{ cx: x(2), cy: y(8.4), value: 5 },
] as const;

/** The mark's construction lines, drawn faint behind every reading. */
const BASE = markConstruction(x(0), y(0), S);
const LEVELS = [0, 3.667, 7.667, 15];

const NON_ID_CHARS = /[^a-zA-Z0-9-]/g;

/** A label in this drawing, which is set larger than the plates' labels. */
function Label({
	anchor = "middle",
	central = false,
	children,
	ms,
	size = 34,
	strong = false,
	x: left,
	y: top,
}: {
	anchor?: "start" | "middle" | "end";
	central?: boolean;
	children: ReactNode;
	ms: number;
	size?: number;
	strong?: boolean;
	x: number;
	y: number;
}) {
	return (
		<text
			className="brand-pop"
			dominantBaseline={central ? "central" : undefined}
			fill={strong ? INK : MUTED}
			fontSize={size}
			fontWeight={strong ? 500 : 400}
			style={after(ms)}
			textAnchor={anchor}
			x={left}
			y={top}
		>
			{children}
		</text>
	);
}

/** What a reading draws under the mark: guide lines and fills. */
function Under({ active, hatchId }: { active: ReadingKey; hatchId: string }) {
	if (active === "height") {
		return (
			<Pop>
				<path
					d={LEVEL_LINES}
					fill="none"
					stroke={GUIDE}
					strokeDasharray="8 8"
					strokeWidth="2"
				/>
			</Pop>
		);
	}
	if (active === "ai") {
		return (
			<>
				<Draw d={`M30 ${y(15)}H850`} stroke={GUIDE} />
				<Pop ms={140}>
					<path
						d={`M${x(19.25)} ${y(7.667)}H850`}
						fill="none"
						stroke={MUTED}
						strokeDasharray="8 8"
						strokeWidth="2"
					/>
				</Pop>
				<Pop ms={240}>
					<rect
						fill={`url(#${hatchId})`}
						height={y(15) - y(7.667)}
						width={x(30.25) - x(24)}
						x={x(24)}
						y={y(7.667)}
					/>
				</Pop>
			</>
		);
	}
	if (active === "angle") {
		return (
			<Pop>
				<path
					d={EDGE_LINES}
					fill="none"
					stroke={GUIDE}
					strokeDasharray="8 8"
					strokeWidth="2"
				/>
			</Pop>
		);
	}
	return null;
}

/** What a reading draws over the mark: measures that draw themselves in. */
function Over({
	active,
	format,
}: {
	active: ReadingKey;
	format: (value: number) => string;
}) {
	if (active === "craft") {
		return (
			<>
				{PART_WIDTHS.map(({ d, line, u1, u2, value }, i) => (
					<g key={u1}>
						<Draw d={d} ms={i * 90} stroke={value === 7 ? INK : MUTED} />
						<Label
							ms={260 + i * 90}
							strong={value === 7}
							x={(x(u1) + x(u2)) / 2}
							y={line - 16}
						>
							{value}
						</Label>
					</g>
				))}
			</>
		);
	}
	if (active === "height") {
		return (
			<>
				{PART_BOTTOMS.map(({ u, v, value }, i) => (
					<Label
						key={u}
						ms={160 + i * 80}
						strong={value === 15}
						x={x(u)}
						y={y(v) + 46}
					>
						{format(value)}
					</Label>
				))}
			</>
		);
	}
	if (active === "ai") {
		return (
			<Label anchor="end" ms={340} size={36} x={850} y={y(7.667) - 16}>
				½
			</Label>
		);
	}
	return (
		<>
			<Draw d={TRIANGLE} ms={160} />
			{TRIANGLE_SIDES.map(({ cx, cy, value }, i) => (
				<Label central key={value} ms={420 + i * 60} size={32} x={cx} y={cy}>
					{value}
				</Label>
			))}
		</>
	);
}

function MeaningFigure({
	active,
	label,
}: {
	active: ReadingKey;
	label: string;
}) {
	const locale = useLocale();
	// An id that is safe inside url(#…)
	const hatchId = `hatch-${useId().replace(NON_ID_CHARS, "")}`;
	const format = (value: number) => new Intl.NumberFormat(locale).format(value);

	// Each reading's layers are keyed, so choosing one mounts them afresh and
	// their lines draw in; the mark between them never changes.
	return (
		<svg
			aria-label={label}
			className="h-auto w-full text-logo"
			role="img"
			viewBox="0 0 880 540"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				{/* The site's .grid-hatch: -45°, ink at the grid line's 12 % */}
				<pattern
					height="10"
					id={hatchId}
					patternTransform="rotate(-45)"
					patternUnits="userSpaceOnUse"
					width="10"
				>
					<line
						stroke={INK}
						strokeOpacity="0.12"
						strokeWidth="1.5"
						x1="0"
						x2="0"
						y1="0"
						y2="10"
					/>
				</pattern>
			</defs>
			<g key={`under-${active}`}>
				<Under active={active} hatchId={hatchId} />
			</g>
			<g transform={`translate(${x(0)} ${y(0)}) scale(${S})`}>
				{MARK_PARTS.map((d) => (
					<path d={d} fill="currentColor" key={d} />
				))}
			</g>
			{/* The construction stays in view, faint, under every reading */}
			<path
				d={[...LEVELS.map((v) => `M0 ${y(v)}H880`), ...BASE.edges].join("")}
				fill="none"
				stroke={GUIDE}
				strokeOpacity="0.45"
				strokeWidth="1"
			/>
			<path
				d={BASE.axes.join("")}
				fill="none"
				stroke={GUIDE}
				strokeDasharray="14 5 2 5"
				strokeOpacity="0.45"
				strokeWidth="1"
			/>
			<path
				d={BASE.circles.join("")}
				fill="none"
				stroke={GUIDE}
				strokeOpacity="0.6"
				strokeWidth="1"
			/>
			<g key={`over-${active}`}>
				<Over active={active} format={format} />
			</g>
		</svg>
	);
}

/** The readings of the mark beside one drawing. Choosing a reading shows the
 * measure it rests on; the mark itself never changes. */
export function MeaningExplorer({
	listLabel,
	readings,
}: {
	listLabel: string;
	readings: readonly Reading[];
}) {
	const [active, setActive] = useState<ReadingKey>("craft");
	const current = readings.find((reading) => reading.key === active);

	return (
		<div className="grid gap-8 lg:grid-cols-12 lg:gap-x-6">
			<Tile className="p-4 sm:p-8 lg:col-span-7" ground="panel">
				<MeaningFigure active={active} label={current?.figure ?? ""} />
			</Tile>
			<ol
				aria-label={listLabel}
				className="border-grid-line border-t lg:col-span-5"
			>
				{readings.map((reading, index) => {
					const selected = reading.key === active;
					return (
						<li
							className="relative border-grid-line border-b"
							key={reading.key}
						>
							{/* The chosen reading draws an ink line over its top rule */}
							<span
								aria-hidden="true"
								className={cn(
									"absolute inset-x-0 -top-px h-px origin-left bg-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
									selected ? "scale-x-100" : "scale-x-0"
								)}
							/>
							<button
								aria-pressed={selected}
								className="group flex w-full gap-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
								onClick={() => setActive(reading.key)}
								type="button"
							>
								<span
									aria-hidden="true"
									className={cn(
										"w-6 shrink-0 pt-0.5 text-sm tabular-nums transition-colors duration-150",
										selected ? "text-foreground" : "text-muted-foreground/70"
									)}
								>
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="min-w-0">
									<span
										className={cn(
											"block font-display text-lg leading-snug tracking-[-0.015em] transition-colors duration-150",
											selected
												? "text-foreground"
												: "text-foreground/45 group-hover:text-foreground"
										)}
									>
										{reading.title}
									</span>
									<span
										className={cn(
											"mt-1.5 block text-sm leading-6 transition-colors duration-150",
											selected
												? "text-muted-foreground"
												: "text-muted-foreground/70"
										)}
									>
										{reading.text}
									</span>
								</span>
							</button>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
