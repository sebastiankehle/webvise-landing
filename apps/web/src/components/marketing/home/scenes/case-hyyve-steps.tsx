"use client";

import {
	type Act,
	Check,
	Stage,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./case-hyyve-steps.css";

// project card: Hyyve's "from source to scoped memory in four
// steps", in the product's dark look. Beats: Extract is the step at work;
// its three tasks run and tick one after another; the owner is assigned;
// the step is done and Review takes over. No pointer: this is what the
// system does. Plays once.
//
// Real strings (the site's own section): the eyebrow, the four steps, the
// three tasks with their lines, "Running" and "Owner assigned".

interface S {
	next: boolean;
	run: number;
}

const STEPS = ["Capture", "Extract", "Review", "Scope"];
const TASKS = [
	{
		title: "Split into memory cards",
		line: "One decision, fact, or rule per card",
	},
	{ title: "Assign an owner", line: "Someone accountable for each card" },
	{ title: "Tag type and sector", line: "So it can be scoped later" },
];

const initial: S = { run: -1, next: false };
const poster: S = { run: 3, next: true };

async function script(a: Act<S>) {
	await a.wait(1000);
	a.mark("run");
	for (let i = 0; i < TASKS.length; i++) {
		a.put({ run: i });
		await a.wait(1500);
	}
	a.mark("done");
	a.put({ run: TASKS.length });
	await a.wait(800);
	a.mark("next");
	a.put({ next: true });
	await a.wait(2600);
}

export default function HyyveStepsScene() {
	return (
		<Stage<S>
			className="wph"
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			theme="dark"
			width={400}
		>
			{(s) => {
				const active = s.next ? 2 : 1;
				return (
					<Window className="wph-win" title="hyyve">
						<div className="wph-page">
							<div className="wph-steps">
								<Text className="wph-eyebrow"># How it works</Text>
								{STEPS.map((step, i) => (
									<div
										className="wph-step"
										data-done={i < active || undefined}
										data-on={i === active || undefined}
										key={step}
									>
										<span className="wph-no">{`0${i + 1}`}</span>
										<Text>{step}</Text>
									</div>
								))}
								<span className="wph-owner" data-on={s.run >= 2 || undefined}>
									Owner assigned
								</span>
							</div>

							<div className="wph-tasks">
								{TASKS.map((task, i) => (
									<div
										className="wph-task"
										data-done={s.run > i || undefined}
										data-run={s.run === i || undefined}
										key={task.title}
									>
										<Check on={s.run > i} pending={s.run === i} size={13} />
										<div className="wph-task-text">
											<Text className="wph-task-title">{task.title}</Text>
											<Text className="wph-task-line">{task.line}</Text>
										</div>
										<span className="wph-running">Running</span>
										<span className="wph-bar" />
									</div>
								))}
							</div>
						</div>
					</Window>
				);
			}}
		</Stage>
	);
}
