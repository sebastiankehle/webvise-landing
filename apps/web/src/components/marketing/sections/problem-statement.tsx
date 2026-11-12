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

const bar = "h-1.5 rounded-full bg-foreground/15";
const row =
	"flex items-center gap-2 border-foreground/[0.07] border-b py-[7px]";

/** The four places the sentence names, each as a scrap of its own screen. */
const pieces: { key: string; picture: ReactNode; turn: number }[] = [
	{
		key: "sheets",
		turn: -5,
		picture: (
			<div className="grid h-full grid-cols-4 grid-rows-4 gap-px overflow-hidden rounded-[6px] bg-foreground/10">
				{Array.from({ length: 16 }, (_, cell) => (
					<span
						className={`flex items-center px-1.5 ${
							cell < 4 ? "bg-foreground/[0.05]" : "bg-card"
						} ${cell === 9 ? "shadow-[inset_0_0_0_1.5px_var(--brand)]" : ""}`}
						// biome-ignore lint/suspicious/noArrayIndexKey: a fixed grid of cells
						key={cell}
					>
						{cell % 3 === 1 ? null : (
							<span className={`${bar} ${cell % 2 ? "w-2/3" : "w-full"}`} />
						)}
					</span>
				))}
			</div>
		),
	},
	{
		key: "inboxes",
		turn: 3,
		picture: (
			<div className="flex h-full flex-col justify-center">
				{[true, true, false, false].map((unread, mail) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed list of mails
					<div className={row} key={mail}>
						<span
							className={`size-1.5 flex-none rounded-full ${
								unread ? "bg-brand" : "bg-foreground/15"
							}`}
						/>
						<span className={`${bar} w-9 flex-none`} />
						<span
							className={`${bar} ${mail % 2 ? "w-1/2" : "flex-1"} ${
								unread ? "bg-foreground/35" : ""
							}`}
						/>
					</div>
				))}
			</div>
		),
	},
	{
		key: "admin",
		turn: -2,
		picture: (
			<div className="flex h-full flex-col justify-center">
				{[true, false, true].map((on, setting) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed list of settings
					<div className={`${row} justify-between`} key={setting}>
						<span className={`${bar} ${setting === 1 ? "w-16" : "w-24"}`} />
						<span
							className={`flex h-3.5 w-6 flex-none items-center rounded-full px-0.5 ${
								on ? "justify-end bg-brand" : "bg-foreground/15"
							}`}
						>
							<span className="size-2.5 rounded-full bg-card" />
						</span>
					</div>
				))}
				<span className="mt-2.5 h-5 w-14 self-end rounded-[5px] bg-foreground/80" />
			</div>
		),
	},
	{
		key: "ai",
		turn: 6,
		picture: (
			<div className="flex h-full flex-col justify-between">
				<div className="grid gap-1.5">
					<span className="h-5 w-3/5 justify-self-end rounded-[8px] rounded-br-[3px] bg-foreground/80" />
					<span className="grid w-4/5 gap-1 rounded-[8px] rounded-bl-[3px] bg-foreground/[0.07] p-2">
						<span className={bar} />
						<span className={`${bar} w-2/3`} />
					</span>
				</div>
				<span className="flex h-6 items-center rounded-full px-2.5 shadow-[inset_0_0_0_1px_rgba(14,18,23,0.12)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
					<span className="h-3 w-px bg-brand" />
				</span>
			</div>
		),
	},
];

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<SectionWrapper className="md:py-28" id="problem" surface="alternate">
			<ScrollFillHeading text={`${t("known")} ${t("pain")}`} />
			<ul className="mx-auto mt-12 grid max-w-[1040px] grid-cols-2 gap-x-4 gap-y-8 md:mt-16 md:grid-cols-4 md:gap-x-5">
				{pieces.map((piece, place) => (
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
