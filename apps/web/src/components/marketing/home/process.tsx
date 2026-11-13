import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

import "./process.css";

const stepKeys = [
	"discovery",
	"planning",
	"execution",
	"optimization",
	"launch",
] as const;

type StepKey = (typeof stepKeys)[number];

const chip =
	"rounded-full bg-card px-2 py-0.5 text-[0.6875rem] text-foreground shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_1px_2px_rgba(14,18,23,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]";
const bar = "h-1.5 rounded-full";

// The roadmap: three tracks, each with its planned stretch and milestone.
const TRACKS = [
	{ left: 0, width: 46, mark: 40 },
	{ left: 22, width: 54, mark: 62 },
	{ left: 48, width: 52, mark: 88 },
];
// Monitoring after launch: a day of traffic, drawn twice for a seamless run.
const TRAFFIC = [
	42, 55, 48, 63, 58, 70, 66, 78, 72, 84, 76, 90, 82, 68, 74, 60,
];

/** A small scene per step, built only from what the step's own text says.
 * Each one keeps playing quietly once the steps are in view. */
function StepSketch({
	callFacts,
	step,
	you,
}: {
	callFacts: string[];
	step: StepKey;
	you: string;
}) {
	const sketches: Record<StepKey, ReactNode> = {
		// The first call, by video, with Sebastian: the two take turns
		// speaking, and the level shows who is talking
		discovery: (
			<div className="flex w-full flex-col items-center gap-2.5 px-3">
				<div className="flex items-center gap-3">
					<span className="pc-speaker pc-speaker-a relative size-9 rounded-full">
						<Image
							alt=""
							className="rounded-full object-cover"
							fill
							sizes="36px"
							src="/images/founder.jpeg"
						/>
					</span>
					<span className="flex h-6 items-center gap-[3px]">
						{[0, 1, 2, 3, 4, 5, 6].map((level) => (
							<i
								className="pc-level block h-full w-[3px] rounded-full bg-brand"
								key={level}
								style={{ ["--i" as string]: level }}
							/>
						))}
					</span>
					<span className="pc-speaker pc-speaker-b grid size-9 place-items-center rounded-full bg-foreground/[0.08] font-medium text-[0.6875rem] text-foreground/70">
						{you}
					</span>
				</div>
				<div className="flex flex-wrap justify-center gap-1">
					{callFacts.map((fact) => (
						<span className={chip} key={fact}>
							{fact}
						</span>
					))}
				</div>
			</div>
		),
		// A roadmap: today's line moves across it, the work fills in behind
		// it, and each milestone lights up as the line reaches it
		planning: (
			<div className="w-full px-4">
				<div className="pc-plan relative grid gap-2.5">
					{TRACKS.map((track, index) => (
						<div className="relative h-1.5" key={track.left}>
							<span
								className={`${bar} absolute inset-0 bg-foreground/[0.07]`}
							/>
							<span
								className={`${bar} absolute top-0 bg-foreground/20`}
								style={{ left: `${track.left}%`, width: `${track.width}%` }}
							/>
							<span
								className={`${bar} pc-done pc-done-${index} absolute top-0 bg-foreground/65`}
								style={{ left: `${track.left}%`, width: `${track.width}%` }}
							/>
							<span
								className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
								style={{ left: `${track.mark}%` }}
							>
								<span
									className={`pc-mile pc-mile-${index} block size-2.5 rotate-45`}
								/>
							</span>
						</div>
					))}
					<span className="pc-now absolute -top-2 -bottom-2 left-0 w-px bg-brand" />
				</div>
			</div>
		),
		// Daily deployments: the newest preview builds, goes live and
		// joins the ones before it
		execution: (
			<div className="grid w-full gap-1.5 px-3">
				{[3, 2, 1].map((number) => (
					<div
						className="flex items-center gap-2 rounded-[7px] bg-card px-2 py-1.5 shadow-[0_0_0_1px_rgba(14,18,23,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
						key={number}
					>
						{number === 3 ? (
							<>
								<span className="pc-deploy-dot relative size-1.5 shrink-0 rounded-full" />
								<span
									className={`${bar} relative w-[64%] overflow-hidden bg-foreground/10`}
								>
									<span
										className={`${bar} pc-deploy-fill absolute inset-0 bg-foreground/35`}
									/>
								</span>
								<span className="pc-deploy-live text-[0.625rem] text-success">
									live
								</span>
							</>
						) : (
							<>
								<span className="size-1.5 shrink-0 rounded-full bg-success/55" />
								<span
									className={`${bar} bg-foreground/15`}
									style={{ width: number === 2 ? "56%" : "62%" }}
								/>
							</>
						)}
						<span className="ml-auto text-[0.625rem] text-foreground/45 tabular-nums">
							{`#${number}`}
						</span>
					</div>
				))}
			</div>
		),
		// The checks before launch: each ring fills, then ticks
		optimization: (
			<div className="flex items-center justify-center gap-2.5">
				{[0, 1, 2, 3].map((ring) => (
					<svg
						aria-hidden="true"
						className="size-9 text-success"
						key={ring}
						viewBox="0 0 36 36"
					>
						<circle
							cx="18"
							cy="18"
							fill="none"
							r="15"
							stroke="currentColor"
							strokeOpacity="0.15"
							strokeWidth="2.5"
						/>
						<circle
							className={`pc-ring pc-ring-${ring}`}
							cx="18"
							cy="18"
							fill="none"
							pathLength={1}
							r="15"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="2.5"
							transform="rotate(-90 18 18)"
						/>
						<path
							className={`pc-tick pc-tick-${ring}`}
							d="M12.5 18.5l3.8 3.8 7.4-8"
							fill="none"
							pathLength={1}
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
						/>
					</svg>
				))}
			</div>
		),
		// Live, and watched afterwards: the traffic runs past like a monitor
		launch: (
			<div className="flex w-full flex-col items-center gap-3 px-4">
				<span className={`${chip} flex items-center gap-1.5 font-medium`}>
					<span className="relative flex size-2">
						<span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
						<span className="relative size-2 rounded-full bg-success" />
					</span>
					Live
				</span>
				<div className="relative h-6 w-full overflow-hidden">
					<div className="pc-traffic flex h-full w-[200%] items-end gap-[3px]">
						{[...TRAFFIC, ...TRAFFIC].map((height, index) => (
							<span
								className="flex-1 rounded-[2px] bg-success/45"
								// biome-ignore lint/suspicious/noArrayIndexKey: the same bars twice, for the loop
								key={index}
								style={{ height: `${height}%` }}
							/>
						))}
					</div>
				</div>
			</div>
		),
	};

	return (
		<div
			aria-hidden="true"
			className="flex h-28 items-center justify-center overflow-hidden rounded-[14px] bg-foreground/[0.03] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
		>
			{sketches[step]}
		</div>
	);
}

