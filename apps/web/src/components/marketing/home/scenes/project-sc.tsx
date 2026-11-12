"use client";

import { type Act, Stage, Text, Window } from "@/components/stageshow/kit";
import "./project-sc.css";

// project card: Screencurve's character constellation, in the
// product's light look. Beats: the figures of the episode are there; their
// alliances draw in, then their conflicts; the pointer rests on the conflict
// between Marek and Ferretti and its timecode shows. Plays once.
//
// The figure is the product's own (the constellation from "Undertow"): the
// same initials, the solid ties for alliances and the dashed ones for
// conflicts. Real strings: the eyebrow, the legend, the name under the
// centre, the timecode (the one the hero's answer links to).

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

const N = {
	MV: [176, 84],
	AH: [340, 84],
	LF: [258, 99],
	ID: [196, 137],
	SL: [320, 137],
	AM: [258, 156],
	IB: [219, 201],
	TR: [296, 201],
	SO: [176, 226],
	KM: [340, 226],
} as const;
type Id = keyof typeof N;
const ORDER: Id[] = [
	"AM",
	"LF",
	"SL",
	"ID",
	"MV",
	"AH",
	"IB",
	"TR",
	"SO",
	"KM",
];
const ALLIANCES: [Id, Id, number?][] = [
	["MV", "ID", 10],
	["LF", "AH", -14],
	["AH", "SL", -10],
	["LF", "SL", -10],
	["AM", "SL"],
	["LF", "SO"],
	["TR", "KM"],
];
const CONFLICTS: [Id, Id, number?][] = [
	["MV", "LF"],
	["LF", "SL"],
	["ID", "AM"],
	["AM", "TR"],
	["IB", "TR", 12],
	["SO", "KM", 10],
];
const PROBE: [Id, Id] = ["LF", "AM"];

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
							{CONFLICTS.map(([a, b, bow], i) => (
								<path
									className="wps-clash"
									d={path(a, b, bow)}
									data-on={s.conflicts || undefined}
									key={`${a}${b}`}
									style={{ transitionDelay: `${i * 90}ms` }}
								/>
							))}
							<path
								className="wps-clash wps-clash--probe"
								d={path(...PROBE)}
								data-hot={s.probe || undefined}
								data-on={s.conflicts || undefined}
								style={{ transitionDelay: s.probe ? "0ms" : "540ms" }}
							/>
						</svg>

						{ORDER.map((id, i) => (
							<span
								className="wps-node"
								data-centre={id === "AM" || undefined}
								data-on={s.nodes || undefined}
								key={id}
								style={{
									left: N[id][0],
									top: N[id][1],
									transitionDelay: `${i * 70}ms`,
								}}
							>
								{id}
							</span>
						))}
						<Text className="wps-name" data-on={s.nodes || undefined}>
							Adrian Marek
						</Text>

						<span className="wps-edge" data-target="edge" />
						<span className="wps-tc" data-on={s.probe || undefined}>
							10:17:46
						</span>
					</div>
				</Window>
			)}
		</Stage>
	);
}
