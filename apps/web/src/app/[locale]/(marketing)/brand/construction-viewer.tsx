"use client";

import { useLocale } from "next-intl";
import { type ReactNode, useState } from "react";

import { MARK_PARTS, WORD } from "@/components/logo";
import { H3 } from "@/components/ui/typography";
import {
	after,
	circle,
	Draw,
	GEOMETRY,
	GUIDE,
	hDim,
	INK,
	LINE,
	Measure,
	markConstruction,
	Pop,
	Tile,
	vDim,
} from "./brand-figures";
import { Option, Segmented } from "./segmented";

export type PlateKey = "sheet" | "measures" | "lockup" | "stacked" | "icon";

export interface Plate {
	figure: string;
	key: PlateKey;
	name: string;
	/** The relations the sheet shows, each led by the value it is drawn as. */
	points?: readonly { text: string; value: string }[];
	text: string;
	title: string;
}

/** Every plate is drawn in one 1000 × 500 box, so switching never moves the
 * page. Measures come from the paths in `logo.tsx` (see GEOMETRY). */
const PANEL = "#eef0f2";
const DARK = "#050a0f";
const ORANGE = "#ff8918";
/** Construction over the dark icon: white, the icon's own colour, at 30 %. */
const ON_DARK = "rgba(255, 255, 255, 0.3)";
/** A centre line, drawn as on a drafting sheet: long dash, dot, long dash. */
const DASH_DOT = "14 5 2 5";

type Format = (value: number) => string;

/** The mark as the sheets draw it: a faint fill under an outline, so the
 * construction lines read through it. */
function Outline({ fill = INK }: { fill?: string }) {
	return (
		<>
			{MARK_PARTS.map((d) => (
				<path
					d={d}
					fill={fill}
					fillOpacity="0.08"
					key={d}
					stroke={fill}
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
				/>
			))}
		</>
	);
}

function Solid({ fill = INK }: { fill?: string }) {
	return (
		<>
			{MARK_PARTS.map((d) => (
				<path d={d} fill={fill} key={d} />
			))}
		</>
	);
}

/** Where a curve meets a line: an orange dot, the sheet's one accent. The
 * dot shrinks with the drawing so it never covers the curve it marks. */
function Contacts({
	ms,
	points,
	scale = 26,
}: {
	ms: number;
	points: readonly (readonly [number, number])[];
	scale?: number;
}) {
	const r = Math.min(4.5, scale * 0.17);
	return (
		<Pop ms={ms}>
			{points.map(([x, y]) => (
				<circle
					cx={x}
					cy={y}
					fill={ORANGE}
					key={`${x}-${y}`}
					r={r}
					stroke={PANEL}
					strokeWidth={r / 3}
				/>
			))}
		</Pop>
	);
}

/** The full construction of the mark at 26 a unit: the unit grid, every edge
 * carried across the sheet, every curve as a whole circle, the axes, the
 * points of contact, both angles and three chains of measures. */
