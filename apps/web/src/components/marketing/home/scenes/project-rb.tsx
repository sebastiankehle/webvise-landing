"use client";

import { FileText } from "lucide-react";
import {
	type Act,
	Caret,
	Check,
	Collapse,
	Prompt,
	Stage,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./project-rb.css";

// project card: the research studio built for a documentary
// producer, a Claude Code session over one Obsidian vault. Beats: Claude Code
// starts in the vault; three research agents run side by side and tick one
// after another; the pipeline reaches its last phase; the exposé lands as a
// DOCX. No pointer: this is what the system does. Plays once.
//
// Real: the vault's name, the three things the agents research (sources,
// experts, gaps in the channel's portfolio), the ten phases, the DOCX export
// and "under three hours" from the case study.

type Locale = "de" | "en";
interface S {
	done: number;
	file: boolean;
	phase: number;
	typed: string;
}

const COPY = {
	en: {
		research: "Research",
		agents: ["Sources", "Experts", "Portfolio gaps"],
		exportStep: "Export",
		kind: "Exposé, in the house design",
		time: "Idea to exposé",
	},
	de: {
		research: "Recherche",
		agents: ["Quellen", "Experten", "Portfolio-Lücken"],
		exportStep: "Export",
		kind: "Exposé im Hausdesign",
		time: "Idee bis Exposé",
	},
} as const;

const initial: S = { typed: "", phase: 0, done: 0, file: false };
const poster: S = { typed: "claude", phase: 2, done: 3, file: true };

async function script(a: Act<S>) {
	await a.wait(900);
	a.mark("start");
	await a.type("typed", "claude", { interval: 80 });
	await a.wait(450);
	a.mark("research");
	a.put({ phase: 1 });
	await a.wait(1100);
	for (let i = 1; i <= 3; i++) {
		a.put({ done: i });
		await a.wait(520);
	}
	await a.wait(300);
	a.mark("export");
	a.put({ phase: 2 });
	await a.wait(800);
	a.put({ file: true });
	await a.wait(2800);
}

export default function RbScene({ locale }: { locale: Locale }) {
	const t = COPY[locale];
	return (
		<Stage<S>
			className="wpr"
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
					<Window
						chrome="terminal"
						className="wpr-win"
						title="hieronymus-vault"
					>
						<div className="wpr-term">
							<Prompt path="~/hieronymus-vault">
								{s.typed}
								{s.phase === 0 && <Caret />}
							</Prompt>
							<Collapse open={s.phase >= 1}>
								<div className="wpr-phase">
									<span className="dim">Phase 4/10</span> {t.research}
								</div>
								{t.agents.map((agent, i) => (
									<div
										className="wpr-agent"
										data-done={s.done > i || undefined}
										key={agent}
									>
										<Check on={s.done > i} pending={s.done <= i} size={11} />
										<Text>{agent}</Text>
									</div>
								))}
							</Collapse>
							<Collapse open={s.phase >= 2}>
								<div className="wpr-phase">
									<span className="dim">Phase 10/10</span> {t.exportStep}
								</div>
								<div className="wpr-agent" data-done={s.file || undefined}>
									<Check on={s.file} pending={!s.file} size={11} />
									<Text>expose.docx</Text>
								</div>
							</Collapse>
						</div>
					</Window>

					<div className="wpr-time">
						<Text className="wpr-time-label">{t.time}</Text>
						<span className="wpr-time-n">&lt; 3 h</span>
					</div>

					<div className="wpr-file" data-on={s.file || undefined}>
						<span className="wpr-file-icon">
							<FileText size={14} strokeWidth={1.6} />
						</span>
						<div className="wpr-file-text">
							<Text className="wpr-file-name">Exposé.docx</Text>
							<Text className="wpr-file-kind">{t.kind}</Text>
						</div>
					</div>
				</>
			)}
		</Stage>
	);
}