export default async function Process() {
	const [t, tb] = await Promise.all([
		getTranslations("process"),
		getTranslations("book"),
	]);
	const callFacts = [tb("facts.0"), tb("facts.1"), tb("facts.2")];

	return (
		<SectionWrapper id="process">
			<SectionHeading description={t("subtitle")} title={t("title")} />
			{/* The order is carried by the list itself and by the line that
			    draws through the steps once they come into view. */}
			<StaggerChildren className="process-steps mt-10 md:mt-14">
				<ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{stepKeys.map((key, index) => (
						<li
							className="flex flex-col rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] last:sm:col-span-2 last:lg:col-span-1 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
							key={key}
							style={{ ["--step" as string]: index }}
						>
							<StepSketch callFacts={callFacts} step={key} you={t("you")} />
							<div className="px-3 pt-4 pb-3">
								<span
									aria-hidden="true"
									className="block h-0.5 overflow-hidden rounded-full bg-foreground/10"
								>
									<span className="process-step-line block h-full origin-left bg-brand" />
								</span>
								<h3 className="mt-4 font-display text-foreground text-lg leading-snug">
									{t(`steps.${key}.title`)}
								</h3>
								<p className="mt-1.5 text-muted-foreground text-sm leading-6">
									{t(`steps.${key}.description`)}
								</p>
							</div>
						</li>
					))}
				</ol>
			</StaggerChildren>
		</SectionWrapper>
	);
}
