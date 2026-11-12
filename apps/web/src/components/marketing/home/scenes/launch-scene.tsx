"use client";

import {
	type Act,
	Bar,
	Check,
	Phone,
	Stage,
	Text,
	Window,
} from "@/components/stageshow/kit";
import "./launch-scene.css";

const desktop = "/images/home/services/owl-desktop.webp";
const phone = "/images/home/services/owl-phone.webp";

// Service card "Launch": a site going from design to live. The frame opens
// full: the designed page stands on the big screen and Design is ticked.
// Beats: the page draws in on the phone, top to bottom, while Build is in
// progress; Build is ticked; the address goes live (its dot turns green).
// No pointer: this is what the work does, not a gesture. The phone is there
// from the first frame, over the frame's right edge, so nothing of the page
// is cut mid-word.
//
// Both screens are a client's live site, unretouched. The only words are the
// address and the three steps.

type Locale = "de" | "en";
interface S {
	phone: boolean;
	step: number;
}

const STEPS = {
	en: ["Design", "Build", "Live"],
	de: ["Design", "Umsetzung", "Live"],
} as const;

const initial: S = { step: 1, phone: false };
const poster: S = { step: 3, phone: true };

async function script(a: Act<S>) {
	await a.wait(450);
	a.mark("build");
	a.put({ phone: true });
	await a.wait(1600);
	a.put({ step: 2 });
	await a.wait(800);
	a.mark("live");
	a.put({ step: 3 });
	await a.wait(2800);
}

export default function LaunchScene({ locale }: { locale: Locale }) {
	return (
		<Stage<S>
			className="wvl"
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
					<Window
						className="wvl-win"
						url={
							<>
								<span className="wvl-dot" data-on={s.step >= 3 || undefined} />
								oldworldlabs.com
							</>
						}
					>
						<div className="wvl-page">
							<div className="wvl-wire">
								<Bar h={14} r={7} tone={2} w={150} />
								<div className="wvl-wire-hero">
									<Bar h={9} tone={3} w={120} />
									<Bar h={9} tone={3} w={86} />
									<Bar h={16} r={8} tone={2} w={64} />
								</div>
							</div>
							<img
								alt=""
								className="wvl-real"
								data-on={s.step >= 1 || undefined}
								src={desktop}
							/>
						</div>
					</Window>

					<Phone
						className="wvl-phone"
						frame="pro"
						wallpaper="#f2f2f2"
						width={130}
					>
						<div className="wvl-wire wvl-wire--phone">
							<Bar h={10} r={5} tone={2} w={96} />
							<div className="wvl-wire-hero">
								<Bar h={6} tone={3} w={70} />
								<Bar h={6} tone={3} w={52} />
							</div>
						</div>
						<img
							alt=""
							className="wvl-real wvl-real--phone"
							data-on={s.phone || undefined}
							src={phone}
						/>
					</Phone>

					<div className="wvl-steps">
						{STEPS[locale].map((label, i) => (
							<span
								className="wvl-step"
								data-done={s.step > i || undefined}
								key={label}
							>
								<Check on={s.step > i} pending={s.step === i} size={13} />
								<Text>{label}</Text>
							</span>
						))}
					</div>
				</>
			)}
		</Stage>
	);
}
