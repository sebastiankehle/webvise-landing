import { X } from "lucide-react";
import { useLocale } from "next-intl";
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

const MUTED = "#585e65";
const INK = "#0e1217";
const GUIDE = "#b0b9c0";

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
				"relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl p-6",
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

/** The construction slide: the mark on four guide lines with the widths of a
 * stroke, a gap and the wedge above it, the lean as a 3 by 4 triangle and the
 * height of each part below. Numbers are the deck's; the mark is `MARK_PARTS`. */
const GUIDE_LINES = "M0 90H960M0 200H960M0 320H960M0 540H960";
const DIMENSION_LINES =
	"M273.5 42V58M273.5 50H483.5M483.5 42V58M603.5 42V58M603.5 50H933.5M933.5 42V58M60 400V520H150Z";
const WIDTHS = [
	{ x: 378, value: 7 },
	{ x: 543, value: 4 },
	{ x: 768, value: 11 },
] as const;
const LEVELS = [
	{ y: 90, value: 0 },
	{ y: 200, value: 3.7 },
	{ y: 320, value: 7.7 },
	{ y: 540, value: 15 },
] as const;
const LENGTHS = [
	{ x: 206, value: 11.3 },
	{ x: 497, value: 15 },
	{ x: 768, value: 7.7 },
] as const;

export function ConstructionDrawing({ label }: { label: string }) {
	const locale = useLocale();
	const format = (value: number) => new Intl.NumberFormat(locale).format(value);

	return (
		<div className="w-full overflow-x-auto">
			<svg
				aria-label={label}
				className="h-auto w-full min-w-[520px] text-logo"
				role="img"
				viewBox="0 0 1100 640"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d={GUIDE_LINES}
					fill="none"
					stroke={GUIDE}
					strokeDasharray="8 8"
					strokeWidth="2"
				/>
				<path d={DIMENSION_LINES} fill="none" stroke={MUTED} strokeWidth="2" />
				<g transform="translate(26 90) scale(30)">
					{MARK_PARTS.map((d) => (
						<path d={d} fill="currentColor" key={d} />
					))}
				</g>
				<g fill={MUTED} fontSize="24">
					{WIDTHS.map(({ x, value }) => (
						<text key={x} textAnchor="middle" x={x} y="26">
							{format(value)}
						</text>
					))}
					<text dominantBaseline="central" x="24" y="460">
						4
					</text>
					<text dominantBaseline="central" textAnchor="middle" x="105" y="548">
						3
					</text>
				</g>
				<g fill={MUTED} fontSize="28">
					{LEVELS.map(({ y, value }) => (
						<text dominantBaseline="central" key={y} x="990" y={y}>
							{format(value)}
						</text>
					))}
				</g>
				<g fill={INK} fontSize="28" fontWeight="500">
					{LENGTHS.map(({ x, value }) => (
						<text
							dominantBaseline="central"
							key={x}
							textAnchor="middle"
							x={x}
							y="601"
						>
							{format(value)}
						</text>
					))}
				</g>
			</svg>
		</div>
	);
}

/** The logo inside its clear space: the depth of the wedge (7.7 units of the
 * logo's 124.365 × 18.6) on every side. */
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

/** The four ways the deck says the mark breaks. These drawings are wrong on
 * purpose, so they are hidden from assistive tech and carry a visible
 * "Wrong" caption. Each one changes the mark's own paths. */
export type MisuseKind = "colour" | "tints" | "wedge" | "stretch";

const TINTS = [0.35, 0.65, 1] as const;

export function MisuseMark({ kind }: { kind: MisuseKind }) {
	if (kind === "stretch") {
		return (
			<svg
				aria-hidden="true"
				className="h-24 w-auto max-w-full"
				viewBox="0 0 420 110"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g fill={INK} transform="scale(13.8843 7.3333)">
					{MARK_PARTS.map((d) => (
						<path d={d} key={d} />
					))}
				</g>
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			className="h-24 w-auto"
			viewBox="0 0 300 149"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g
				fill={kind === "colour" ? GROUNDS.orange.background : INK}
				transform="scale(9.91736)"
			>
				{MARK_PARTS.map((d, i) => {
					if (kind === "wedge" && i === 2) {
						return null;
					}
					return (
						<path
							d={d}
							fillOpacity={kind === "tints" ? TINTS[i] : undefined}
							key={d}
						/>
					);
				})}
			</g>
		</svg>
	);
}

/** The caption of a wrong example, with a cross. */
export function WrongLabel({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-foreground">
			<X aria-hidden="true" className="size-3.5 text-destructive" />
			{children}
		</span>
	);
}
