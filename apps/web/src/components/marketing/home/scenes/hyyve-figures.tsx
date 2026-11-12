// Hyyve's own figures, taken unchanged from its landing page (figures-svg.tsx).
import { cn } from "@/lib/utils";

/**
 * Simple, flat, minimal line illustrations — one clear idea each, monochrome
 * off-white with a single teal accent. No isometric depth, no clutter.
 */
const EDGE = "rgba(241,240,236,0.5)";
const EDGE_SOFT = "rgba(241,240,236,0.22)";
const TEAL = "var(--accent-teal)";
const SW = 2;

const COS30 = 0.866_025_4;
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Flat-top hexagon outline path. */
function hexPath(cx: number, cy: number, R: number) {
	const h = R * COS30;
	const p = [
		[cx + R, cy],
		[cx + R / 2, cy + h],
		[cx - R / 2, cy + h],
		[cx - R, cy],
		[cx - R / 2, cy - h],
		[cx + R / 2, cy - h],
	];
	return `M${p.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L")}Z`;
}

function Hex({
	R,
	accent,
	cx,
	cy,
	dim,
}: {
	R: number;
	accent?: boolean;
	cx: number;
	cy: number;
	dim?: boolean;
}) {
	return (
		<path
			d={hexPath(cx, cy, R)}
			fill={accent ? TEAL : "none"}
			fillOpacity={accent ? 0.1 : 0}
			stroke={accent ? TEAL : dim ? EDGE_SOFT : EDGE}
			strokeLinejoin="round"
			strokeWidth={SW}
		/>
	);
}

/** Flat-top honeycomb of identical hexagons; offset columns tessellate exactly. */
function honeycomb(
	R: number,
	cols: number,
	rows: number,
	ox: number,
	oy: number
) {
	const h = R * COS30;
	const dx = 1.5 * R;
	const dy = 2 * h;
	const cells: Array<[number, number, number, number]> = [];
	for (let c = 0; c < cols; c++) {
		for (let row = 0; row < rows; row++) {
			cells.push([ox + c * dx, oy + row * dy + (c % 2 ? h : 0), c, row]);
		}
	}
	return cells;
}

function FigureSvg({
	children,
	className,
	label,
	viewBox,
}: {
	children: React.ReactNode;
	className?: string;
	label: string;
	viewBox: string;
}) {
	return (
		<svg
			aria-label={label}
			className={cn("h-full w-full", className)}
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			role="img"
			shapeRendering="geometricPrecision"
			viewBox={viewBox}
		>
			<title>{label}</title>
			{children}
		</svg>
	);
}

/* ── source-backed memory: a document, lifted into one memory cell ──────── */
export function SourceFigure({ className }: { className?: string }) {
	return (
		<FigureSvg
			className={className}
			label="A source document linked up to a single memory cell"
			viewBox="10.7 11.5 162.5 162.5"
		>
			{/* source document */}
			<rect
				height={64}
				rx={6}
				stroke={EDGE}
				strokeWidth={SW}
				width={56}
				x={64}
				y={94}
			/>
			<path
				d="M76 110h32M76 122h32M76 134h20"
				stroke={EDGE_SOFT}
				strokeLinecap="round"
				strokeWidth={SW}
			/>
			{/* connector */}
			<path
				d="M92 94V76"
				stroke={EDGE_SOFT}
				strokeLinecap="round"
				strokeWidth={SW}
			/>
			{/* extracted memory cell */}
			<Hex accent cx={92} cy={50} R={26} />
		</FigureSvg>
	);
}

/* ── structured into cells: a small clean honeycomb, one cell highlighted ── */
export function CellsFigure({ className }: { className?: string }) {
	const R = 30;
	const cells = honeycomb(R, 3, 2, 78, 64);
	return (
		<FigureSvg
			className={className}
			label="A small honeycomb of identical memory cells, one highlighted"
			viewBox="32 12 182 182"
		>
			{cells.map(([x, y, c, row]) => (
				<Hex
					accent={c === 1 && row === 0}
					cx={x}
					cy={y}
					key={`${c}-${row}`}
					R={R}
				/>
			))}
		</FigureSvg>
	);
}

