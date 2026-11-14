"use client";

import {
	type Act,
	Bar,
	Collapse,
	Icon,
	Roll,
	Stage,
	Stream,
	Text,
} from "@/components/stageshow/kit";
import "./hero-scene.css";

const frames = "/images/case-studies/screencurve/tears-of-steel";

// Screencurve's "Ask the Film" at work on Tears of Steel, in the product's
// own dark look. Beats: the pointer types a question into the composer and
// asks it; a short Thinking; the answer streams in with its Timecode; the
// pointer opens the Timecode and the player jumps to that frame, the readout
// rolling to match. Plays once; the still is the payoff.
//
// What makes it read as the product:
// - The labels follow the product's message files in both languages, and the
//   chrome is the redesigned one: Overview, Formatbibel and Ask the Film, then
//   the Understand, Check and Put to work groups.
// - Both exchanges come from the product's analysis of Tears of Steel
//   (screencurve `src/demo/tears-of-steel.ts`, pairs 0 and 4 of the chat),
//   shortened; the English is a translation. The stills are that analysis's
//   key frames, and each Timecode lands on a still that shows what the
//   answer names. The suggestions stay unused: the run never asked them.
// - The answer grows in place (Stream) and the thread moves as one.
// - The hero frame around it is the window: no second chrome inside.
//
// Narrow, it is a second design: the frame as a strip, the question and the
// answer under it, the same two clicks.

type Locale = "de" | "en";
interface S {
	asked: boolean;
	chip: boolean;
	jumped: boolean;
	phase: "idle" | "thinking" | "answer";
	typed: string;
	words: number;
}

const COPY = {
	en: {
		tabs: ["Overview", "Formatbibel", "Ask the Film"],
		groups: ["Understand", "Check", "Put to work"],
		export: "Export",
		intro:
			"Ask the Film answers questions from the analysis and links every answer to a Timecode.",
		chips: [
			"When does the mood shift?",
			"Who drives the plot?",
			"Are there continuity errors?",
		],
		keyFrames: "Key frames",
		projects: "Projects",
		nav: ["Overview", "Open Movies (Demo)", "Küstenwache", "Hafenlichter"],
		sub: ["Unsorted"],
		admin: "Administration",
		adminNav: ["Production company", "Company groups"],
		thinking: "screencurve is thinking",
		placeholder: "Ask the Film…",
		submit: "Ask",
		q1: "Where does the central conflict between the main characters begin, and how does the film show it?",
		a1: "The central conflict between Thom and Celia begins in the prologue, on a real Amsterdam canal bridge in front of historic buildings.",
		q2: "At what point does the plot tip from preparation into confrontation?",
		a2: [
			"The shift from preparation to confrontation happens in two stages. With the physical press of the “PLAYBACK” switch",
			"and the start of the holographic dome, the preparation ends and the actual mission begins.",
		],
	},
	de: {
		tabs: ["Überblick", "Formatbibel", "Frag den Film"],
		groups: ["Verstehen", "Prüfen", "Verwerten"],
		export: "Exportieren",
		intro:
			"Frag den Film beantwortet Fragen aus der Analyse und verlinkt jede Antwort mit einem Timecode.",
		chips: [
			"Wann kippt die Stimmung?",
			"Wer treibt die Handlung?",
			"Gibt es Anschlussfehler?",
		],
		keyFrames: "Schlüssel-Frames",
		projects: "Projekte",
		nav: ["Übersicht", "Open Movies (Demo)", "Küstenwache", "Hafenlichter"],
		sub: ["Unsortiert"],
		admin: "Verwaltung",
		adminNav: ["Produktionsfirma", "Unternehmensgruppen"],
		thinking: "screencurve denkt nach",
		placeholder: "Frag den Film…",
		submit: "Fragen",
		q1: "Wo beginnt der zentrale Konflikt zwischen den Hauptfiguren, und wie zeigt der Film ihn?",
		a1: "Der zentrale Konflikt zwischen Thom und Celia beginnt im Prolog auf einer realen Amsterdamer Grachtenbrücke vor historischer Kulisse.",
		q2: "An welcher Stelle kippt die Handlung von Vorbereitung zu Konfrontation?",
		a2: [
			"Der Übergang von der Vorbereitung zur Konfrontation vollzieht sich in zwei Stufen. Mit der physischen Betätigung des „PLAYBACK“-Schalters",
			"und dem Start der holografischen Kuppel endet die Vorbereitung und der eigentliche Einsatz beginnt.",
		],
	},
} as const;

