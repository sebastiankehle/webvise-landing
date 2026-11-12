"use client";

import { FileText } from "lucide-react";
import { type Act, Bar, Stage, Text, Window } from "@/components/stageshow/kit";
import "./case-mpb-takeoff.css";

// case study: the second in-house agent of Märkische Projekt Bau,
// the quantity takeoff ("Massenermittlung") from plan PDFs. Beats: the plans
// are in; the takeoff resolves row by row, each quantity with the sum it
// came from; the one assumption is marked for the estimator. No pointer.
//
// Real: the tool's name, the three kinds of plan it reads, its columns
// (Pos, Leistung, Menge, Einheit, Herleitung) and its rule that assumptions
// are marked "ANNAHME". The rows are an example built from the tool's own
// schema: 12,75 x 8,00 m with a metre of working space each side.

interface S {
	rows: number;
}

const PLANS = ["Grundriss", "Schnitte", "Ansichten"];
const ROWS = [
	{ section: "01 ERDARBEITEN" },
	{
		pos: "1.1",
		text: "Oberboden abtragen",
		qty: "148",
		unit: "m2",
		from: "(12,75+2,0) x (8,00+2,0)",
	},
	{
		pos: "1.2",
		text: "Baugrube ausheben",
		qty: "74",
		unit: "m3",
		from: "148 x 0,50",
		note: "ANNAHME",
	},
	{ section: "02 ROHBAU" },
	{
		pos: "2.1",
		text: "Bodenplatte",
		qty: "102",
		unit: "m2",
		from: "12,75 x 8,00",
	},
] as const;

const initial: S = { rows: 0 };
const poster: S = { rows: ROWS.length };

async function script(a: Act<S>) {
	await a.wait(1100);
	a.mark("read");
	for (let i = 1; i <= ROWS.length; i++) {
		a.put({ rows: i });
		await a.wait(480);
	}
	await a.wait(2600);
}

export default function TakeoffScene() {
	return (
		<Stage<S>
			className="wct"
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => (
				<Window className="wct-win" url="maerkischeprojekt.de">
					<div className="wct-page">
						<div className="wct-top">
							<Text className="wct-title">Massenermittlung</Text>
							<div className="wct-plans">
								{PLANS.map((plan) => (
									<span className="wct-plan" key={plan}>
										<FileText size={10} strokeWidth={1.8} />
										{plan}
									</span>
								))}
							</div>
						</div>
						<div className="wct-card">
							<div className="wct-cols wct-head">
								<Text>Pos</Text>
								<Text>Leistung</Text>
								<Text className="wct-num">Menge</Text>
								<Text>Einh.</Text>
								<Text>Herleitung</Text>
							</div>
							{ROWS.map((row, i) => (
								<div
									className="wct-slot"
									data-on={s.rows > i || undefined}
									data-section={"section" in row || undefined}
									key={"section" in row ? row.section : row.pos}
								>
									<div className="wct-cols wct-row wct-ghost">
										<Bar tone={2} w={14} />
										<Bar tone={2} w={[70, 96, 88, 60, 64][i]} />
										{"section" in row ? (
											<span />
										) : (
											<Bar className="wct-num" tone={1} w={16} />
										)}
										{"section" in row ? <span /> : <Bar tone={1} w={12} />}
										{"section" in row ? (
											<span />
										) : (
											<Bar tone={1} w={[0, 92, 50, 0, 58][i]} />
										)}
									</div>
									{"section" in row ? (
										<div className="wct-row wct-real wct-section">
											{row.section}
										</div>
									) : (
										<div className="wct-cols wct-row wct-real">
											<span className="wct-pos">{row.pos}</span>
											<Text>{row.text}</Text>
											<span className="wct-num">{row.qty}</span>
											<span className="wct-unit">{row.unit}</span>
											<span className="wct-from">
												{row.from}
												{"note" in row && (
													<span className="wct-note">{row.note}</span>
												)}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</Window>
			)}
		</Stage>
	);
}
