"use client";

import { type Act, Stage, Text, Window } from "@/components/stageshow/kit";
import { versioned } from "@/data/asset-version";
import "./project-sc.css";

// project card: Screencurve's character constellation, in the product's
// light look. Beats: the three figures of the film are there; the tie
// between Birgitta and P-O draws, its Timecode arrives; then the tie between
// Birgitta and Lennart; the pointer opens the first Timecode, which lights up
// and brings its frame: the couple at their kitchen table. Plays once.
//
// The figure is the product's own: the constellation of The Car Spotter
// from screencurve's analysis (export "The Car Spotter (Ohne Abspann)"),
// laid out as the Characters chapter draws it, with the busiest figure at
// the centre and the product's initials. Both ties are alliances, with the
// Timecodes the analysis gives them. Only the three figures the film has are
// drawn; the export's fourth is a duplicate the analysis invented. The frame
// is the first picture of 00:01:49 and shows what the tie says: a married
// couple side by side, each busy with their own thing.

type Locale = "de" | "en";
interface S {
	nodes: boolean;
	open: boolean;
	ties: number;
}

const COPY = {
	en: {
		eyebrow: "Character constellation",
		alliance: "Alliance",
		conflict: "Conflict",
	},
	de: {
		eyebrow: "Figurenkonstellation",
		alliance: "Allianz",
		conflict: "Konflikt",
	},
} as const;

// The Characters chapter's layout, fitted into the card: Birgitta leads,
// the other two sit on the ring below her
const N = {
	B: { at: [282, 128], name: "Birgitta", label: "above" },
	P: { at: [202, 190], name: "P-O", label: "below" },
	L: { at: [352, 196], name: "Lennart", label: "below" },
} as const;
type Id = keyof typeof N;
const ORDER: Id[] = ["B", "P", "L"];

/** The analysis's ties, in the order they draw, each with its Timecode. */
const TIES: { a: Id; b: Id; bow: number; tc: string }[] = [
	{ a: "B", b: "P", bow: 12, tc: "00:01:49" },
	{ a: "B", b: "L", bow: -12, tc: "00:02:46" },
];

const FRAME = versioned(
	"/images/case-studies/screencurve/car-spotter/00109.webp"
);

/** The product's monogram: the first letter of the first and last word. */
function initials(name: string) {
	const parts = name.trim().split(" ");
	return (
		(parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")
	).toUpperCase();
}

// A tie as a shallow arc: `bow` pushes its control point sideways
function control(a: Id, b: Id, bow: number) {
	const [x1, y1] = N[a].at;
	const [x2, y2] = N[b].at;
	const len = Math.hypot(x2 - x1, y2 - y1);
	return [
		(x1 + x2) / 2 - ((y2 - y1) / len) * bow,
		(y1 + y2) / 2 + ((x2 - x1) / len) * bow,
	];
}

function path(a: Id, b: Id, bow: number) {
	const [cx, cy] = control(a, b, bow);
	return `M${N[a].at.join(" ")}Q${cx} ${cy} ${N[b].at.join(" ")}`;
}

/** The middle of the arc, where the tie's Timecode sits on the line. */
function middle(a: Id, b: Id, bow: number) {
	const [cx, cy] = control(a, b, bow);
	return {
		left: (N[a].at[0] + 2 * cx + N[b].at[0]) / 4,
		top: (N[a].at[1] + 2 * cy + N[b].at[1]) / 4,
	};
}

const initial: S = { nodes: true, ties: 0, open: false };
const poster: S = { nodes: true, ties: 2, open: true };

async function script(a: Act<S>) {
	await a.wait(1000);
	a.mark("ties");
	a.put({ ties: 1 });
	await a.wait(1100);
	a.put({ ties: 2 });
	await a.wait(1200);
	a.mark("open");
	await a.move({ at: "tie0", x: 0.5, y: 0.6 }, { duration: 800 });
	await a.wait(160);
	await a.click({ at: "tie0", x: 0.5, y: 0.6 });
	a.put({ open: true });
	await a.wait(2800);
}

export default function ScScene({ locale }: { locale: Locale }) {
	const t = COPY[locale];
	return (
		<Stage<S>
			className="wps"
			cursor={{ at: { x: 118, y: 196 } }}
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => (
				<Window className="wps-win" url="screencurve.com">
					<div className="wps-page">
						<div className="wps-copy">
							<Text className="wps-eyebrow">{t.eyebrow}</Text>
							<span className="wps-key">
								<i className="wps-line" />
								<Text>{t.alliance}</Text>
							</span>
							<span className="wps-key">
								<i className="wps-line wps-line--dash" />
								<Text>{t.conflict}</Text>
							</span>
						</div>

						{/* The opened tie: its frame and its figures */}
						<figure className="wps-frame" data-on={s.open || undefined}>
							<img alt="" src={FRAME} />
							<figcaption>
								<span className="wps-frame-tc">{TIES[0].tc}</span>
								<Text>{`${N.B.name} · ${N.P.name}`}</Text>
							</figcaption>
						</figure>

						<svg aria-hidden="true" className="wps-graph" viewBox="0 0 400 250">
							{TIES.map((tie, i) => (
								<path
									className="wps-tie"
									d={path(tie.a, tie.b, tie.bow)}
									data-hot={(i === 0 && s.open) || undefined}
									data-on={s.ties > i || undefined}
									key={tie.tc}
									pathLength={1}
								/>
							))}
						</svg>

						{ORDER.map((id, i) => (
							<span
								className="wps-node"
								data-centre={id === "B" || undefined}
								data-on={s.nodes || undefined}
								key={id}
								style={{
									left: N[id].at[0],
									top: N[id].at[1],
									transitionDelay: `${i * 90}ms`,
								}}
							>
								{initials(N[id].name)}
								<Text className="wps-name" data-at={N[id].label}>
									{N[id].name}
								</Text>
							</span>
						))}

						{TIES.map((tie, i) => (
							<span
								className="wps-tc"
								data-cursor={i === 0 ? "pointer" : undefined}
								data-lit={(i === 0 && s.open) || undefined}
								data-on={s.ties > i || undefined}
								data-target={`tie${i}`}
								key={tie.tc}
								style={middle(tie.a, tie.b, tie.bow)}
							>
								{tie.tc}
							</span>
						))}
					</div>
				</Window>
			)}
		</Stage>
	);
}
