"use client";

import { ChevronDown } from "lucide-react";
import {
	type Act,
	Menu,
	Popover,
	Roll,
	Stage,
	Swap,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./case-fz-summary.css";

// case study: the purchase-cost summary of
// finanzierungszertifikat.com, the step where the buyer sees what the
// property really costs. Beats: the pointer opens the federal state and picks
// Berlin; the transfer tax for that state fills in; the total and the
// financing need follow. Plays once.
//
// Real strings: the step's title and every label (the app's own locale
// file). The figures are an example: 6 % transfer tax is Berlin's rate.

interface S {
	menu: boolean;
	state: boolean;
}

const STATES = ["Berlin", "Brandenburg", "Hamburg"];
const euro = (n: number) => `${n.toLocaleString("de-DE")} €`;
const PRICE = 510_000;
const TAX = 30_600;
const NOTARY = 10_200;
const BROKER = 18_207;
const EQUITY = 120_000;

const initial: S = { menu: false, state: false };
const poster: S = { menu: false, state: true };

async function script(a: Act<S>) {
	await a.wait(1300);
	a.mark("open");
	await a.move({ at: "state", x: 0.8, y: 0.7 });
	await a.wait(200);
	await a.click({ at: "state", x: 0.8, y: 0.7 });
	a.put({ menu: true });
	await a.wait(600);
	await a.move({ at: "berlin", x: 0.6, y: 0.6 });
	await a.wait(220);
	await a.click({ at: "berlin", x: 0.6, y: 0.6 });
	a.mark("picked");
	a.put({ menu: false, state: true });
	await a.move("rest", { duration: 700 });
	await a.wait(2600);
}

export default function FzSummaryScene() {
	return (
		<Stage<S>
			className="wcf"
			cursor={{ at: { x: 200, y: 222 } }}
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s, rect) => {
				const pill = rect("state");
				const total = PRICE + NOTARY + BROKER + (s.state ? TAX : 0);
				return (
					<>
						<Window className="wcf-win" url="finanzierungszertifikat.com">
							<div className="wcf-page">
								<Text className="wcf-title">Ihr Vorhaben im Überblick</Text>
								<div className="wcf-row">
									<Text>Kaufpreis</Text>
									<span className="wcf-n">{euro(PRICE)}</span>
								</div>
								<div className="wcf-row">
									<span className="wcf-label">
										<Text>Grunderwerbsteuer</Text>
										<span
											className="wcf-select"
											data-cursor="pointer"
											data-open={s.menu || undefined}
											data-set={s.state || undefined}
											data-target="state"
										>
											<Swap id={s.state ? "set" : "unset"}>
												{s.state ? "Berlin" : "Bundesland wählen"}
											</Swap>
											<ChevronDown size={9} strokeWidth={2} />
										</span>
									</span>
									<span className="wcf-n" data-empty={!s.state || undefined}>
										<Swap id={s.state ? "set" : "unset"}>
											{s.state ? euro(TAX) : "–"}
										</Swap>
									</span>
								</div>
								<div className="wcf-row">
									<Text>Notar &amp; Grundschuldkosten</Text>
									<span className="wcf-n">{euro(NOTARY)}</span>
								</div>
								<div className="wcf-row">
									<span className="wcf-label">
										<Text>Maklerprovision</Text>
										<span className="wcf-adjust">Anpassen</span>
									</span>
									<span className="wcf-n">{euro(BROKER)}</span>
								</div>
								<div className="wcf-row wcf-row--total">
									<Text>Gesamtkosten</Text>
									<span className="wcf-n">
										<Roll delay={250}>{euro(total)}</Roll>
									</span>
								</div>
								<span className="wcf-rest" data-target="rest" />
							</div>
						</Window>

						{pill && (
							<Popover
								className="wcf-menu"
								origin="top left"
								show={s.menu}
								style={{ left: pill.x, top: pill.y + pill.height + 5 }}
							>
								<Menu
									items={STATES}
									targets={["berlin", undefined, undefined]}
								/>
							</Popover>
						)}

						<div className="wcf-need">
							<Text className="wcf-need-label">
								Voraussichtlicher Finanzierungsbedarf
							</Text>
							<span className="wcf-need-n">
								<Roll delay={450}>{euro(total - EQUITY)}</Roll>
							</span>
							<div className="wcf-need-foot">
								<Text>Ihr Eigenkapital</Text>
								<span>{euro(EQUITY)}</span>
							</div>
						</div>
					</>
				);
			}}
		</Stage>
	);
}