function SheetPlate({ f }: { f: Format }) {
	const left = 100;
	const top = 70;
	const s = 26;
	const px = (u: number) => left + s * u;
	const py = (v: number) => top + s * v;
	const c = markConstruction(left, top, s);
	const grid = [
		...Array.from({ length: 40 }, (_, i) => `M${px(i - 4)} 0V500`),
		...Array.from({ length: 21 }, (_, i) => `M0 ${py(i - 3)}H1000`),
	].join("");
	const levels = [0, 3.667, 7.667, 15];
	const [ax, av] = GEOMETRY.apex;
	const apex = [px(ax), py(av)] as const;
	const foot = [px(19.5), py(15)] as const;
	const chainTop = py(-1.3);
	const chainRight = px(30.25) + 44;
	const chainCentres = py(12.2);

	return (
		<>
			<Pop>
				<path d={grid} stroke={GUIDE} strokeOpacity="0.35" strokeWidth="0.75" />
			</Pop>
			<g transform={`translate(${left} ${top}) scale(${s})`}>
				<Outline />
			</g>
			{levels.map((v, i) => (
				<Draw
					d={`M0 ${py(v)}H1000`}
					key={v}
					ms={60 + i * 40}
					stroke={LINE}
					width={1}
				/>
			))}
			<Draw d={`M${px(0)} 0V500`} ms={140} stroke={LINE} width={1} />
			<Draw d={`M${px(30.25)} 0V500`} ms={180} stroke={LINE} width={1} />
			{c.edges.map((d, i) => (
				<Draw d={d} key={d} ms={220 + i * 50} stroke={LINE} width={1} />
			))}
			<Pop ms={480}>
				<path
					d={[...c.axes, `M0 ${chainCentres}H1000`, `M${px(ax)} 0V500`].join(
						""
					)}
					stroke={LINE}
					strokeDasharray={DASH_DOT}
					strokeWidth="1"
				/>
			</Pop>
			{c.circles.map((d, i) => (
				<Draw d={d} key={d} ms={520 + i * 90} stroke={INK} width={1.25} />
			))}
			<Draw
				d={`M${foot[0] - 54} ${foot[1]}A54 54 0 0 1 ${foot[0] - 32.4} ${foot[1] - 43.2}`}
				ms={820}
				stroke={INK}
				width={1.25}
			/>
			<Draw
				d={`M${apex[0] - 26.4} ${apex[1] - 35.2}A44 44 0 0 1 ${apex[0] + 26.4} ${apex[1] - 35.2}`}
				ms={860}
				stroke={INK}
				width={1.25}
			/>
			<Contacts ms={940} points={[...c.tangents, apex]} />
			<Draw
				d={[
					hDim(px(-2.75), px(8.25), chainTop),
					hDim(px(8.25), px(19.25), chainTop),
					hDim(px(19.25), px(30.25), chainTop),
				].join("")}
				ms={900}
			/>
			<Draw
				d={[
					vDim(chainRight, py(0), py(3.667)),
					vDim(chainRight, py(3.667), py(7.667)),
					vDim(chainRight, py(7.667), py(15)),
				].join("")}
				ms={960}
			/>
			<Draw
				d={`${hDim(px(9.9), px(20.9), chainCentres)}${hDim(px(20.9), px(26.4), chainCentres)}`}
				ms={1020}
			/>
			{[-2.75, 8.25, 19.25].map((u, i) => (
				<Measure key={u} ms={1100 + i * 50} strong x={px(u + 5.5)} y={18}>
					11
				</Measure>
			))}
			{[
				{ v: 1.833, value: 3.67 },
				{ v: 5.667, value: 4 },
				{ v: 11.333, value: 7.33 },
			].map(({ v, value }, i) => (
				<Measure
					anchor="start"
					key={v}
					ms={1250 + i * 50}
					strong
					x={chainRight + 14}
					y={py(v)}
				>
					{f(value)}
				</Measure>
			))}
			<Measure ms={1400} strong x={px(15.4)} y={chainCentres - 16}>
				11
			</Measure>
			<Measure ms={1440} strong x={px(23.65)} y={chainCentres + 18}>
				{f(5.5)}
			</Measure>
			<Measure ms={1480} strong x={foot[0] - 82} y={foot[1] - 40}>
				{f(53.13)}°
			</Measure>
			<Measure ms={1520} strong x={apex[0]} y={apex[1] + 28}>
				{f(73.74)}°
			</Measure>
			<Measure ms={1560} x={px(9.9)} y={py(15) + 22}>
				R {f(2.8)}
			</Measure>
			<Measure ms={1600} x={px(20.9)} y={py(15) + 22}>
				R {f(2.8)}
			</Measure>
			<Measure anchor="start" ms={1640} x={px(29.4)} y={py(7.9)}>
				R {f(2.8)}
			</Measure>
			<Measure anchor="start" ms={1680} x={px(28.4)} y={py(-0.75)}>
				R {f(3.3)}
			</Measure>
		</>
	);
}

/** Flat widths along the top edges, the same two measures square to the
 * lean (×0.8, the 4 of the 3-4-5), and the height of each part. */
