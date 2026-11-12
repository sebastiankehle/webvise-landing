"use client";

import { Globe, Check as Tick } from "lucide-react";
import {
	type Act,
	Popover,
	Stage,
	Swap,
	Text,
	Window,
} from "@/components/stageshow/kit";

const banner = "/images/home/work/owl/banner.webp";
const logo = "/images/home/work/owl/logo.webp";
import "./project-owl.css";

// project card: Old World Labs speaks seven languages. Beats: the
// pointer opens the site's language menu; all seven are there; it picks
// Japanese; the menu closes and the navigation reads in Japanese. Plays once.
//
// Real strings: the seven language names as the site lists them, and the
// navigation in English and Japanese from the site's own message files. The
// picture is the site's first screen, above its headline.

type Lang = "en" | "ja";
interface S {
	lang: Lang;
	menu: boolean;
}

const NAV: Record<Lang, string[]> = {
	en: ["Home", "About", "Services", "Contact"],
	ja: ["ホーム", "会社概要", "サービス", "お問い合わせ"],
};
const LANGS = [
	{ code: "en", name: "English" },
	{ code: "de", name: "Deutsch" },
	{ code: "fr", name: "Français" },
	{ code: "es", name: "Español" },
	{ code: "ru", name: "Русский" },
	{ code: "ja", name: "日本語" },
	{ code: "zh", name: "中文" },
];

const initial: S = { menu: false, lang: "en" };
const poster: S = { menu: false, lang: "ja" };

async function script(a: Act<S>) {
	await a.wait(1200);
	a.mark("open");
	await a.move("globe");
	await a.wait(180);
	await a.click("globe");
	a.put({ menu: true });
	await a.wait(700);
	a.mark("pick");
	await a.move({ at: "ja", x: 0.7, y: 0.55 }, { duration: 650 });
	await a.wait(220);
	await a.click({ at: "ja", x: 0.7, y: 0.55 });
	a.put({ menu: false, lang: "ja" });
	await a.move("rest", { duration: 700 });
	await a.wait(2600);
}

export default function OwlScene() {
	return (
		<Stage<S>
			className="wpo"
			cursor={{ at: { x: 150, y: 190 } }}
			fill
			height={250}
			initial={initial}
			play="once"
			poster={poster}
			script={script}
			width={400}
		>
			{(s, rect) => {
				const globe = rect("globe");
				return (
					<>
						<Window className="wpo-win" url="oldworldlabs.com">
							<div className="wpo-page">
								<nav className="wpo-nav">
									<img alt="" className="wpo-logo" src={logo} />
									<div className="wpo-links">
										{NAV[s.lang].map((label, i) => (
											<span
												className="wpo-link"
												data-on={i === 0 || undefined}
												key={NAV.en[i]}
											>
												<Swap id={s.lang}>{label}</Swap>
											</span>
										))}
									</div>
									<span
										className="wpo-globe"
										data-cursor="pointer"
										data-open={s.menu || undefined}
										data-target="globe"
									>
										<Globe size={12} strokeWidth={1.7} />
									</span>
									<span className="wpo-mail">Email OWL</span>
								</nav>
								<div className="wpo-hero">
									<img alt="" src={banner} />
									<span className="wpo-rest" data-target="rest" />
								</div>
							</div>
						</Window>

						{globe && (
							<Popover
								className="wpo-menu"
								origin="top right"
								show={s.menu}
								style={{
									left: globe.x + globe.width - 108,
									top: globe.y + globe.height + 4,
								}}
							>
								{LANGS.map((lang) => (
									<span
										className="wpo-lang"
										data-current={lang.code === "en" || undefined}
										data-target={lang.code === "ja" ? "ja" : undefined}
										key={lang.code}
									>
										<Text>{lang.name}</Text>
										{lang.code === "en" && <Tick size={9} strokeWidth={2.6} />}
									</span>
								))}
							</Popover>
						)}
					</>
				);
			}}
		</Stage>
	);
}
