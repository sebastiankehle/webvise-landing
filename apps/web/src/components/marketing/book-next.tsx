import { Check, Mic, Video } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, H3, Lead } from "@/components/ui/typography";

const DAYS = ["12", "13", "14", "15", "16"] as const;
const TIMES = ["10:00", "14:30", "16:00"] as const;
const planKeys = ["0", "1", "2", "3"] as const;
const stepKeys = ["0", "1", "2"] as const;

/** A slot being picked: one day and one time are taken. */
function SlotPicture() {
	return (
		<div className="flex w-[15.5rem] flex-col gap-2.5 rounded-[12px] bg-card p-3 shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_16px_32px_-20px_rgba(14,18,23,0.4)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
			<div className="grid grid-cols-5 gap-1.5">
				{DAYS.map((day, index) => (
					<span
						className={`flex h-9 items-center justify-center rounded-[7px] text-sm tabular-nums ${
							index === 2
								? "bg-foreground/[0.07] text-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.14)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
								: "text-muted-foreground"
						}`}
						key={day}
					>
						{day}
					</span>
				))}
			</div>
			<div className="grid grid-cols-3 gap-1.5">
				{TIMES.map((time, index) => (
					<span
						className={`flex h-8 items-center justify-center rounded-[7px] text-sm tabular-nums ${
							index === 1
								? "bg-foreground text-background"
								: "text-muted-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
						}`}
						key={time}
					>
						{time}
					</span>
				))}
			</div>
		</div>
	);
}

/** The call itself: Sebastian on screen, thirty minutes on the clock. */
export function CallPicture({ name }: { name: string }) {
	return (
		<div className="flex w-[15.5rem] flex-col gap-3 rounded-[12px] bg-[#0e1217] p-3 shadow-[0_16px_32px_-20px_rgba(14,18,23,0.6)]">
			<div className="flex items-center gap-2.5">
				<span className="relative size-9 shrink-0 overflow-hidden rounded-full">
					<Image
						alt=""
						className="object-cover"
						fill
						sizes="36px"
						src="/images/founder.jpeg"
					/>
				</span>
				<span className="min-w-0 flex-1 truncate text-sm text-white">
					{name}
				</span>
				<span className="rounded-full bg-white/10 px-2 py-0.5 text-white/80 text-xs tabular-nums">
					30:00
				</span>
			</div>
			<div className="flex items-center gap-1.5">
				<span className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80">
					<Mic aria-hidden="true" className="size-3.5" />
				</span>
				<span className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80">
					<Video aria-hidden="true" className="size-3.5" />
				</span>
				<span className="ml-auto h-1.5 w-16 rounded-full bg-white/10">
					<span className="block h-full w-1/3 rounded-full bg-brand" />
				</span>
			</div>
		</div>
	);
}

/** The plan that comes back: four things settled before any work. */
export function PlanPicture({ rows }: { rows: string[] }) {
	return (
		<ul className="flex w-[15.5rem] flex-col gap-2 rounded-[12px] bg-card p-3.5 shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_16px_32px_-20px_rgba(14,18,23,0.4)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
			{rows.map((row) => (
				<li
					className="flex items-center gap-2.5 text-foreground text-sm"
					key={row}
				>
					<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
						<Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
					</span>
					{row}
				</li>
			))}
		</ul>
	);
}

/** What follows a booking, in three steps, each with its own small picture. */
export default async function BookNext() {
	const t = await getTranslations("book");
	const pictures: Record<(typeof stepKeys)[number], ReactNode> = {
		"0": <SlotPicture />,
		"1": <CallPicture name="Sebastian Kehle" />,
		"2": <PlanPicture rows={planKeys.map((key) => t(`next.plan.${key}`))} />,
	};

	return (
		<>
			<H2>{t("next.title")}</H2>
			<Lead className="mt-4">{t("next.lead")}</Lead>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">
				{stepKeys.map((key, index) => (
					<div
						className="flex flex-col rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
						key={key}
					>
						<div
							aria-hidden="true"
							className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
						>
							<div className="scale-110 lg:scale-125">{pictures[key]}</div>
						</div>
						<div className="px-4 pt-4 pb-3 md:px-5">
							<p className="text-muted-foreground text-sm tabular-nums">
								0{index + 1}
							</p>
							<H3 className="mt-1.5 text-xl leading-snug">
								{t(`next.steps.${key}.title`)}
							</H3>
							<p className="mt-2 text-base text-muted-foreground leading-[1.6]">
								{t(`next.steps.${key}.description`)}
							</p>
						</div>
					</div>
				))}
			</StaggerChildren>
		</>
	);
}