const TITLE = "Tears of Steel";
// The project marks the sidebar draws before each name
const MARKS = [null, "OM", "KÜ", "HA"];
const FIRST = "00:00:25";
const SECOND = "00:04:56";
const END = "00:12:14";
const FRAMES = [
	{ src: `${frames}/00025.webp`, at: FIRST },
	{ src: `${frames}/00084.webp`, at: "00:01:24" },
	{ src: `${frames}/00296.webp`, at: SECOND },
	{ src: `${frames}/00499.webp`, at: "00:08:19" },
];

const initial: S = {
	asked: false,
	phase: "idle",
	typed: "",
	words: 0,
	chip: false,
	jumped: false,
};

const count = (text: string) => text.split(" ").length;

function script(question: string, lead: number, words: number) {
	return async (a: Act<S>) => {
		await a.wait(1300);
		a.mark("ask");
		await a.move({ at: "composer", x: 0.3, y: 0.5 });
		await a.click({ at: "composer", x: 0.3, y: 0.5 });
		await a.type("typed", question, { interval: 26 });
		await a.wait(300);
		await a.move({ at: "send", x: 0.5, y: 0.5 });
		await a.wait(140);
		await a.click({ at: "send", x: 0.5, y: 0.5 });
		a.put({ asked: true, typed: "" });
		// Off the composer, onto empty thread, while the film is asked
		const away = a.move("rest", { duration: 700 });
		await a.wait(550);
		a.put({ phase: "thinking" });
		await away;
		await a.wait(800);
		a.mark("stream");
		a.put({ phase: "answer" });
		for (let i = 1; i <= words; i++) {
			a.put({ words: i });
			// The Timecode lands where the answer cites it
			if (i === lead) {
				await a.wait(200);
				a.put({ chip: true });
			}
			await a.wait(44);
		}
		await a.wait(750);
		a.mark("jump");
		await a.move({ at: "tc", x: 0.8, y: 0.8 });
		await a.wait(180);
		await a.click({ at: "tc", x: 0.8, y: 0.8 });
		a.put({ jumped: true });
		await a.wait(2800);
	};
}

function Player({ jumped }: { jumped: boolean }) {
	return (
		<div className="wvh-screen">
			<img alt="" src={FRAMES[0].src} />
			<img
				alt=""
				className="wvh-screen-next"
				data-on={jumped || undefined}
				src={FRAMES[2].src}
			/>
		</div>
	);
}

