"use client";

import {
	type Act,
	Bar,
	Collapse,
	Icon,
	Stage,
	Stream,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./automate-scene.css";

const site = "/images/home/services/mpb-site.webp";

// Service card "Automate": the AI assistant on a builder's site,
// answering. Beats: the pointer picks one of the assistant's own suggested
// questions; the opening leaves and the question lands as the visitor's
// message; the assistant thinks, then answers word by word. Plays once.
//
// Real strings: the assistant's name, the opening of its greeting, three of
// its suggested questions, the composer's placeholder. The answer is the
// site's own sentence on turnkey building, with a plain "Ja." before it.

interface S {
	asked: boolean;
	phase: "idle" | "thinking" | "answer";
	words: number;
}

const QUESTIONS = [
	"Welche Leistungen bieten Sie an?",
	"Bauen Sie auch schlüsselfertig?",
	"Bilden Sie Lehrlinge aus?",
];
const ANSWER =
	"Ja. Beim Schlüsselfertigbau koordinieren wir alle Gewerke inklusive Planung, Bauantrag und Bauleitung.";
const WORDS = ANSWER.split(" ").length;

const initial: S = { asked: false, phase: "idle", words: 0 };
const poster: S = { asked: true, phase: "answer", words: WORDS };

async function script(a: Act<S>) {
	await a.wait(450);
	a.mark("ask");
	await a.move({ at: "pick", x: 0.82, y: 0.75 });
	await a.wait(180);
	await a.click({ at: "pick", x: 0.82, y: 0.75 });
	a.put({ asked: true });
	const away = a.move("rest", { duration: 700 });
	await a.wait(600);
	a.put({ phase: "thinking" });
	await away;
	await a.wait(500);
	a.mark("answer");
	a.put({ phase: "answer" });
	for (let i = 1; i <= WORDS; i++) {
		a.put({ words: i });
		await a.wait(70);
	}
	await a.wait(2600);
}

export default function AutomateScene() {
	return (
		<Stage<S>
			className="wva"
			cursor={{ at: { x: 120, y: 236 } }}
			fill
			height={300}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => (
				<>
					<Window className="wva-win" url="maerkischeprojekt.de">
						<div className="wva-site">
							<img alt="" className="wva-photo" src={site} />
							<span className="wva-rest" data-target="rest" />
						</div>
					</Window>

					<section className="wva-chat">
						<header className="wva-head">
							<span className="wva-avatar">MP</span>
							<div className="wva-who">
								<Text className="wva-name">MP Bau KI-Assistent</Text>
								<Bar h={5} tone={2} w={84} />
							</div>
						</header>
						<div className="wva-body">
							{/* The opening leaves as the exchange starts, as the product's does */}
							<Collapse open={!s.asked}>
								<div className="wva-opening">
									<Text className="wva-hello">
										Hallo! Ich bin der KI-Assistent der Märkischen Projekt Bau.
									</Text>
									{QUESTIONS.map((q, i) => (
										<span
											className="wva-q"
											data-cursor={i === 1 ? "pointer" : undefined}
											data-target={i === 1 ? "pick" : undefined}
											key={q}
										>
											<Text>{q}</Text>
										</span>
									))}
								</div>
							</Collapse>
							<Collapse from="below" open={s.asked} reveal="drop">
								<div className="wva-mine">
									<Text>{QUESTIONS[1]}</Text>
								</div>
							</Collapse>
							<Collapse open={s.phase === "thinking"}>
								<span className="wva-dots">
									<i />
									<i />
									<i />
								</span>
							</Collapse>
							<Collapse open={s.phase === "answer"}>
								<div className="wva-answer">
									<Stream count={s.words} text={ANSWER} />
								</div>
							</Collapse>
						</div>
						<footer className="wva-compose">
							<Text className="wva-placeholder">Nachricht eingeben...</Text>
							<span className="wva-send">
								<Icon name="send" size={12} />
							</span>
						</footer>
					</section>
				</>
			)}
		</Stage>
	);
}
