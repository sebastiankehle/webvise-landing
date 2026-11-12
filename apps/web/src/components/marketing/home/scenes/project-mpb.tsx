"use client";

import { Download, FileText, Check as Tick } from "lucide-react";
import {
	type Act,
	Bar,
	Roll,
	Stage,
	Text,
	Toast,
	Window,
} from "@/components/stageshow/kit";
import "./project-mpb.css";

// project card: the internal portal of Märkische Projekt Bau,
// where an agent turns a tender PDF into a GAEB D83 file. Beats: the tender
// is in; its positions arrive one by one and the count follows; the download
// comes alive; the pointer takes the file, and it lands. Plays once.
//
// Real strings (the portal's own example): the file's name, the table's
// title and heads, the group, three positions with quantity and unit, the
// count and the button. The saved file shows where a browser shows it,
// under the address bar, over chrome only.

interface S {
	rows: number;
	saved: boolean;
}

const FILE = "Fassadensanierung_Beispiel";
const ROWS = [
	{ oz: "01", text: "Fassadenarbeiten", group: true },
	{ oz: "01001", text: "Schutz- und Abdeckarbeiten", qty: "45", unit: "qm" },
	{ oz: "01002", text: "Fassadenflächen reinigen", qty: "180", unit: "qm" },
	{ oz: "01003", text: "Putzfehlstellen ausbessern", qty: "24", unit: "qm" },
] as const;
const TOTAL = 6; // the group, then five positions; the last two are below the crop

const initial: S = { rows: 0, saved: false };
const poster: S = { rows: TOTAL, saved: true };

async function script(a: Act<S>) {
	await a.wait(1100);
	a.mark("read");
	for (let i = 1; i <= TOTAL; i++) {
		a.put({ rows: i });
		await a.wait(i === 1 ? 420 : 340);
	}
	await a.wait(500);
	a.mark("take");
	await a.move({ at: "get", x: 0.78, y: 0.72 });
	await a.wait(200);
	await a.click({ at: "get", x: 0.78, y: 0.72 });
	a.put({ saved: true });
	await a.move("rest", { duration: 700 });
	await a.wait(2400);
}

export default function MpbScene() {
	return (
		<Stage<S>
			className="wpm"
			cursor={{ at: { x: 318, y: 208 } }}
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => {
				const found = Math.max(0, s.rows - 1);
				const done = s.rows >= TOTAL;
				return (
					<>
						<Window className="wpm-win" url="maerkischeprojekt.de">
							<div className="wpm-page">
								<div className="wpm-top">
									<span className="wpm-file">
										<FileText size={12} strokeWidth={1.7} />
										<Text>{`${FILE}.pdf`}</Text>
									</span>
									<span
										className="wpm-get"
										data-cursor="pointer"
										data-on={done || undefined}
										data-target="get"
									>
										<Download size={12} strokeWidth={2} />
										d83 herunterladen
									</span>
								</div>

								<div className="wpm-card">
									<div className="wpm-card-head">
										<Text className="wpm-title">Positionsvorschau</Text>
										<span className="wpm-count" data-on={done || undefined}>
											<span className="wpm-count-tick">
												<Tick size={8} strokeWidth={3.2} />
											</span>
											<Roll>{`${found}`}</Roll>
											<Text className="wpm-count-label">
												{found === 1
													? "Position erkannt"
													: "Positionen erkannt"}
											</Text>
										</span>
									</div>
									<div className="wpm-cols wpm-head">
										<Text>OZ</Text>
										<Text>Kurztext</Text>
										<Text className="wpm-num">Menge</Text>
										<Text>Einheit</Text>
									</div>
									{/* Each row is there from the start as placeholder lines and
                      resolves into its position as the agent reads it */}
									{ROWS.map((row, i) => (
										<div
											className="wpm-slot"
											data-group={"group" in row || undefined}
											data-on={s.rows > i || undefined}
											key={row.oz}
										>
											<div className="wpm-cols wpm-row wpm-ghost">
												<Bar tone={2} w={"group" in row ? 14 : 30} />
												<Bar tone={2} w={[92, 138, 124, 132][i]} />
												{"group" in row ? (
													<span />
												) : (
													<Bar className="wpm-num" tone={1} w={16} />
												)}
												{"group" in row ? <span /> : <Bar tone={1} w={14} />}
											</div>
											<div className="wpm-cols wpm-row wpm-real">
												<Text className="wpm-oz">{row.oz}</Text>
												<Text className="wpm-text">{row.text}</Text>
												<Text className="wpm-num">
													{"qty" in row ? row.qty : ""}
												</Text>
												<Text className="wpm-unit">
													{"unit" in row ? row.unit : ""}
												</Text>
											</div>
										</div>
									))}
								</div>
								<span className="wpm-rest" data-target="rest" />
							</div>
						</Window>

						<Toast
							className="wpm-saved"
							icon={
								<span className="wpm-saved-tick">
									<Tick size={9} strokeWidth={3} />
								</span>
							}
							show={s.saved}
						>
							{FILE}.d83
						</Toast>
					</>
				);
			}}
		</Stage>
	);
}
