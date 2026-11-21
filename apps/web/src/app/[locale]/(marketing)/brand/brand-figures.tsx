import { X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import Logo, { MARK_PARTS } from "@/components/logo";
import { cn } from "@/lib/utils";

/** The grounds the logo stands on, at the CI values. A specimen keeps them in
 * every site theme, so they are fixed here and not read from the theme. The
 * logo is ink on a light ground and white on dark and on orange. */
export const GROUNDS = {
	paper: { background: "#f8fafb", logo: "#0e1217", ring: true },
	panel: { background: "#eef0f2", logo: "#0e1217", ring: true },
	dark: { background: "#050a0f", logo: "#ffffff", ring: false },
	orange: { background: "#ff8918", logo: "#ffffff", ring: false },
} as const;

export type Ground = keyof typeof GROUNDS;

/** Fixed specimen colours: a figure looks the same in every site theme. */
export const MUTED = "#585e65";
export const INK = "#0e1217";
export const GUIDE = "#b0b9c0";

/** A rounded field in one ground. Everything inside reads `--logo` for its
 * colour, so a logo set to `text-logo` takes the ground's ink or white. */
export function Tile({
	children,
	className,
	ground,
}: {
	children: ReactNode;
	className?: string;
	ground: Ground;
}) {
	const { background, logo, ring } = GROUNDS[ground];
	return (
		<div
			className={cn(
				"relative flex min-h-48 items-center justify-center overflow-hidden rounded-[1.25rem] p-6",
				ring && "shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]",
				className
			)}
			style={{ backgroundColor: background, "--logo": logo } as CSSProperties}
		>
			{children}
		</div>
	);
}

export function Figure({
	caption,
	children,
	className,
	title,
}: {
	caption?: ReactNode;
	children: ReactNode;
	className?: string;
	title?: ReactNode;
}) {
	return (
		<figure className={className}>
			{children}
			{(title || caption) && (
				<figcaption className="mt-3 text-sm leading-6">
					{title && <span className="block text-foreground">{title}</span>}
					{caption && (
						<span className="block text-muted-foreground">{caption}</span>
					)}
				</figcaption>
			)}
		</figure>
	);
}

/** Construction lines: MUTED (#585e65) at 55 %, so no new grey enters. */
export const LINE = "rgba(88, 94, 101, 0.55)";

/** A delay for the draw-in animations, read by `.brand-draw` and `.brand-pop`. */
export const after = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** A solid line that draws itself in: `pathLength` is 1, so the dash that
 * hides it is one path long whatever its real length. */
export function Draw({
	d,
	ms = 0,
	stroke = MUTED,
	width = 2,
}: {
	d: string;
	ms?: number;
	stroke?: string;
	width?: number;
}) {
	return (
		<path
			className="brand-draw"
			d={d}
			fill="none"
			pathLength={1}
			stroke={stroke}
			strokeLinecap="round"
			strokeWidth={width}
			style={after(ms)}
		/>
	);
}

/** Anything that fades in after the lines: labels, dashed guides, fills. */
export function Pop({
	children,
	ms = 0,
}: {
	children: ReactNode;
	ms?: number;
}) {
	return (
		<g className="brand-pop" style={after(ms)}>
			{children}
		</g>
	);
}

/** A measure label in the drawings: 18 units, centred unless told. A halo in
 * the ground's colour keeps it legible where construction lines cross it. */
export function Measure({
	anchor = "middle",
	children,
	fill = MUTED,
	halo = "#eef0f2",
	ms = 0,
	strong = false,
	x,
	y,
}: {
	anchor?: "start" | "middle" | "end";
	children: ReactNode;
	fill?: string;
	halo?: string;
	ms?: number;
	strong?: boolean;
	x: number;
	y: number;
}) {
	return (
		<text
			className="brand-pop brand-measure"
			dominantBaseline="central"
			fill={strong ? INK : fill}
			fontSize="18"
			fontWeight={strong ? 500 : 400}
			paintOrder="stroke"
			stroke={halo}
			strokeLinejoin="round"
			strokeWidth="6"
			style={after(ms)}
			textAnchor={anchor}
			x={x}
			y={y}
		>
			{children}
		</text>
	);
}

/** Dimension lines with end ticks. */
export const hDim = (x1: number, x2: number, y: number) =>
	`M${x1} ${y - 6}V${y + 6}M${x1} ${y}H${x2}M${x2} ${y - 6}V${y + 6}`;
export const vDim = (x: number, y1: number, y2: number) =>
	`M${x - 6} ${y1}H${x + 6}M${x} ${y1}V${y2}M${x - 6} ${y2}H${x + 6}`;
/** A full circle as one path, so it can draw itself in. */
export const circle = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
/** A small cross on a centre point. */
export const cross = (x: number, y: number) =>
	`M${x - 6} ${y}H${x + 6}M${x} ${y - 6}V${y + 6}`;

/** The mark's construction, in its own units (30.25 × 15), checked against
 * the paths in `logo.tsx`. Every straight edge lies on one of these lines and
 * every curve on one of these circles. */
export const GEOMETRY = {
	/** Edges leaning 3 across for 4 down, as x = a + 0.75v: the left and right
	 * edge of each bar and the wedge's left edge. Left edges cross the top
	 * line 11 apart: −2.75, 8.25, 19.25. */
	leans: [-2.75, 4.25, 8.25, 15.25, 19.25],
	/** The wedge's right edge leans the other way: x = 33.55 − 0.75v. */
	counter: 33.55,
	/** The bars' centre lines, through the centres of their round ends. */
	axes: [0.75, 11.75],
	/** The round ends (r 2.8) touch both edges and the base line; the tip of
	 * the wedge (r 2.8) touches both its edges; the corner (r 3.3) touches the
	 * top line, the right side of the box and the wedge's right edge. */
	circles: [
		{ cx: 9.9, cy: 12.2, r: 2.8 },
		{ cx: 20.9, cy: 12.2, r: 2.8 },
		{ cx: 26.4, cy: 4.867, r: 2.8 },
		{ cx: 26.95, cy: 3.3, r: 3.3 },
	],
	/** Where each curve meets a straight line or the box. */
	tangents: [
		[7.66, 13.88],
		[12.14, 10.52],
		[9.9, 15],
		[18.66, 13.88],
		[23.14, 10.52],
		[20.9, 15],
		// The wedge's right edge, carried down, touches the second round end
		[23.14, 13.88],
		[24.16, 6.547],
		[28.64, 6.547],
		[26.4, 7.667],
		[26.95, 0],
		[29.59, 5.28],
		[30.25, 3.3],
	],
	/** The wedge's two edges, carried on, meet here at 73.74°. */
	apex: [26.4, 9.533],
} as const;

/** The construction lines of a mark drawn at `scale` with its top-left
 * corner at (left, top), carried far enough to cross any drawing. */
export function markConstruction(left: number, top: number, scale: number) {
	const px = (u: number) => left + scale * u;
	const py = (v: number) => top + scale * v;
	const reach = 1200 / scale;
	const lean = (a: number) =>
		`M${px(a - 0.75 * reach)} ${py(-reach)}L${px(a + 0.75 * reach)} ${py(reach)}`;
	return {
		edges: [
			...GEOMETRY.leans.map(lean),
			`M${px(GEOMETRY.counter + 0.75 * reach)} ${py(-reach)}L${px(GEOMETRY.counter - 0.75 * reach)} ${py(reach)}`,
		],
		axes: GEOMETRY.axes.map(lean),
		circles: GEOMETRY.circles.map(
			({ cx, cy, r }) =>
				`${circle(px(cx), py(cy), r * scale)}${cross(px(cx), py(cy))}`
		),
		tangents: GEOMETRY.tangents.map(([u, v]) => [px(u), py(v)] as const),
	};
}

/** The logo inside its clear space: the depth of the wedge (7.67 units of the
 * logo's 124.365 × 18.6, rounded up to 7.7) on every side. */
const LOGO_WIDTH = 124.365;
const LOGO_HEIGHT = 18.6;
const CLEAR_SPACE = 7.7;
const FRAME_WIDTH = LOGO_WIDTH + 2 * CLEAR_SPACE;
const FRAME_HEIGHT = LOGO_HEIGHT + 2 * CLEAR_SPACE;

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`;

export function ClearSpace() {
	return (
		<div
			className="relative w-full max-w-[420px]"
			style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}` }}
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 border-2 border-dashed"
				style={{ borderColor: GUIDE }}
			/>
			<div
				className="absolute"
				style={{
					left: percent(CLEAR_SPACE, FRAME_WIDTH),
					top: percent(CLEAR_SPACE, FRAME_HEIGHT),
					width: percent(LOGO_WIDTH, FRAME_WIDTH),
				}}
			>
				<Logo className="h-auto w-full" />
			</div>
		</div>
	);
}

