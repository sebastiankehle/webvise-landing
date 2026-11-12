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
import type { ComponentType } from "react";
import {
	type Act,
	Collapse,
	Roll,
	Stage,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./project-fz.css";

// project card: the financing application of finanzierungszertifikat.com,
// the buyer's side, in its own look. Beats: the pointer answers three
// questions in turn, each answer moving the progress and the step count on;
// on the fourth it types the household income. Plays once.
//
// Real strings: the wordmark, the progress label, the four questions in the
// order the application asks them, their answers, the income field's label,
// Monatlich and Jährlich, Zurück and Weiter. The application has ten steps;
// the scene shows the first four.

interface Choice {
	icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
	label: string;
}

interface S {
	done: number;
	income: string;
	step: number;
}

const STEPS: { choices: Choice[]; pick: number; question: string }[] = [
	{
		question: "Welche Immobilie möchten Sie finanzieren?",
		pick: 2,
		choices: [
			{ label: "Haus", icon: House },
			{ label: "Reihenhaus", icon: Warehouse },
			{ label: "Eigentumswohnung", icon: Building },
			{ label: "Grundstück", icon: Trees },
			{ label: "Mehrfamilienhaus", icon: Building2 },
			{ label: "Noch auf Suche", icon: Search },
		],
	},
	{
		question: "Möchten Sie wissen, welcher Kaufpreis zu Ihnen passt?",
		pick: 0,
		choices: [{ label: "Ja" }, { label: "Nein" }],
	},
	{
		question: "Berufliche Stellung",
		pick: 0,
		choices: [
			{ label: "Angestellt" },
			{ label: "Selbstständig" },
			{ label: "Freiberuflich" },
			{ label: "Beamter" },
		],
	},
];
const INCOME = "3.800";
const TOTAL = 10;

const initial: S = { done: 0, income: "", step: 1 };
const poster: S = { done: 3, income: INCOME, step: 4 };

async function script(a: Act<S>) {
	await a.wait(1000);
	for (let i = 0; i < STEPS.length; i++) {
		a.mark(`step-${i + 1}`);
		await a.move({ at: `pick-${i}`, x: 0.7, y: 0.6 });
		await a.wait(180);
		await a.click({ at: `pick-${i}`, x: 0.7, y: 0.6 });
		a.put({ done: i + 1 });
		await a.wait(650);
		a.put({ step: i + 2 });
		await a.wait(550);
	}
	a.mark("income");
	await a.move({ at: "income", x: 0.3, y: 0.5 });
	await a.wait(150);
	await a.click({ at: "income", x: 0.3, y: 0.5 });
	await a.type("income", INCOME, { interval: 120 });
	await a.wait(300);
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
										<Roll delay={150}>{`${s.done * 10} %`}</Roll>
									</span>
								</div>
								<div className="wpf-track">
									<span
										className="wpf-fill"
										style={{ width: `${s.done * 10}%` }}
									/>
								</div>
							</div>

							{STEPS.map((step, n) => (
								<Collapse
									from={n === 0 ? undefined : "below"}
									key={step.question}
									open={s.step === n + 1}
									reveal={n === 0 ? undefined : "drop"}
								>
									<div className="wpf-step">
										<Text className="wpf-q">{step.question}</Text>
										<div
											className={
												step.choices.length === 2
													? "wpf-tiles wpf-tiles--two"
													: "wpf-tiles"
											}
										>
											{step.choices.map((choice, i) => {
												const picked = i === step.pick;
												return (
													<span
														className={
															step.choices.length === 2
																? "wpf-tile wpf-tile--tall"
																: "wpf-tile"
														}
														data-cursor={picked ? "pointer" : undefined}
														data-on={(picked && s.done > n) || undefined}
														data-target={picked ? `pick-${n}` : undefined}
														key={choice.label}
													>
														{choice.icon && (
															<choice.icon size={14} strokeWidth={1.6} />
														)}
														<Text>{choice.label}</Text>
														{picked && (
															<span
																className="wpf-tick"
																data-on={s.done > n || undefined}
															>
																<Tick size={9} strokeWidth={3} />
															</span>
														)}
													</span>
												);
											})}
										</div>
									</div>
								</Collapse>
							))}

							<Collapse from="below" open={s.step === 4} reveal="drop">
								<div className="wpf-step">
									<Text className="wpf-q">Haushaltsnettoeinkommen</Text>
									<div className="wpf-seg">
										<span className="wpf-seg-on">Monatlich</span>
										<span>Jährlich</span>
									</div>
									<Text className="wpf-faint wpf-label">
										Monatliches Haushaltsnettoeinkommen
									</Text>
									<span
										className="wpf-field"
										data-cursor="ibeam"
										data-on={s.income.length > 0 || undefined}
										data-target="income"
									>
										<span className="wpf-value">{s.income}</span>
										<span className="wpf-caret" />
										<span className="wpf-unit">€</span>
									</span>
									<div className="wpf-nav">
										<span className="wpf-back">Zurück</span>
										<span
											className="wpf-go"
											data-on={s.income.length > 0 || undefined}
										>
											Weiter
										</span>
									</div>
								</div>
							</Collapse>
							<span className="wpf-rest" data-target="rest" />
						</div>
					</Window>

					<div className="wpf-count">
						<Text className="wpf-faint">Schritt</Text>
						<span className="wpf-count-n">
							<Roll delay={250}>{`${s.step}`}</Roll>
							<span className="wpf-count-of">/ {TOTAL}</span>
						</span>
					</div>
				</>
			)}
		</Stage>
	);
}