function MeasuresPlate({ f }: { f: Format }) {
	const px = (u: number) => 100 + 26 * u;
	const py = (v: number) => 70 + 26 * v;
	// A step square to the lean: the edges run (0.6, 0.8), so square is (0.8, −0.6)
	const strokeFrom = [px(14.25), py(8)] as const;
	const strokeTo = [px(18.73), py(4.64)] as const;
	const gapFrom = [px(11), py(9)] as const;
	const gapTo = [px(13.56), py(7.08)] as const;
	const tick = (x: number, y: number) =>
		`M${x - 4.2} ${y - 5.6}L${x + 4.2} ${y + 5.6}`;
	return (
		<>
			<Pop>
				<path
					d={[0, 3.667, 7.667, 15].map((v) => `M40 ${py(v)}H960`).join("")}
					stroke={GUIDE}
					strokeDasharray="6 6"
					strokeWidth="1.5"
				/>
			</Pop>
			<g transform={`translate(${px(0)} ${py(0)}) scale(26)`}>
				<Solid />
			</g>
			<Draw d={hDim(px(0), px(7), py(3.667) - 22)} ms={60} />
			<Draw d={hDim(px(7), px(11), py(3.667))} ms={120} />
			<Draw d={hDim(px(8.25), px(15.25), py(0) - 22)} ms={180} />
			<Draw d={hDim(px(15.25), px(19.25), py(0) - 22)} ms={240} />
			<Draw d={hDim(px(19.25), px(30.25), py(0) - 22)} ms={300} />
			<Measure ms={380} strong x={(px(0) + px(7)) / 2} y={py(3.667) - 40}>
				7
			</Measure>
			<Measure ms={420} x={(px(7) + px(11)) / 2} y={py(3.667) - 14}>
				4
			</Measure>
			<Measure ms={460} strong x={(px(8.25) + px(15.25)) / 2} y={py(0) - 40}>
				7
			</Measure>
			<Measure ms={500} x={(px(15.25) + px(19.25)) / 2} y={py(0) - 40}>
				4
			</Measure>
			<Measure ms={540} strong x={(px(19.25) + px(30.25)) / 2} y={py(0) - 40}>
				11
			</Measure>
			<Draw
				d={`M${strokeFrom[0]} ${strokeFrom[1]}L${strokeTo[0]} ${strokeTo[1]}${tick(...strokeFrom)}${tick(...strokeTo)}`}
				ms={620}
				stroke={PANEL}
			/>
			<Measure fill={PANEL} halo={INK} ms={760} x={px(16.9)} y={py(7.3)}>
				{f(5.6)}
			</Measure>
			<Draw
				d={`M${gapFrom[0]} ${gapFrom[1]}L${gapTo[0]} ${gapTo[1]}${tick(...gapFrom)}${tick(...gapTo)}`}
				ms={680}
			/>
			<Measure ms={800} x={px(11.6)} y={py(7.2)}>
				{f(3.2)}
			</Measure>
			<Measure ms={860} x={px(9.9)} y={py(15) + 26}>
				{f(11.33)}
			</Measure>
			<Measure ms={900} strong x={px(20.9)} y={py(15) + 26}>
				15
			</Measure>
			<Measure ms={940} x={px(26.4)} y={py(7.667) + 26}>
				{f(7.67)}
			</Measure>
		</>
	);
}

/** Lines across the whole sheet at the given levels and sides. */
function Frame({
	levels,
	sides,
	px,
	py,
}: {
	levels: readonly number[];
	px: (u: number) => number;
	py: (v: number) => number;
	sides: readonly number[];
}) {
	return (
		<>
			{levels.map((v, i) => (
				<Draw
					d={`M0 ${py(v)}H1000`}
					key={`level-${v}`}
					ms={i * 40}
					stroke={LINE}
					width={1}
				/>
			))}
			{sides.map((u, i) => (
				<Draw
					d={`M${px(u)} 0V500`}
					key={`side-${u}`}
					ms={120 + i * 40}
					stroke={LINE}
					width={1}
				/>
			))}
		</>
	);
}

/** The main logo at 7 a unit on its construction: the mark's lines and
 * circles, the word's levels, the mark centred on the x-height and the gap
 * half the mark's height. */
function LockupPlate({ f }: { f: Format }) {
	const px = (u: number) => 60 + 7 * u;
	const py = (v: number) => 290 + 7 * v;
	const c = markConstruction(px(0), py(-13.5), 7);
	return (
		<>
			<Frame
				levels={[-16.7, -13.5, -12, 0, 1.5]}
				px={px}
				py={py}
				sides={[0, 30.25, 37.75, 124.27]}
			/>
			{c.edges.map((d, i) => (
				<Draw d={d} key={d} ms={200 + i * 40} stroke={GUIDE} width={0.75} />
			))}
			<Pop ms={420}>
				<path
					d={`M0 ${py(-6)}H1000`}
					stroke={LINE}
					strokeDasharray={DASH_DOT}
					strokeWidth="1"
				/>
			</Pop>
			<g transform={`translate(${px(0)} ${py(-13.5)}) scale(7)`}>
				<Outline />
			</g>
			<path
				d={WORD}
				fill={INK}
				fillOpacity="0.08"
				stroke={INK}
				strokeWidth="1.5"
				transform={`translate(${px(37.507)} ${py(0)}) scale(${22.059 * 7})`}
				vectorEffect="non-scaling-stroke"
			/>
			{c.circles.map((d, i) => (
				<Draw d={d} key={d} ms={460 + i * 60} stroke={INK} width={1} />
			))}
			<Contacts ms={720} points={c.tangents} scale={7} />
			<Draw d={vDim(38, py(-13.5), py(1.5))} ms={700} />
			<Draw d={vDim(950, py(-12), py(0))} ms={740} />
			<Draw d={hDim(px(30.25), px(37.75), py(1.5) + 34)} ms={780} />
			<Draw d={hDim(px(0), px(124.27), py(-16.7) - 34)} ms={820} />
			<Measure anchor="end" ms={900} strong x={26} y={py(-6)}>
				15
			</Measure>
			<Measure anchor="start" ms={940} strong x={964} y={py(-6)}>
				12
			</Measure>
			<Measure ms={980} strong x={(px(30.25) + px(37.75)) / 2} y={py(1.5) + 58}>
				{f(7.5)}
			</Measure>
			<Measure ms={1020} x={(px(0) + px(124.27)) / 2} y={py(-16.7) - 56}>
				{f(124.27)}
			</Measure>
		</>
	);
}

