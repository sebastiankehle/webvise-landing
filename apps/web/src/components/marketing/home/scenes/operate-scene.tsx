"use client";

import {
	type Act,
	Bar,
	Check,
	Menu,
	Popover,
	Stage,
	Swap,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./operate-scene.css";

// Service card "Operate": the admin of finanzierungszertifikat.com
// at work, in its own look (white ground, pine green, Nunito). The frame
// opens on a list that already holds a new request. Beats: the pointer opens
// its status and picks "Zertifikat gesendet"; the pill changes in place; the
// certificate for that request arrives as the payoff. Plays once in view.
//
// What makes it read as the product, not a table demo:
// - The three statuses are the product's own, and so are the column heads.
// - The certificate carries the request's name and price: one event on two
//   surfaces, the same figures, never a second set of numbers.
// - The check in the Zertifikat column is the product's: an empty ring until
//   the certificate has gone out.
// - The window is pinned top-left and runs off the right and the bottom; the
//   certificate lands across its lower-left edge, over filler rows only.
//
// Real strings: the title, the four heads, two requests, the three statuses, the
// certificate's name, request and purchase price.

type Status = "new" | "sent";
interface S {
	cert: boolean;
	menu: boolean;
	status: Status;
}

const STATUSES = ["Neu", "Kontaktiert", "Zertifikat gesendet"];
const LABEL: Record<Status, string> = {
	new: "Neu",
	sent: "Zertifikat gesendet",
};
const FILLER = [
	[50, 46, 64],
	[60, 42, 88],
	[46, 48, 58],
	[56, 44, 72],
];

const initial: S = { menu: false, status: "new", cert: false };
const poster: S = { menu: false, status: "sent", cert: true };

async function script(a: Act<S>) {
	await a.wait(450);
	a.mark("open");
	// Off the label, on the pill's lower right, so the word stays readable
	await a.move({ at: "pill", x: 0.86, y: 0.8 });
	await a.wait(180);
	await a.click({ at: "pill", x: 0.86, y: 0.8 });
	a.put({ menu: true });
	await a.wait(520);
	await a.move({ at: "opt-sent", x: 0.82, y: 0.6 });
	await a.wait(220);
	await a.click({ at: "opt-sent", x: 0.82, y: 0.6 });
	a.mark("sent");
	a.put({ menu: false, status: "sent" });
	await a.wait(650);
	a.mark("cert");
	a.put({ cert: true });
	// Off the list, onto empty page, so the payoff is clear
	await a.move({ x: 344, y: 268 }, { duration: 800 });
	await a.wait(2400);
}

export default function OperateScene() {
	return (
		<Stage<S>
			className="wvo"
			cursor={{ at: { x: 352, y: 256 } }}
			fill
			height={300}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s, rect) => {
				const pill = rect("pill");
				return (
					<>
						<Window className="wvo-win" url="finanzierungszertifikat.com/admin">
							<div className="wvo-page">
								<div className="wvo-titlebar">
									<Text className="wvo-title">Zertifikat-Anfragen</Text>
									<span className="wvo-count">4</span>
								</div>
								<div className="wvo-cols wvo-head">
									<Text className="wvo-th">Name</Text>
									<Text className="wvo-th">Kaufpreis</Text>
									<Text className="wvo-th">Status</Text>
									<Text className="wvo-th">Zertifikat</Text>
								</div>
								<div className="wvo-cols wvo-row" data-fresh>
									<Text className="wvo-name">Beispiel 04</Text>
									<Text className="wvo-price">285.000 €</Text>
									<span
										className="wvo-pill"
										data-cursor="pointer"
										data-kind={s.status}
										data-open={s.menu || undefined}
										data-target="pill"
									>
										<Swap id={s.status}>{LABEL[s.status]}</Swap>
									</span>
									<Check
										className="wvo-check"
										on={s.status === "sent"}
										size={15}
									/>
								</div>
								<div className="wvo-cols wvo-row">
									<Text className="wvo-name">Beispiel 03</Text>
									<Text className="wvo-price">510.000 €</Text>
									<span className="wvo-pill" data-kind="contacted">
										<Text>Kontaktiert</Text>
									</span>
									<Check className="wvo-check" on={false} size={15} />
								</div>
								{FILLER.map(([a, b, c]) => (
									<div className="wvo-cols wvo-row" key={`${a}-${b}-${c}`}>
										<Bar tone={3} w={a} />
										<Bar tone={3} w={b} />
										<Bar h={18} r={9} tone={1} w={c} />
										<Bar className="wvo-check" h={15} r={8} tone={1} w={15} />
									</div>
								))}
							</div>
						</Window>

						{pill && (
							<Popover
								className="wvo-menu"
								origin="top left"
								show={s.menu}
								style={{ left: pill.x - 6, top: pill.y + pill.height + 6 }}
							>
								<Menu
									items={STATUSES}
									targets={[undefined, undefined, "opt-sent"]}
									value={0}
								/>
							</Popover>
						)}

						<div className="wvo-cert" data-show={s.cert || undefined}>
							<div className="wvo-cert-head">
								<Text className="wvo-cert-name">Finanzierungszertifikat</Text>
								<div className="wvo-cert-sub">
									<Text className="wvo-cert-for">Beispiel 04</Text>
									<span className="wvo-cert-kind">PDF</span>
								</div>
							</div>
							<div className="wvo-cert-row">
								<Text className="wvo-cert-label">Kaufpreis</Text>
								<Text className="wvo-cert-total">285.000 €</Text>
							</div>
						</div>
					</>
				);
			}}
		</Stage>
	);
}
