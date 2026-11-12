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

const apartment = "/images/home/hero/apartment-evening.webp";
const boat = "/images/home/hero/boat-deck.webp";
const harbor = "/images/home/hero/harbor-dawn.webp";
const interrogation = "/images/home/hero/interrogation.webp";

// The hero: Screencurve's "Ask the film" at work, in the
// product's own dark look. Beats: the pointer picks a suggested question; it
// lands in the thread; a short Thinking; the answer streams in and ends on
// its timecode; the pointer opens the timecode and the player jumps to that
// frame, the readout rolling to match. Plays once; the still is the payoff.
//
// What makes it read as the product:
// - The labels follow the product's message files in both languages (one
//   suggestion is put in plain English).
// - The stills are the product's demo frames; the timecode in the answer is
//   the frame the player lands on, and the key frame with that time lights.
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
	words: number;
}

const COPY = {
	en: {
		tabs: [
			"Overview",
			"Format bible",
			"Ask the film",
			"Dramaturgy",
			"Characters",
			"Editing",
			"Archive",
		],
		export: "Export",
		intro:
			"Ask the film answers questions from the analysis and links every answer to a timecode.",
		chips: [
			"When does the mood shift?",
			"Who drives the plot?",
			"Are there continuity errors?",
		],
		keyFrames: "Key frames",
		projects: "Projects",
		nav: ["Overview", "Nordlicht", "Küstenwache", "Hafenlichter"],
		sub: ["Season 1", "Unsorted"],
		thinking: "Thinking",
		ask: "Ask a question",
		org: "Organization",
		settings: "Settings",
		q1: "When does the conflict between Marek and Ferretti escalate for the first time?",
		a1: "The generational conflict breaks into the open in the ready room, when Ferretti accuses Marek of withholding evidence. The scene marks the midpoint of the episode.",
		a2: "In the wide shot the fender on the dock is still closed. In the close-up two shots later it is already open, a continuity error just before the showdown.",
	},
	de: {
		tabs: [
			"Überblick",
			"Formatbibel",
			"Frag den Film",
			"Dramaturgie",
			"Figuren",
			"Schnitt",
			"Archiv",
		],
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
		nav: ["Übersicht", "Nordlicht", "Küstenwache", "Hafenlichter"],
		sub: ["Season 1", "Unsortiert"],
		thinking: "Denkt nach",
		ask: "Frage stellen",
		org: "Organisation",
		settings: "Einstellungen",
		q1: "Wann eskaliert der Konflikt zwischen Marek und Ferretti zum ersten Mal?",
		a1: "Der Generationenkonflikt bricht im Bereitschaftsraum offen aus, als Ferretti Marek vorwirft, Beweise zurückzuhalten. Die Szene markiert die Mitte der Folge.",
		a2: "In der Totalen ist der Fender am Steg noch geschlossen. In der Nahaufnahme zwei Einstellungen später ist er schon offen, ein Anschlussfehler kurz vor dem Showdown.",
	},
} as const;

const TITLE = "Saltwater · S01 E03 · Undertow";
const FIRST = "10:17:46";
const SECOND = "10:41:33";
const END = "10:45:38";
const FRAMES = [
	{ src: harbor, at: "10:00:30" },
	{ src: apartment, at: "10:04:12" },
	{ src: interrogation, at: FIRST },
	{ src: boat, at: SECOND },
];

const initial: S = {
	asked: false,
	phase: "idle",
	words: 0,
	chip: false,
	jumped: false,
};

