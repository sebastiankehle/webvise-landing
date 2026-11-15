"use client";

import { type CSSProperties, useEffect, useState } from "react";
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

const frames = "/images/case-studies/screencurve/car-spotter";

// Screencurve's "Ask the Film" at work on The Car Spotter, in the product's
// dark look. Beats: the pointer types a question into the composer and asks
// it; a short Thinking; the answer streams in and its Timecodes arrive with
// it; the pointer points at the first Timecode, which lights up and shows its
// frame, and opens it, so the player cuts there; then the second. Plays
// once; the couple on their camping chairs is the payoff.
//
// What makes it read as the product:
// - The question and its answer are pair 3 of the product's chat about the
//   film (screencurve's export of "The Car Spotter (Ohne Abspann)"), word for
//   word. They stay German on English pages, as the product shows an
//   analysis in its own language.
// - A Timecode chip shows its frame when pointed at and seeks the player
//   when opened, as the app's chip does (ADR-0059). Each frame is the first
//   picture of its second, cut from the film, and shows what the sentence
//   before its Timecode says.
// - The identity is the redesigned one: actions are light on dark, teal
//   marks only Timecodes, the selection and the playhead.
// - The labels follow the product's message files in both languages.
//
// Narrow, it is a second design: the frame as a strip, the exchange under it
// kept to its latest lines. It opens only the first Timecode and ends on the
// couple at the framed photo, the stronger picture at that size.

type Locale = "de" | "en";
type Second = 575 | 701 | 749;
interface S {
	asked: boolean;
	at: Second;
	phase: "idle" | "thinking" | "answer";
	tip: Second | null;
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
		chips: ["When does the mood shift?", "Who drives the plot?"],
		keyFrames: "Key frames",
		projects: "Projects",
		nav: ["Overview", "Kurzfilme (Demo)", "Küstenwache", "Hafenlichter"],
		sub: ["Unsorted"],
		admin: "Administration",
		adminNav: ["Production company", "Company groups"],
		thinking: "screencurve is thinking",
		placeholder: "Ask the Film…",
		submit: "Ask",
	},
	de: {
		tabs: ["Überblick", "Formatbibel", "Frag den Film"],
		groups: ["Verstehen", "Prüfen", "Verwerten"],
		export: "Exportieren",
		intro:
			"Frag den Film beantwortet Fragen aus der Analyse und verlinkt jede Antwort mit einem Timecode.",
		chips: ["Wann kippt die Stimmung?", "Wer treibt die Handlung?"],
		keyFrames: "Schlüssel-Frames",
		projects: "Projekte",
		nav: ["Übersicht", "Kurzfilme (Demo)", "Küstenwache", "Hafenlichter"],
		sub: ["Unsortiert"],
		admin: "Verwaltung",
		adminNav: ["Produktionsfirma", "Unternehmensgruppen"],
		thinking: "screencurve denkt nach",
		placeholder: "Frag den Film…",
		submit: "Fragen",
	},
} as const;

// Pair 1 of the chat, already in the thread on wide screens; its Timecodes
// stay closed, so none brings a frame
const EARLIER = {
	question: "Wo ist das Oldsmobile zu sehen? Bitte kurz, mit Timecodes.",
	answer: [
		"Das Oldsmobile ist zum einen direkt auf der freien Landstraße als herannahendes Oldtimer-Cabriolet in Fahraufnahmen und Nahaufnahmen zu sehen",
		[618, 646, 665],
		"Zum anderen ist das Oldsmobile Cutlass Supreme als gerahmtes Belegfoto an einer grün gestrichenen Wand im Haus zu sehen",
		[697, 701],
	],
} as const;

// Pair 3 of the chat, as the analysis wrote it; each sentence ends on its
// Timecode, which the product sets in brackets
const QUESTION =
	"Wie endet der Film für das Paar? Bitte in zwei Sätzen, mit Timecodes.";
const ANSWER: [string, Second, string, Second] = [
	"Nach der erfolgreichen Auto-Jagd betrachtet das versöhnte Paar zu Hause gemeinsam das gerahmte Trophäenfoto des Oldsmobile an der Wand",
	701,
	"Der Film endet schließlich mit einer gelassenen neuen Routine, in der beide einträchtig nebeneinander in Klappstühlen mit Wolldecke und Rätselheft am Straßenrand sitzen und Autos beobachten",
	749,
];

