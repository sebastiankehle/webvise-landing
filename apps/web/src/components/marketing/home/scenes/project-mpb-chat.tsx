"use client";

import { MessageCircle, X } from "lucide-react";
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
import "./project-mpb-chat.css";

const site = "/images/case-studies/mp-bau-construction/fullpage.webp";

// project card: the website of Märkische Projekt Bau and its AI
// assistant. Beats: the pointer opens the chat from its button; the panel
// grows out of it; the pointer picks a suggested question; the assistant
// thinks, then answers word by word. Plays once.
//
// Real strings: the site's own page, the assistant's name, its greeting,
// three of its suggested questions and the composer's placeholder. The answer
// names the site's own fields of work and region. The stage is a little taller
// than a card, so the large card fills; a card of the usual shape crops the
// foot of the page, below the chat button.

interface S {
	asked: boolean;
	open: boolean;
	phase: "idle" | "thinking" | "answer";
	words: number;
}

const QUESTIONS = [
	"Welche Leistungen bieten Sie an?",
	"Bauen Sie auch schlüsselfertig?",
	"Bilden Sie Lehrlinge aus?",
];
const ANSWER =
	"Wir bauen Gewerbe-, Wohnungs- und Sozialbauten sowie Villen und Einfamilienhäuser in Berlin und Brandenburg.";
const WORDS = ANSWER.split(" ").length;

const initial: S = { asked: false, open: false, phase: "idle", words: 0 };
const poster: S = { asked: true, open: true, phase: "answer", words: WORDS };

async function script(a: Act<S>) {
	await a.wait(900);
	a.mark("open");
	await a.move({ at: "launch", x: 0.5, y: 0.5 });
	await a.wait(180);
	await a.click({ at: "launch", x: 0.5, y: 0.5 });
	a.put({ open: true });
	await a.wait(800);
	a.mark("ask");
	await a.move({ at: "pick", x: 0.8, y: 0.6 });
	await a.wait(180);
	await a.click({ at: "pick", x: 0.8, y: 0.6 });
	a.put({ asked: true });
	const away = a.move("rest", { duration: 700 });
	await a.wait(600);
	a.put({ phase: "thinking" });
	await away;
	await a.wait(700);
	a.mark("answer");
	a.put({ phase: "answer" });
	for (let i = 1; i <= WORDS; i++) {
		a.put({ words: i });
		await a.wait(65);
	}
	await a.wait(2600);
}

export default function MpbChatScene() {
	return (
		<Stage<S>
			className="wva wpc"
			cursor={{ at: { x: 150, y: 200 } }}
			fill
			height={288}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s) => (
				<>
					<Window className="wva-win wpc-win" url="maerkischeprojekt.de">
						<div className="wva-site">
							<img alt="" className="wva-photo wpc-photo" src={site} />
							<span className="wva-rest wpc-rest" data-target="rest" />
						</div>
					</Window>

					{/* The site's chat button; the panel grows out of it */}
					<span
						className="wpc-launch"
						data-cursor="pointer"
						data-on={s.open || undefined}
						data-target="launch"
					>
						<span className="wpc-launch-icon wpc-launch-chat">
							<MessageCircle size={15} strokeWidth={1.9} />
						</span>
						<span className="wpc-launch-icon wpc-launch-close">
							<X size={15} strokeWidth={2} />
						</span>
					</span>

					<section className="wva-chat wpc-chat" data-on={s.open || undefined}>
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
											data-cursor={i === 0 ? "pointer" : undefined}
											data-target={i === 0 ? "pick" : undefined}
											key={q}
										>
											<Text>{q}</Text>
										</span>
									))}
								</div>
							</Collapse>
							<Collapse from="below" open={s.asked} reveal="drop">
								<div className="wva-mine">
									<Text>{QUESTIONS[0]}</Text>
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