function script(words: number) {
	return async (a: Act<S>) => {
		await a.wait(1500);
		a.mark("ask");
		await a.move({ at: "sugg", x: 0.85, y: 0.75 });
		await a.wait(180);
		await a.click({ at: "sugg", x: 0.85, y: 0.75 });
		a.put({ asked: true });
		// Off the chips, onto empty thread, while the film is asked
		const away = a.move("rest", { duration: 700 });
		await a.wait(550);
		a.put({ phase: "thinking" });
		await away;
		await a.wait(800);
		a.mark("stream");
		a.put({ phase: "answer" });
		for (let i = 1; i <= words; i++) {
			a.put({ words: i });
			await a.wait(44);
		}
		await a.wait(250);
		a.put({ chip: true });
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
			<img alt="" src={interrogation} />
			<img
				alt=""
				className="wvh-screen-next"
				data-on={jumped || undefined}
				src={boat}
			/>
		</div>
	);
}

export default function HeroScene({ locale }: { locale: Locale }) {
	const t = COPY[locale];
	const words = t.a2.split(" ").length;
	const poster: S = {
		asked: true,
		phase: "answer",
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
			script={script(words)}
			theme="dark"
			width={1164}
		>
			{(s, _rect, layout) => {
				const answer = (
					<>
						<Collapse from="below" open={s.asked} reveal="drop">
							<div className="wvh-q">
								<Text>{t.chips[2]}</Text>
							</div>
						</Collapse>
						<Collapse open={s.phase === "thinking"}>
							<Text className="wvh-thinking">{t.thinking}</Text>
						</Collapse>
						<Collapse open={s.phase === "answer"}>
							<div className="wvh-a">
								<Stream className="wvh-stream" count={s.words} text={t.a2} />
								<span
									className="wvh-tc"
									data-active={s.jumped || undefined}
									data-cursor="pointer"
									data-on={s.chip || undefined}
									data-target="tc"
								>
									{SECOND}
								</span>
							</div>
						</Collapse>
					</>
				);
				const readout = (
					<span className="wvh-time">
						<Roll>{s.jumped ? SECOND : FIRST}</Roll>
					</span>
				);

				if (layout === "compact") {
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
										<span
											className="wvh-chip"
											data-cursor="pointer"
											data-target="sugg"
										>
											{t.chips[2]}
										</span>
										<span className="wvh-chip">{t.chips[0]}</span>
									</div>
								</Collapse>
								{answer}
							</div>
							<div className="wvh-composer">
								<Text className="wvh-composer-hint">{t.ask}</Text>
								<span className="wvh-send">
									<Icon name="arrow" size={13} />
								</span>
							</div>
						</div>
					);
				}

				return (
					<div className="wvh-app">
						<aside className="wvh-side">
							<div className="wvh-org">
								<span className="wvh-org-mark">NL</span>
								<Text className="wvh-org-name">Northlight · Drama</Text>
							</div>
							<Text className="wvh-side-label">{t.projects}</Text>
							{t.nav.map((item, i) => (
								<div key={item}>
									<div className="wvh-nav" data-on={i === 1 || undefined}>
										<Bar h={12} r={3} tone={i === 1 ? 5 : 3} w={12} />
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
							<div className="wvh-side-rest">
								{[64, 82, 56, 74].map((w) => (
									<div className="wvh-nav" key={w}>
										<Bar h={12} r={3} tone={2} w={12} />
										<Bar h={6} tone={2} w={w} />
									</div>
								))}
							</div>
							<div className="wvh-side-foot">
								<Text className="wvh-side-label">{t.org}</Text>
								<div className="wvh-nav">
									<Bar h={12} r={3} tone={3} w={12} />
									<Text>{t.settings}</Text>
								</div>
							</div>
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
							</nav>

							<div className="wvh-cols">
								<section className="wvh-chat">
									<Text className="wvh-intro">{t.intro}</Text>
									<div className="wvh-chips">
										{t.chips.map((chip, i) => (
											<span
												className="wvh-chip"
												data-cursor={i === 2 ? "pointer" : undefined}
												data-target={i === 2 ? "sugg" : undefined}
												data-used={(i === 2 && s.asked) || undefined}
												key={chip}
											>
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
									<div className="wvh-composer">
										<Text className="wvh-composer-hint">{t.ask}</Text>
										<span className="wvh-send">
											<Icon name="arrow" size={13} />
										</span>
									</div>
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