const TITLE = "The Car Spotter";
const RUNTIME = 773;
// The project marks the sidebar draws before each name: the first letters of
// the first two words, or the first two of a single word
const MARKS = [null, "KD", "KÜ", "HA"];

/** A second as the product writes it: the broadcast Timecode, no offset. */
function timecode(seconds: number) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

const still = (seconds: number) =>
	`${frames}/${String(seconds).padStart(5, "0")}.webp`;

// The player starts on the poster, then cuts to each opened Timecode; the
// narrow strip crops each frame to its faces
const PLAYER: Second[] = [575, 701, 749];
const FOCUS: Record<Second, string> = {
	575: "50% 35%",
	701: "50% 45%",
	749: "50% 28%",
};
// The analysis's key frames: kitchen, the Oldsmobile, the photo, the chairs
const KEY_FRAMES = [109, 618, 701, 749];

const count = (text: string) => text.split(" ").length;
const LEAD = count(ANSWER[0]);
const TAIL = count(ANSWER[2]);
// Every word of the answer and each of its two Timecodes is one step
const WORDS = LEAD + 1 + TAIL + 1;

const initial: S = {
	asked: false,
	at: 575,
	phase: "idle",
	tip: null,
	typed: "",
	words: 0,
};

// The still ends on the stronger picture, the couple at the framed photo
const poster: S = {
	asked: true,
	at: 701,
	phase: "answer",
	tip: null,
	typed: "",
	words: WORDS,
};

async function open(a: Act<S>, seconds: Second) {
	const target = { at: `tc${seconds}`, x: 0.5, y: 0.6 };
	await a.move(target);
	// Pointed at, the Timecode lights up and shows its frame
	a.put({ tip: seconds });
	await a.wait(900);
	await a.click(target);
	a.put({ at: seconds });
	await a.wait(500);
	a.put({ tip: null });
}

async function script(a: Act<S>) {
	await a.wait(1200);
	a.mark("ask");
	await a.move({ at: "composer", x: 0.3, y: 0.5 });
	await a.click({ at: "composer", x: 0.3, y: 0.5 });
	await a.type("typed", QUESTION, { interval: 24 });
	await a.wait(280);
	await a.move({ at: "send", x: 0.5, y: 0.5 });
	await a.wait(120);
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
	for (let i = 1; i <= WORDS; i++) {
		a.put({ words: i });
		await a.wait(40);
	}
	await a.wait(450);
	a.mark("open");
	await open(a, 701);
	if (a.layout === "compact") {
		await a.wait(2600);
		return;
	}
	await a.wait(250);
	await open(a, 749);
	await a.wait(2600);
}

/** Timecodes the answer cites together, in one pair of brackets. */
function Cites({ seconds }: { seconds: readonly number[] }) {
	return (
		<span className="wvh-cite" data-on>
			(
			{seconds.map((second, i) => (
				<span key={second}>
					{i > 0 && ", "}
					<span className="wvh-tc">{timecode(second)}</span>
				</span>
			))}
			).
		</span>
	);
}

/** A cited Timecode as the answer sets it: in brackets, after its sentence. */
function Cite({
	active,
	on,
	seconds,
	tip,
}: {
	active: boolean;
	on: boolean;
	seconds: Second;
	tip: boolean;
}) {
	return (
		<span className="wvh-cite" data-on={on || undefined}>
			(
			<span
				className="wvh-tc"
				data-active={active || undefined}
				data-cursor="pointer"
				data-lit={tip || undefined}
				data-target={`tc${seconds}`}
			>
				{timecode(seconds)}
				<span className="wvh-tip" data-open={tip || undefined}>
					<img alt="" src={still(seconds)} />
				</span>
			</span>
			).
		</span>
	);
}

/** While the Ask button passes under the site's chat button, the chat button
 * steps aside, so the pointer never clicks under it. */