/** The logo deck's step drawing: the parts up to this step solid, the rest at
 * a fifth, so the mark builds up left to right. Opacity is the only change the
 * rules allow on a part. Inside a stagger list, the solid parts light up in
 * turn when the list comes into view (`.brand-step-part` in index.css). */
export function StepMark({
	className,
	step,
}: {
	className?: string;
	step: number;
}) {
	return (
		<svg
			aria-hidden="true"
			className={cn("text-foreground", className)}
			viewBox="0 0 30.25 15"
			xmlns="http://www.w3.org/2000/svg"
		>
			{MARK_PARTS.map((d, i) => (
				<path
					className="brand-step-part"
					d={d}
					data-on={i < step ? "" : undefined}
					fill="currentColor"
					fillOpacity={i < step ? 1 : 0.2}
					key={d}
					style={{ "--i": i } as CSSProperties}
				/>
			))}
		</svg>
	);
}

/** The smallest sizes, drawn at their real pixel size: the logo at 96 px wide
 * and the mark alone from 16 px. Labels keep the specimen's fixed grey. */
const MARK_SIZES = [16, 24, 32] as const;

export function SmallestSizes() {
	return (
		<div className="flex w-full flex-col items-center gap-10 py-4">
			<div className="flex flex-col items-center gap-3">
				<Logo className="h-auto w-24" />
				<span
					className="text-[0.8125rem] tabular-nums"
					style={{ color: MUTED }}
				>
					96 px
				</span>
			</div>
			<div className="flex items-end gap-8">
				{MARK_SIZES.map((size) => (
					<div className="flex flex-col items-center gap-3" key={size}>
						<svg
							aria-hidden="true"
							className="text-logo"
							style={{ width: size, height: size / 2 }}
							viewBox="0 0 30.25 15"
							xmlns="http://www.w3.org/2000/svg"
						>
							{MARK_PARTS.map((d) => (
								<path d={d} fill="currentColor" key={d} />
							))}
						</svg>
						<span
							className="text-[0.8125rem] tabular-nums"
							style={{ color: MUTED }}
						>
							{size} px
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

/** The ways the logo breaks. These drawings are wrong on purpose, so they are
 * hidden from assistive tech and carry a visible "Wrong" caption. Each one
 * changes the mark's own paths; none redraws them. */
export type MisuseKind =
	| "colour"
	| "tints"
	| "wedge"
	| "stretch"
	| "inkOrange"
	| "rotate"
	| "font"
	| "effects";

const TINTS = [0.35, 0.65, 1] as const;

function MarkPaths({
	fill,
	skipWedge,
	tints,
}: {
	fill: string;
	skipWedge?: boolean;
	tints?: boolean;
}) {
	return (
		<>
			{MARK_PARTS.map((d, i) => {
				if (skipWedge && i === 2) {
					return null;
				}
				return (
					<path
						d={d}
						fill={fill}
						fillOpacity={tints ? TINTS[i] : undefined}
						key={d}
					/>
				);
			})}
		</>
	);
}

export function MisuseMark({ kind }: { kind: MisuseKind }) {
	if (kind === "stretch") {
		return (
			<svg
				aria-hidden="true"
				className="h-14 w-auto max-w-full sm:h-24"
				viewBox="0 0 420 110"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g transform="scale(13.8843 7.3333)">
					<MarkPaths fill={INK} />
				</g>
			</svg>
		);
	}

	if (kind === "font") {
		return (
			<div aria-hidden="true" className="flex items-center gap-2 sm:gap-3">
				<svg
					aria-hidden="true"
					className="h-5 w-auto sm:h-8"
					viewBox="0 0 30.25 15"
					xmlns="http://www.w3.org/2000/svg"
				>
					<MarkPaths fill={INK} />
				</svg>
				<span
					className="font-display font-medium text-[1.75rem] tracking-[-0.028em] sm:text-[2.5rem]"
					style={{ color: INK }}
				>
					webvise
				</span>
			</div>
		);
	}

	if (kind === "rotate") {
		return (
			<svg
				aria-hidden="true"
				className="h-14 w-auto overflow-visible sm:h-24"
				viewBox="0 0 300 149"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g transform="rotate(-16 150 74.5) translate(21.4 10.7) scale(8.5)">
					<MarkPaths fill={INK} />
				</g>
			</svg>
		);
	}

	if (kind === "effects") {
		return (
			<svg
				aria-hidden="true"
				className="h-14 w-auto overflow-visible sm:h-24"
				viewBox="0 0 300 149"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<filter
						height="160%"
						id="brand-misuse-shadow"
						width="140%"
						x="-20%"
						y="-20%"
					>
						<feDropShadow
							dx="0"
							dy="8"
							floodColor={INK}
							floodOpacity="0.45"
							stdDeviation="6"
						/>
					</filter>
				</defs>
				<g filter="url(#brand-misuse-shadow)" transform="scale(9.91736)">
					{MARK_PARTS.map((d) => (
						<path
							d={d}
							fill="#ffffff"
							key={d}
							stroke={INK}
							strokeWidth="0.35"
						/>
					))}
				</g>
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			className="h-14 w-auto sm:h-24"
			viewBox="0 0 300 149"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g transform="scale(9.91736)">
				<MarkPaths
					fill={kind === "colour" ? GROUNDS.orange.background : INK}
					skipWedge={kind === "wedge"}
					tints={kind === "tints"}
				/>
			</g>
		</svg>
	);
}

/** The caption of a wrong example, with a cross. */
export function WrongLabel({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-start gap-1.5 text-foreground">
			{/* On the first line's middle, also when the caption wraps */}
			<X
				aria-hidden="true"
				className="mt-[0.3125rem] size-3.5 shrink-0 text-destructive"
			/>
			{children}
		</span>
	);
}
