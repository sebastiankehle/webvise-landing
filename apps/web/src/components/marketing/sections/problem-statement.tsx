import { getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { DisplayH2 } from "@/components/ui/typography";

import "./problem-statement.css";

function ScrollFillHeading({ text }: { text: string }) {
	const chars = Array.from(text).map((char, index) => ({
		char,
		index,
		key: `${text.slice(0, index)}${char}`,
	}));

	return (
		<DisplayH2 className="max-w-none md:text-[2.5rem] md:leading-[1.12]">
			{chars.map(({ char, index, key }) => (
				<span
					className="scroll-fill-char"
					key={key}
					style={
						{
							"--i": index,
							"--n": chars.length,
						} as CSSProperties
					}
				>
					{char}
				</span>
			))}
		</DisplayH2>
	);
}

const row =
	"flex items-center gap-1.5 border-foreground/[0.07] border-b py-[3px] md:py-[6px]";
const tiny = "text-[0.5rem] leading-none md:text-[0.625rem]";

type Translate = (key: string) => string;

/** The four places the sentence names, each as a scrap of its own screen with
 * the few words that make it recognizable, and the one thing wrong in it. */
function pieces(
	t: Translate
): { key: string; picture: ReactNode; turn: number }[] {
	const cols = [0, 1, 2, 3];
	return [
		{
			key: "sheets",
			turn: -5,
			// A sheet with a broken cell where a figure should be
			picture: (
				<div
					className={`grid h-full grid-cols-[1.2fr_1fr_1.2fr] grid-rows-4 gap-px overflow-hidden rounded-[6px] bg-foreground/10 md:grid-cols-[1.25fr_1fr_1.1fr_0.8fr] ${tiny}`}
				>
					{cols.map((col) => (
						<span
							className={`items-center bg-foreground/[0.05] px-1 font-medium text-foreground/70 ${col === 3 ? "hidden md:flex" : "flex"}`}
							key={`head-${col}`}
						>
							{t(`sketch.sheet.cols.${col}`)}
						</span>
					))}
					{[0, 1, 2].map((line) =>
						cols.map((col) => {
							const broken = line === 1 && col === 2;
							return (
								<span
									className={`items-center truncate bg-card px-1 ${col === 3 ? "hidden md:flex" : "flex"} ${
										broken
											? "font-medium text-brand shadow-[inset_0_0_0_1.5px_var(--brand)]"
											: "text-foreground/65"
									} ${col === 2 && !broken ? "justify-end tabular-nums" : ""}`}
									key={`${line}-${col}`}
								>
									{t(`sketch.sheet.rows.${line}.${col}`)}
								</span>
							);
						})
					)}
				</div>
			),
		},
		{
			key: "inboxes",
			turn: 3,
			// Threads that keep coming back
			picture: (
				<div className="flex h-full flex-col justify-center">
					{[true, true, false, false].map((unread, mail) => (
						<div
							className={`${row} ${tiny}`}
							key={t(`sketch.inbox.${mail}.from`)}
						>
							<span
								className={`size-1.5 flex-none rounded-full ${
									unread ? "bg-brand" : "bg-foreground/15"
								}`}
							/>
							<span
								className={`w-7 flex-none md:w-9 ${unread ? "font-medium text-foreground" : "text-foreground/55"}`}
							>
								{t(`sketch.inbox.${mail}.from`)}
							</span>
							<span
								className={`min-w-0 truncate ${unread ? "text-foreground/80" : "text-foreground/50"}`}
							>
								{t(`sketch.inbox.${mail}.subject`)}
							</span>
						</div>
					))}
				</div>
			),
		},
		{
			key: "admin",
			turn: -2,
			// Settings someone once switched, and nobody knows why
			picture: (
				<div className="flex h-full flex-col justify-center">
					{[true, false, true].map((on, setting) => (
						<div
							className={`${row} ${tiny} justify-between text-foreground/70`}
							key={t(`sketch.admin.${setting}`)}
						>
							<span className="truncate">{t(`sketch.admin.${setting}`)}</span>
							<span
								className={`flex h-3 w-5 flex-none items-center rounded-full px-0.5 md:h-3.5 md:w-6 ${
									on ? "justify-end bg-brand" : "bg-foreground/15"
								}`}
							>
								<span className="size-2 rounded-full bg-card md:size-2.5" />
							</span>
						</div>
					))}
					<span
						className={`mt-1.5 flex h-4 flex-none items-center self-end rounded-[4px] bg-foreground/80 px-2 text-background md:h-5 ${tiny}`}
					>
						{t("sketch.admin.save")}
					</span>
				</div>
			),
		},
		{
			key: "ai",
			turn: 6,
			// An assistant that answers from two sources that disagree
			picture: (
				<div className={`flex h-full flex-col justify-between ${tiny}`}>
					<div className="grid gap-1.5">
						<span className="max-w-[85%] justify-self-end text-balance rounded-[7px] rounded-br-[2px] bg-foreground/80 px-1.5 py-1 text-background leading-[1.3]">
							{t("sketch.ai.question")}
						</span>
						<span className="max-w-[85%] text-balance rounded-[7px] rounded-bl-[2px] bg-foreground/[0.07] px-1.5 py-1 text-foreground/80 leading-[1.3]">
							{t("sketch.ai.answer")}
						</span>
					</div>
					<span className="flex h-5 items-center rounded-full px-2 shadow-[inset_0_0_0_1px_rgba(14,18,23,0.12)] md:h-6 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
						<span className="h-2.5 w-px bg-brand" />
					</span>
				</div>
			),
		},
	];
}

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<SectionWrapper className="md:py-28" id="problem" surface="alternate">
			<ScrollFillHeading text={`${t("known")} ${t("pain")}`} />
			<ul className="mx-auto mt-12 grid max-w-[1040px] grid-cols-2 gap-x-4 gap-y-8 md:mt-16 md:grid-cols-4 md:gap-x-5">
				{pieces((key) => t(key)).map((piece, place) => (
					<li
						className={place % 2 ? "mt-4 md:mt-5" : undefined}
						key={piece.key}
					>
						<div
							aria-hidden="true"
							className="aspect-[16/11] rounded-[12px] bg-card p-3 ps-piece shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_18px_30px_-22px_rgba(14,18,23,0.45)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
							style={
								{
									"--dx": `calc(${1.5 - place} * (100% + 20px))`,
									"--dx-small": `calc(${0.5 - (place % 2)} * (100% + 16px))`,
									"--dy-small": `calc(${0.5 - Math.floor(place / 2)} * (100% + 60px))`,
									"--r": `${piece.turn}deg`,
								} as CSSProperties
							}
						>
							{piece.picture}
						</div>
						<p className="mt-4 ps-label text-center text-base text-muted-foreground">
							{t(`places.${piece.key}`)}
						</p>
					</li>
				))}
			</ul>
		</SectionWrapper>
	);
}
