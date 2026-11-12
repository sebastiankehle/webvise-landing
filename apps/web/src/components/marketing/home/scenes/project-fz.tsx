"use client";

import {
	Building,
	Building2,
	House,
	Search,
	Check as Tick,
	Trees,
	Warehouse,
} from "lucide-react";
import {
	type Act,
	Bar,
	Collapse,
	Roll,
	Stage,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./project-fz.css";

// project card: the financing application of
// finanzierungszertifikat.com, the buyer's side, in its own look. Beats: the
// pointer picks the kind of property; the tile takes the selection; progress
// moves and the step count rolls; the next question arrives. Plays once.
//
// Real strings: the wordmark, the progress label, both questions, the six
// kinds of property, Zurück and Weiter. The application has ten steps; the
// scene shows the first.

interface S {
	next: boolean;
	picked: boolean;
}

const KINDS = [
	{ label: "Haus", icon: House },
	{ label: "Reihenhaus", icon: Warehouse },
	{ label: "Eigentumswohnung", icon: Building },
	{ label: "Grundstück", icon: Trees },
	{ label: "Mehrfamilienhaus", icon: Building2 },
	{ label: "Noch auf Suche", icon: Search },
];
const PICK = 2;

const initial: S = { picked: false, next: false };
const poster: S = { picked: true, next: true };

async function script(a: Act<S>) {
	await a.wait(1200);
	a.mark("pick");
	await a.move({ at: "pick", x: 0.7, y: 0.72 });
	await a.wait(220);
	await a.click({ at: "pick", x: 0.7, y: 0.72 });
	a.put({ picked: true });
	await a.wait(1100);
	a.mark("next");
	a.put({ next: true });
	await a.move("rest", { duration: 700 });
	await a.wait(2400);
}

export default function FzScene() {
	return (
		<Stage<S>
			className="wpf"
			cursor={{ at: { x: 330, y: 214 } }}
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => (
				<>
					<Window className="wpf-win" url="finanzierungszertifikat.com">
						<div className="wpf-page">
							<div className="wpf-progress">
								<div className="wpf-progress-head">
									<Text className="wpf-faint">Fortschritt Ihrer Anfrage</Text>
									<span className="wpf-pct">
										<Roll delay={150}>{s.picked ? "10 %" : "0 %"}</Roll>
									</span>
								</div>
								<div className="wpf-track">
									<span className="wpf-fill" data-on={s.picked || undefined} />
								</div>
							</div>

							<Collapse open={!s.next}>
								<div className="wpf-step">
									<Text className="wpf-q">
										Welche Immobilie möchten Sie finanzieren?
									</Text>
									<div className="wpf-tiles">
										{KINDS.map((kind, i) => (
											<span
												className="wpf-tile"
												data-cursor={i === PICK ? "pointer" : undefined}
												data-on={(i === PICK && s.picked) || undefined}
												data-target={i === PICK ? "pick" : undefined}
												key={kind.label}
											>
												<kind.icon size={14} strokeWidth={1.6} />
												<Text>{kind.label}</Text>
												{i === PICK && (
													<span
														className="wpf-tick"
														data-on={s.picked || undefined}
													>
														<Tick size={9} strokeWidth={3} />
													</span>
												)}
											</span>
										))}
									</div>
								</div>
							</Collapse>
							<Collapse from="below" open={s.next} reveal="drop">
								<div className="wpf-step">
									<Text className="wpf-q">
										Möchten Sie wissen, welcher Kaufpreis zu Ihnen passt?
									</Text>
									<div className="wpf-tiles wpf-tiles--two">
										<span className="wpf-tile wpf-tile--tall">
											<Bar h={6} tone={3} w={46} />
										</span>
										<span className="wpf-tile wpf-tile--tall">
											<Bar h={6} tone={3} w={58} />
										</span>
									</div>
									<div className="wpf-nav">
										<span className="wpf-back">Zurück</span>
										<span className="wpf-go">Weiter</span>
									</div>
								</div>
							</Collapse>
							<span className="wpf-rest" data-target="rest" />
						</div>
					</Window>

					<div className="wpf-count">
						<Text className="wpf-faint">Schritt</Text>
						<span className="wpf-count-n">
							<Roll delay={250}>{s.next ? "2" : "1"}</Roll>
							<span className="wpf-count-of">/ 10</span>
						</span>
					</div>
				</>
			)}
		</Stage>
	);
}
