"use client";

import { Cormorant_Garamond, Geist } from "next/font/google";
import { useEffect, useRef, useState } from "react";

import "./project-vp.css";

/** von Platen Coaching in one picture: the opening statement of the site and
 * its stress scale. The marker starts at the exhausted end and comes to rest
 * in the middle, where her note says the work begins. Words and colours are
 * the site's own, in the language of the page. */

// The scene sits below the first screen: its faces load with it, not ahead.
const sans = Geist({ display: "swap", preload: false, subsets: ["latin"] });
const serif = Cormorant_Garamond({
	display: "swap",
	preload: false,
	style: "italic",
	subsets: ["latin"],
	weight: "500",
});

type Locale = "de" | "en";

const copy = {
	de: {
		line: "Stress ist das Symptom.",
		lever: "Der Hebel zur Bewältigung ist",
		turn: "die Perspektive.",
		scale: [
			"Flaute, Sinnverlust",
			"Motivierender Stress",
			"Erschöpfung, Zynismus",
		],
		note: "Wir starten dort, wo Sie gerade stehen.",
		rest: " Nicht dort, wo Sie sein sollten.",
	},
	en: {
		line: "Stress is the symptom.",
		lever: "The lever that shifts it is",
		turn: "perspective.",
		scale: [
			"Flat, loss of meaning",
			"Motivating stress",
			"Exhaustion, cynicism",
		],
		note: "We start where you are right now.",
		rest: " Not where you think you should be.",
	},
};

const DESIGN_WIDTH = 800;
const label = "w-1/3 text-[11px] uppercase tracking-[0.06em]";

export default function VpScene({ locale }: { locale: Locale }) {
	const root = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0);
	const t = copy[locale];

	useEffect(() => {
		const el = root.current;
		if (!el) {
			return;
		}
		const fit = new ResizeObserver(() =>
			setScale(el.clientWidth / DESIGN_WIDTH)
		);
		fit.observe(el);
		const seen = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					el.dataset.seen = "true";
					seen.disconnect();
				}
			},
			{ threshold: 0.4 }
		);
		seen.observe(el);
		return () => {
			fit.disconnect();
			seen.disconnect();
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			className={`vp-scene absolute inset-0 overflow-hidden ${sans.className}`}
			ref={root}
		>
			<div
				className="absolute top-0 left-0 h-[500px] w-[800px] origin-top-left px-[56px] py-[44px]"
				style={{
					scale: String(scale),
					visibility: scale ? "visible" : "hidden",
				}}
			>
				<div className={`${serif.className} text-[22px] text-white/90`}>
					vonplaten-coaching
				</div>

				<div className="mt-[52px] font-medium text-[40px] leading-[1.12] tracking-[-0.02em]">
					<div>{t.line}</div>
					<div>{t.lever}</div>
					<div
						className={`${serif.className} font-medium text-[48px] text-[var(--vp-soft)] leading-[1.05] tracking-normal`}
					>
						{t.turn}
					</div>
				</div>

				<div className="absolute right-[56px] bottom-[52px] left-[56px]">
					<div className="relative h-2">
						<div className="vp-bar absolute inset-0 rounded-full" />
						<span className="vp-marker absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--vp-ground)] shadow-[0_0_0_2px_#ffffff]" />
					</div>
					<div className="mt-4 flex justify-between text-[var(--vp-soft)]">
						<span className={label}>{t.scale[0]}</span>
						<span className={`vp-mid ${label} text-center`}>{t.scale[1]}</span>
						<span className={`${label} text-right`}>{t.scale[2]}</span>
					</div>
					<p className="vp-note mt-5 text-[16px] text-[var(--vp-soft)]">
						<span className={`${serif.className} text-[20px] text-white`}>
							{t.note}
						</span>
						{t.rest}
					</p>
				</div>
			</div>
		</div>
	);
}