/* ── scoped for retrieval: out-of-scope cells recede, one cell is in scope ─ */
export function RetrievalFigure({ className }: { className?: string }) {
	const R = 26;
	const cells = honeycomb(R, 3, 2, 84, 62);
	// The single in-scope cell (top of the middle column).
	const scoped = cells.find(([, , c, row]) => c === 1 && row === 0) ?? cells[0];
	return (
		<FigureSvg
			className={className}
			label="Out-of-scope cells recede while one cell stays in scope for the agent"
			viewBox="42 14.8 162 162"
		>
			{cells.map(([x, y, c, row]) => {
				const accent = c === 1 && row === 0;
				return (
					<Hex
						accent={accent}
						cx={x}
						cy={y}
						dim={!accent}
						key={`${c}-${row}`}
						R={R}
					/>
				);
			})}
			{/* soft halo + dashed scope ring around the single allowed cell */}
			<circle
				cx={scoped[0]}
				cy={scoped[1]}
				fill={TEAL}
				fillOpacity={0.06}
				r={R + 12}
			/>
			<circle
				cx={scoped[0]}
				cy={scoped[1]}
				r={R + 11}
				stroke={TEAL}
				strokeDasharray="4 5"
				strokeOpacity={0.9}
				strokeWidth={2}
			/>
		</FigureSvg>
	);
}

/* ── agent access: one agent reaches one allowed cell ──────────────────── */
export function AccessFigure({ className }: { className?: string }) {
	const R = 30;
	const core: [number, number] = [150, 90];
	const agent: [number, number] = [54, 90];
	return (
		<FigureSvg
			className={className}
			label="An agent connects to one allowed cell in the hive"
			viewBox="0 0 240 180"
		>
			{/* hive: three cells */}
			<Hex cx={core[0]} cy={core[1] - R * COS30} R={R} />
			<Hex accent cx={core[0] + 1.5 * R} cy={core[1]} R={R} />
			<Hex cx={core[0]} cy={core[1] + R * COS30} R={R} />
			{/* agent node + connection to the allowed cell */}
			<circle
				cx={agent[0]}
				cy={agent[1]}
				r={8}
				stroke={EDGE}
				strokeWidth={SW}
			/>
			<path
				d={`M${agent[0] + 9} ${agent[1]}H${core[0] + 1.5 * R - R - 6}`}
				stroke={TEAL}
				strokeLinecap="round"
				strokeWidth={SW}
			/>
		</FigureSvg>
	);
}

/* ── brand hive: a simple, calm honeycomb ──────────────────────────────── */
export function HiveFigure({ className }: { className?: string }) {
	const R = 34;
	const cells = honeycomb(R, 5, 2, 150, 96);
	return (
		<FigureSvg
			className={className}
			label="The hyyve memory graph, a honeycomb of cells"
			viewBox="0 0 700 200"
		>
			{cells.map(([x, y, c, row]) => (
				<Hex
					accent={c === 2 && row === 0}
					cx={x}
					cy={y}
					key={`${c}-${row}`}
					R={R}
				/>
			))}
		</FigureSvg>
	);
}

/* ── transformation: scattered fragments become an ordered row ─────────── */
export function TransformFigure({ className }: { className?: string }) {
	const scatter: Array<[number, number, number]> = [
		[70, 70, 14],
		[120, 120, 11],
		[60, 150, 10],
		[140, 60, 12],
		[100, 95, 9],
	];
	const ordered = honeycomb(26, 3, 1, 300, 110);
	return (
		<FigureSvg
			className={className}
			label="Scattered fragments resolving into an ordered row of cells"
			viewBox="0 0 480 200"
		>
			{scatter.map(([x, y, r], i) => (
				<g key={`s-${x}-${y}`} transform={`rotate(${(i - 2) * 12} ${x} ${y})`}>
					<Hex cx={x} cy={y} R={r} />
				</g>
			))}
			<path
				d="M205 100h60"
				stroke={EDGE_SOFT}
				strokeLinecap="round"
				strokeWidth={SW}
			/>
			<path
				d="M258 93l9 7-9 7"
				stroke={EDGE_SOFT}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={SW}
			/>
			{ordered.map(([x, y, c, row]) => (
				<Hex accent={c === 1} cx={x} cy={y} key={`o-${c}-${row}`} R={26} />
			))}
		</FigureSvg>
	);
}