/** The stacked logo at 9 a unit: the mark ×1.4 on the word's centre line,
 * 4 mark units above the word, with the mark's lines and circles. */
function StackedPlate({ f }: { f: Format }) {
	const px = (u: number) => 110 + 9 * u;
	const py = (v: number) => 50 + 9 * v;
	const c = markConstruction(px(22.083), py(0), 12.6);
	return (
		<>
			<Frame
				levels={[0, 21, 26.6, 31.3, 43.3]}
				px={px}
				py={py}
				sides={[0, 22.083, 64.433, 86.52]}
			/>
			{c.edges.map((d, i) => (
				<Draw d={d} key={d} ms={200 + i * 40} stroke={GUIDE} width={0.75} />
			))}
			<Pop ms={420}>
				<path
					d={`M${px(43.258)} 0V500`}
					stroke={LINE}
					strokeDasharray={DASH_DOT}
					strokeWidth="1"
				/>
			</Pop>
			<g transform={`translate(${px(22.083)} ${py(0)}) scale(${1.4 * 9})`}>
				<Outline />
			</g>
			<path
				d={WORD}
				fill={INK}
				fillOpacity="0.08"
				stroke={INK}
				strokeWidth="1.5"
				transform={`translate(${px(-0.243)} ${py(43.3)}) scale(${22.059 * 9})`}
				vectorEffect="non-scaling-stroke"
			/>
			{c.circles.map((d, i) => (
				<Draw d={d} key={d} ms={460 + i * 60} stroke={INK} width={1} />
			))}
			<Contacts ms={720} points={c.tangents} scale={12.6} />
			<Draw d={hDim(px(22.083), px(64.433), 26)} ms={700} />
			<Draw d={vDim(px(73), py(21), py(26.6))} ms={760} />
			<Draw d={hDim(px(0), px(86.52), py(43.565) + 20)} ms={820} />
			<Measure ms={900} x={px(43.258) + 70} y={12}>
				{f(42.35)}
			</Measure>
			<Measure
				anchor="start"
				ms={960}
				strong
				x={px(73) + 16}
				y={(py(21) + py(26.6)) / 2}
			>
				{f(5.6)} = 4 × {f(1.4)}
			</Measure>
			<Measure ms={1000} x={px(43.258) + 70} y={py(43.565) + 38}>
				{f(86.52)}
			</Measure>
		</>
	);
}

/** The app icon at 0.78 a pixel: a 512 square, its diagonals and centre
 * lines, the mark 332.8 wide (65 %) on its own construction, and the corners
 * the system rounds. */
