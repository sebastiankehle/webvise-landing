"use client";

import { type Act, Stage, Text, Window } from "@/components/stageshow/kit";
import { versioned } from "@/data/asset-version";
import { screencurveType } from "./screencurve-type";
import "./project-sc.css";

// project card: Screencurve's character constellation, in the product's
// look. Beats: the three figures of the film are there; the tie between
// Birgitta and P-O draws and its Timecode arrives; then the tie between
// Birgitta and Lennart; the pointer opens the first Timecode, which lights up
// and brings its frame: the couple at their kitchen table. Plays once.
//
// The figure is the product's own: the constellation of The Car Spotter
// from screencurve's analysis (export "The Car Spotter (Ohne Abspann)"),
// drawn as the product draws it: the figure with the most ties as a solid
// disc at the top, the other two as tinted discs on one line below, straight
// ties with their kind on the line, and the product's monograms. Both ties
// are alliances, listed beside the figure with the Timecodes the analysis
// gives them. Only the three figures the film has are drawn; the export's
// fourth is a duplicate the analysis invented. The frame is the first picture
// of 00:01:49 and shows what the tie says: a married couple side by side,
// each busy with their own thing.

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
	},
	de: {
		eyebrow: "Figurenkonstellation",
		alliance: "Allianz",
	},
} as const;

// The product's triangle, fitted into the card: Birgitta leads at the top,
// her name beside her; the other two stand below, each over its name
const N = {
	B: { at: [290, 104], name: "Birgitta", label: "beside" },
	P: { at: [230, 176], name: "P-O", label: "below" },
	L: { at: [350, 176], name: "Lennart", label: "below" },
} as const;
type Id = keyof typeof N;
const ORDER: Id[] = ["B", "P", "L"];

/** The analysis's ties, in the order they draw, each with its Timecode. */
const TIES: { a: Id; b: Id; tc: string }[] = [
	{ a: "B", b: "P", tc: "00:01:49" },
	{ a: "B", b: "L", tc: "00:02:46" },
];

const FRAME = versioned(
	"/images/case-studies/screencurve/car-spotter/00109.webp"
);

const SEPARATORS = /[\s-]+/;

/** The product's monogram: the first letters of a name, two at most. */
function monogram(name: string) {
	return name
		.split(SEPARATORS)
		.map((word) => word.charAt(0))
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

/** The middle of a tie, where its kind sits on the line. */
function middle(a: Id, b: Id) {
	return {
		left: (N[a].at[0] + N[b].at[0]) / 2,
		top: (N[a].at[1] + N[b].at[1]) / 2,
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
			className={`wps ${screencurveType}`}
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
						{/* The ties as the product lists them: Timecode, then who */}
						<div className="wps-copy">
							<Text className="wps-eyebrow">{t.eyebrow}</Text>
							{TIES.map((tie, i) => (
								<span
									className="wps-row"
									data-on={s.ties > i || undefined}
									key={tie.tc}
								>
									<span
										className="wps-tc"
										data-cursor={i === 0 ? "pointer" : undefined}
										data-lit={(i === 0 && s.open) || undefined}
										data-target={`tie${i}`}
									>
										{tie.tc}
									</span>
									<Text>{`${N[tie.a].name} ↔ ${N[tie.b].name}`}</Text>
								</span>
							))}
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
									d={`M${N[tie.a].at.join(" ")}L${N[tie.b].at.join(" ")}`}
									data-hot={(i === 0 && s.open) || undefined}
									data-on={s.ties > i || undefined}
									key={tie.tc}
									pathLength={1}
								/>
							))}
						</svg>

						{TIES.map((tie, i) => (
							<Text
								className="wps-kind"
								data-on={s.ties > i || undefined}
								key={tie.tc}
								style={middle(tie.a, tie.b)}
							>
								{t.alliance}
							</Text>
						))}

						{ORDER.map((id, i) => (
							<span
								className="wps-node"
								data-lead={id === "B" || undefined}
								data-on={s.nodes || undefined}
								key={id}
								style={{
									left: N[id].at[0],
									top: N[id].at[1],
									transitionDelay: `${i * 90}ms`,
								}}
							>
								{monogram(N[id].name)}
								<Text className="wps-name" data-at={N[id].label}>
									{N[id].name}
								</Text>
							</span>
						))}
					</div>
				</Window>
			)}
		</Stage>
	);
}