export default function HeroScene({ locale }: { locale: Locale }) {
	const t = COPY[locale];
	const lead = count(t.a2[0]);
	const words = lead + count(t.a2[1]);
	const poster: S = {
		asked: true,
		phase: "answer",
		typed: "",
		words,
		chip: true,
		jumped: true,
	};
	return (
		<Stage<S>
			className="wvh"
			compact={{ below: 600, width: 358, height: 268 }}
			cursor={{ at: { wide: { x: 640, y: 470 }, compact: { x: 300, y: 236 } } }}
			fill
			height={592}
			initial={initial}
			play="once"
			poster={poster}
			script={script(t.q2, lead, words)}
			theme="dark"
			width={1164}
		>
			{(s, _rect, layout) => {
				const compact = layout === "compact";
				const answer = (
					<>
						<Collapse from="below" open={s.asked} reveal="drop">
							<div className="wvh-q">
								<Text>{t.q2}</Text>
							</div>
						</Collapse>
						<Collapse open={s.phase === "thinking"}>
							<Text className="wvh-thinking">{t.thinking}</Text>
						</Collapse>
						<Collapse open={s.phase === "answer"}>
							<div className="wvh-a">
								<Stream
									className="wvh-stream"
									count={Math.min(s.words, lead)}
									text={t.a2[0]}
								/>
								<span
									className="wvh-tc"
									data-active={s.jumped || undefined}
									data-cursor="pointer"
									data-on={s.chip || undefined}
									data-target="tc"
								>
									{SECOND}
								</span>
								{/* Narrow, the answer stops at its Timecode */}
								{compact ? (
									<span
										className="wvh-more"
										data-on={s.words > lead || undefined}
									>
										…
									</span>
								) : (
									<>
										{" "}
										<Stream
											className="wvh-stream"
											count={Math.max(s.words - lead, 0)}
											text={t.a2[1]}
										/>
									</>
								)}
							</div>
						</Collapse>
					</>
				);
				const readout = (
					<span className="wvh-time">
						<Roll>{s.jumped ? SECOND : FIRST}</Roll>
					</span>
				);
				const composer = (
					<div className="wvh-composer">
						<span
							className="wvh-composer-field"
							data-cursor="ibeam"
							data-target="composer"
						>
							{s.typed ? (
								<Text className="wvh-composer-typed">{s.typed}</Text>
							) : (
								<Text className="wvh-composer-hint">{t.placeholder}</Text>
							)}
						</span>
						<span
							className="wvh-send"
							data-cursor="pointer"
							data-ready={s.typed ? true : undefined}
							data-target="send"
						>
							{t.submit}
						</span>
					</div>
				);

				if (compact) {
					return (
						<div className="wvh-app wvh-app--compact">
							<div className="wvh-strip">
								<Player jumped={s.jumped} />
								<div className="wvh-strip-meta">
									<Text className="wvh-strip-title">{TITLE}</Text>
									{readout}
								</div>
							</div>
							<div className="wvh-thread">
								<span className="wvh-rest" data-target="rest" />
								{/* The empty state leaves as the exchange starts, as the product's does */}
								<Collapse open={!s.asked}>
									<Text className="wvh-intro">{t.intro}</Text>
									<div className="wvh-chips">
										<span className="wvh-chip">{t.chips[0]}</span>
										<span className="wvh-chip">{t.chips[1]}</span>
									</div>
								</Collapse>
								{answer}
							</div>
							{composer}
						</div>
					);
				}

				return (
					<div className="wvh-app">
						<aside className="wvh-side">
							<div className="wvh-org">
								<span className="wvh-org-mark">ND</span>
								<Text className="wvh-org-name">Northlight · Drama</Text>
							</div>
							<Text className="wvh-side-label">{t.projects}</Text>
							{t.nav.map((item, i) => (
								<div key={item}>
									<div className="wvh-nav" data-on={i === 1 || undefined}>
										{MARKS[i] ? (
											<span className="wvh-nav-mark">{MARKS[i]}</span>
										) : (
											<Bar h={12} r={3} tone={3} w={12} />
										)}
										<Text>{item}</Text>
									</div>
									{i === 1 &&
										t.sub.map((sub) => (
											<div className="wvh-nav wvh-nav--sub" key={sub}>
												<Text>{sub}</Text>
											</div>
										))}
								</div>
							))}
							<Text className="wvh-side-label">{t.admin}</Text>
							{t.adminNav.map((item) => (
								<div className="wvh-nav" key={item}>
									<Bar h={12} r={3} tone={3} w={12} />
									<Text>{item}</Text>
								</div>
							))}
						</aside>

						<div className="wvh-main">
							<header className="wvh-head">
								<Text className="wvh-title">{TITLE}</Text>
								<span className="wvh-export">{t.export}</span>
							</header>
							<nav className="wvh-tabs">
								{t.tabs.map((tab, i) => (
									<span
										className="wvh-tab"
										data-on={i === 2 || undefined}
										key={tab}
									>
										{tab}
									</span>
								))}
								<span className="wvh-tabs-rule" />
								{t.groups.map((group) => (
									<span className="wvh-tab" key={group}>
										{group}
										<Icon name="chevron-down" size={12} />
									</span>
								))}
							</nav>

							<div className="wvh-cols">
								<section className="wvh-chat">
									<Text className="wvh-intro">{t.intro}</Text>
									<div className="wvh-chips">
										{t.chips.map((chip) => (
											<span className="wvh-chip" key={chip}>
												{chip}
											</span>
										))}
									</div>
									<div className="wvh-thread">
										<span className="wvh-rest" data-target="rest" />
										<div className="wvh-q">
											<Text>{t.q1}</Text>
										</div>
										<div className="wvh-a">
											<span className="wvh-stream">{t.a1}</span>
											<span
												className="wvh-tc"
												data-active={!s.jumped || undefined}
												data-on
											>
												{FIRST}
											</span>
										</div>
										{answer}
									</div>
									{composer}
								</section>

								<section className="wvh-player">
									<div className="wvh-player-head">
										<Text className="wvh-label">Proxy</Text>
										<span className="wvh-range">
											{readout}
											<span className="wvh-range-end">{END}</span>
										</span>
									</div>
									<Player jumped={s.jumped} />
									<div
										className="wvh-scrub"
										data-jumped={s.jumped || undefined}
									>
										<span className="wvh-scrub-fill" />
										<span className="wvh-scrub-knob" />
									</div>
									<Text className="wvh-label wvh-label--frames">
										{t.keyFrames}
									</Text>
									<div className="wvh-frames">
										{FRAMES.map((frame) => (
											<figure
												className="wvh-frame"
												data-on={
													(s.jumped
														? frame.at === SECOND
														: frame.at === FIRST) || undefined
												}
												key={frame.at}
											>
												<img alt="" src={frame.src} />
												<figcaption>{frame.at}</figcaption>
											</figure>
										))}
									</div>
								</section>
							</div>
						</div>
					</div>
				);
			}}
		</Stage>
	);
}