function IconPlate({ f, locale }: { f: Format; locale: string }) {
	const scale = 0.78;
	const px = (p: number) => 300.3 + scale * p;
	const py = (p: number) => 50 + scale * p;
	const share = new Intl.NumberFormat(locale, { style: "percent" }).format(
		0.65
	);
	const markScale = 11.001_65 * scale;
	const c = markConstruction(px(89.6), py(173.488), markScale);
	const corner = 0.23 * 512 * scale;
	const corners = [
		[px(0) + corner, py(0) + corner],
		[px(512) - corner, py(0) + corner],
		[px(512) - corner, py(512) - corner],
		[px(0) + corner, py(512) - corner],
	] as const;
	return (
		<>
			<rect
				fill={DARK}
				height={512 * scale}
				width={512 * scale}
				x={px(0)}
				y={py(0)}
			/>
			<g
				transform={`translate(${px(89.6)} ${py(173.488)}) scale(${markScale})`}
			>
				<Solid fill="#ffffff" />
			</g>
			<Draw
				d={`M${px(0)} ${py(0)}L${px(512)} ${py(512)}M${px(512)} ${py(0)}L${px(0)} ${py(512)}`}
				stroke={ON_DARK}
				width={1}
			/>
			{c.edges.map((d, i) => (
				<Draw d={d} key={d} ms={120 + i * 40} stroke={ON_DARK} width={0.75} />
			))}
			<Pop ms={300}>
				<path
					d={`M${px(256)} ${py(0)}V${py(512)}M${px(0)} ${py(256)}H${px(512)}`}
					stroke={ON_DARK}
					strokeDasharray={DASH_DOT}
					strokeWidth="1"
				/>
				<rect
					fill="none"
					height={165.02 * scale}
					stroke="#ffffff"
					strokeDasharray="6 6"
					strokeOpacity="0.45"
					strokeWidth="1.5"
					width={332.8 * scale}
					x={px(89.6)}
					y={py(173.488)}
				/>
			</Pop>
			{corners.map(([x, y], i) => (
				<Draw
					d={circle(x, y, corner)}
					key={`${x}-${y}`}
					ms={380 + i * 70}
					stroke={ON_DARK}
					width={0.75}
				/>
			))}
			{c.circles.map((d, i) => (
				<Draw d={d} key={d} ms={620 + i * 60} stroke={GUIDE} width={1} />
			))}
			<Draw d={hDim(px(0), px(512), 30)} ms={700} />
			<Draw d={hDim(px(89.6), px(422.4), py(512) + 22)} ms={760} />
			<Draw
				d={hDim(px(0), px(89.6), py(256) + 46)}
				ms={820}
				stroke="#ffffff"
				width={1.5}
			/>
			<Measure ms={900} x={px(256)} y={14}>
				512
			</Measure>
			<Measure ms={940} strong x={px(256)} y={py(512) + 40}>
				{f(332.8)} ({share})
			</Measure>
			<Measure
				fill="#ffffff"
				halo={DARK}
				ms={980}
				x={px(44.8)}
				y={py(256) + 66}
			>
				{f(89.6)}
			</Measure>
		</>
	);
}

function PlateDrawing({ label, plate }: { label: string; plate: PlateKey }) {
	const locale = useLocale();
	const f: Format = (value) => new Intl.NumberFormat(locale).format(value);
	const drawings: Record<PlateKey, ReactNode> = {
		sheet: <SheetPlate f={f} />,
		measures: <MeasuresPlate f={f} />,
		lockup: <LockupPlate f={f} />,
		stacked: <StackedPlate f={f} />,
		icon: <IconPlate f={f} locale={locale} />,
	};
	return (
		<svg
			aria-label={label}
			className="brand-stage-in h-auto w-full min-w-[600px]"
			key={plate}
			role="img"
			viewBox="0 0 1000 500"
			xmlns="http://www.w3.org/2000/svg"
		>
			{drawings[plate]}
		</svg>
	);
}

/** The construction as a set of plates, like the sheets of a technical
 * drawing. Picking a plate draws its lines in; the artwork never moves. */
export function ConstructionViewer({
	label,
	plates,
}: {
	label: string;
	plates: readonly Plate[];
}) {
	const [active, setActive] = useState<PlateKey>("sheet");
	const current = plates.find((plate) => plate.key === active) ?? plates[0];

	return (
		<div>
			<div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<Segmented label={label}>
					{plates.map((plate) => (
						<Option
							key={plate.key}
							onClick={() => setActive(plate.key)}
							selected={plate.key === active}
						>
							{plate.name}
						</Option>
					))}
				</Segmented>
			</div>
			<Tile className="mt-4 block overflow-x-auto p-4 md:p-8" ground="panel">
				<PlateDrawing label={current?.figure ?? ""} plate={active} />
			</Tile>
			<div aria-live="polite" className="brand-pop mt-6" key={active}>
				<div className="grid gap-3 lg:grid-cols-12 lg:gap-x-6">
					<H3 className="lg:col-span-5">{current?.title}</H3>
					<p className="max-w-[60ch] text-muted-foreground text-sm leading-6 lg:col-span-6 lg:col-start-7">
						{current?.text}
					</p>
				</div>
				{current?.points && (
					<ol className="mt-8 grid gap-x-6 border-grid-line border-t sm:grid-cols-2">
						{current.points.map(({ text, value }, i) => (
							<li
								className="brand-pop grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-grid-line border-b py-4 text-sm leading-6"
								key={text}
								style={after(80 + i * 50)}
							>
								<span className="font-display text-foreground tabular-nums">
									{value}
								</span>
								<span className="text-muted-foreground">{text}</span>
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}
