"use client";

import { type Act, Stage, Text, Window } from "@/components/stageshow/kit";
import "./project-sc.css";

// project card: Screencurve's character constellation, in the
// product's light look. Beats: the figures of the film are there; their
// alliances draw in, then their conflict; the pointer rests on the conflict
// between Thom and Celia and its Timecode shows. Plays once.
//
// The figure is the product's own: the constellation of Tears of Steel from
// screencurve's analysis (`src/demo/tears-of-steel.ts`), laid out as the
// Characters chapter draws it, with the same initials (Celia and Captain
// both "C"), solid ties for alliances and a dashed one for the conflict.
// Old Thom and Tech head have no ties in the analysis. Real strings: the
// eyebrow, the legend, the name under the centre, the Timecode of the
// conflict.

type Locale = "de" | "en";
interface S {
	conflicts: boolean;
	nodes: boolean;
	probe: boolean;
	ties: boolean;
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

// The Characters chapter's ellipse, scaled into the card
const N = {
	T: [258, 155],
	OT: [222, 91],
	K: [294, 91],
	TH: [176, 139],
	B: [340, 139],
	D: [192, 199],
	CA: [324, 199],
	CE: [258, 226],
} as const;
type Id = keyof typeof N;
const LABEL: Record<Id, string> = {
	T: "T",
	OT: "OT",
	K: "K",
	TH: "TH",
	B: "B",
	D: "D",
	CA: "C",
	CE: "C",
};
const ORDER: Id[] = ["T", "K", "B", "CE", "CA", "D", "TH", "OT"];
const ALLIANCES: [Id, Id, number?][] = [
	["T", "B"],
	["T", "K"],
	["K", "B", -10],
	["CA", "D", -12],
];
// Thom and Celia, the analysis's one conflict: the pointer rests on it
const PROBE: [Id, Id] = ["T", "CE"];

// A straight tie, or a shallow arc when `bow` pushes its middle sideways
function path(a: Id, b: Id, bow = 0) {
	const [x1, y1] = N[a];
	const [x2, y2] = N[b];
	if (!bow) {
		return `M${x1} ${y1}L${x2} ${y2}`;
	}
	const mx = (x1 + x2) / 2;
	const my = (y1 + y2) / 2;
	const len = Math.hypot(x2 - x1, y2 - y1);
	return `M${x1} ${y1}Q${mx - ((y2 - y1) / len) * bow} ${my + ((x2 - x1) / len) * bow} ${x2} ${y2}`;
}

const initial: S = { nodes: true, ties: false, conflicts: false, probe: false };
const poster: S = { nodes: true, ties: true, conflicts: true, probe: true };

async function script(a: Act<S>) {
	await a.wait(1200);
	a.mark("alliances");
	a.put({ ties: true });
	await a.wait(1300);
	a.mark("conflicts");
	a.put({ conflicts: true });
	await a.wait(1200);
	a.mark("probe");
	await a.move("edge", { duration: 800 });
	a.put({ probe: true });
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

						<svg aria-hidden="true" className="wps-graph" viewBox="0 0 400 250">
							{ALLIANCES.map(([a, b, bow], i) => (
								<path
									className="wps-tie"
									d={path(a, b, bow)}
									data-on={s.ties || undefined}
									key={`${a}${b}`}
									pathLength={1}
									style={{ transitionDelay: `${i * 90}ms` }}
								/>
							))}
							<path
								className="wps-clash wps-clash--probe"
								d={path(...PROBE)}
								data-hot={s.probe || undefined}
								data-on={s.conflicts || undefined}
								style={{ transitionDelay: s.probe ? "0ms" : "90ms" }}
							/>
						</svg>

						{ORDER.map((id, i) => (
							<span
								className="wps-node"
								data-centre={id === "T" || undefined}
								data-on={s.nodes || undefined}
								key={id}
								style={{
									left: N[id][0],
									top: N[id][1],
									transitionDelay: `${i * 70}ms`,
								}}
							>
								{LABEL[id]}
							</span>
						))}
						<Text className="wps-name" data-on={s.nodes || undefined}>
							Thom
						</Text>

						<span className="wps-edge" data-target="edge" />
						<span className="wps-tc" data-on={s.probe || undefined}>
							00:00:25
						</span>
					</div>
				</Window>
			)}
		</Stage>
	);
}