function useLauncherAside(target: HTMLElement | null) {
	useEffect(() => {
		if (!target) {
			return;
		}
		const root = document.documentElement;
		let io: IntersectionObserver | undefined;
		const watch = () => {
			io?.disconnect();
			const launcher = document.querySelector("[data-chat-launcher]");
			if (!launcher) {
				return;
			}
			// The viewport, cut down to the chat button's own box
			const r = launcher.getBoundingClientRect();
			io = new IntersectionObserver(
				([entry]) =>
					root.toggleAttribute("data-launcher-aside", entry.isIntersecting),
				{
					rootMargin: `${-r.top}px ${r.right - innerWidth}px ${r.bottom - innerHeight}px ${-r.left}px`,
				}
			);
			io.observe(target);
		};
		watch();
		addEventListener("resize", watch);
		return () => {
			removeEventListener("resize", watch);
			io?.disconnect();
			root.removeAttribute("data-launcher-aside");
		};
	}, [target]);
}

function Player({ at }: { at: Second }) {
	return (
		<div className="wvh-screen">
			{PLAYER.map((seconds) => (
				<img
					alt=""
					data-on={seconds === at || undefined}
					key={seconds}
					src={still(seconds)}
					style={{ objectPosition: FOCUS[seconds] }}
				/>
			))}
		</div>
	);
}

export default function HeroScene({ locale }: { locale: Locale }) {
	const t = COPY[locale];
	const [send, setSend] = useState<HTMLElement | null>(null);
	useLauncherAside(send);
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
			script={script}
			theme="dark"
			width={1164}
		>
			{(s, _rect, layout) => {
				const compact = layout === "compact";
				const tail = s.words - LEAD - 1;
				const answer = (
					<>
						<Collapse from="below" open={s.asked} reveal="drop">
							<div className="wvh-q">
								<Text lang="de">{QUESTION}</Text>
							</div>
						</Collapse>
						<Collapse open={s.phase === "thinking"}>
							<Text className="wvh-thinking">{t.thinking}</Text>
						</Collapse>
						<Collapse open={s.phase === "answer"}>
							<div className="wvh-a" lang="de">
								<Stream
									className="wvh-stream"
									count={Math.min(s.words, LEAD)}
									text={ANSWER[0]}
								/>{" "}
								<Cite
									active={s.at === ANSWER[1]}
									on={s.words > LEAD}
									seconds={ANSWER[1]}
									tip={s.tip === ANSWER[1]}
								/>{" "}
								<Stream
									className="wvh-stream"
									count={Math.max(Math.min(tail, TAIL), 0)}
									text={ANSWER[2]}
								/>{" "}
								<Cite
									active={s.at === ANSWER[3]}
									on={tail > TAIL}
									seconds={ANSWER[3]}
									tip={s.tip === ANSWER[3]}
								/>
							</div>
						</Collapse>
					</>
				);
				const readout = (
					<span className="wvh-time">
						<Roll>{timecode(s.at)}</Roll>
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
								<Text className="wvh-composer-typed" lang="de">
									{s.typed}
								</Text>
							) : (
								<Text className="wvh-composer-hint">{t.placeholder}</Text>
							)}
						</span>
						<span
							className="wvh-send"
							data-cursor="pointer"
							data-ready={s.typed ? true : undefined}
							data-target="send"
							ref={setSend}
						>
							{t.submit}
						</span>
					</div>
				);

				if (compact) {
					return (
						<div className="wvh-app wvh-app--compact">
							<div className="wvh-strip">
								<Player at={s.at} />
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
											<Text lang="de">{EARLIER.question}</Text>
										</div>
										<div className="wvh-a" lang="de">
											{EARLIER.answer[0]} <Cites seconds={EARLIER.answer[1]} />{" "}
											{EARLIER.answer[2]} <Cites seconds={EARLIER.answer[3]} />
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
											<span className="wvh-range-end">{timecode(RUNTIME)}</span>
										</span>
									</div>
									<Player at={s.at} />
									<div
										className="wvh-scrub"
										style={
											{ "--at": `${(s.at / RUNTIME) * 100}%` } as CSSProperties
										}
									>
										<span className="wvh-scrub-fill" />
										<span className="wvh-scrub-knob" />
									</div>
									<Text className="wvh-label wvh-label--frames">
										{t.keyFrames}
									</Text>
									<div className="wvh-frames">
										{KEY_FRAMES.map((seconds) => (
											<figure
												className="wvh-frame"
												data-on={seconds === s.at || undefined}
												key={seconds}
											>
												<img alt="" src={still(seconds)} />
												<figcaption>{timecode(seconds)}</figcaption>
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
