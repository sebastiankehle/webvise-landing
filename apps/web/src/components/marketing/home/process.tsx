import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const stepKeys = [
	"discovery",
	"planning",
	"execution",
	"optimization",
	"launch",
] as const;

type StepKey = (typeof stepKeys)[number];

const chip =
	"rounded-full bg-card px-2.5 py-1 text-[0.75rem] text-foreground shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_1px_2px_rgba(14,18,23,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]";
const bar = "h-1.5 rounded-full";

/** A small drawing per step, built only from what the step's own text says. */
function StepSketch({
	callFacts,
	step,
}: {
	callFacts: string[];
	step: StepKey;
}) {
	const sketches: Record<StepKey, ReactNode> = {
		// The first call: 30 minutes, by video, with Sebastian
		discovery: (
			<div className="flex flex-wrap content-center justify-center gap-1.5">
				{callFacts.map((fact, index) => (
					<span
						className={chip}
						key={fact}
						style={{ rotate: `${[-2, 1.5, -1][index % 3]}deg` }}
					>
						{fact}
					</span>
				))}
			</div>
		),
		// A roadmap: three tracks with their milestones
		planning: (
			<div className="grid w-full gap-2.5 px-4">
				{[
					{ left: "0%", width: "46%", mark: "40%" },
					{ left: "22%", width: "54%", mark: "62%" },
					{ left: "48%", width: "52%", mark: "88%" },
				].map((track) => (
					<div className="relative h-1.5" key={track.left}>
						<span className={`${bar} absolute inset-0 bg-foreground/[0.07]`} />
						<span
							className={`${bar} absolute top-0 bg-foreground/60`}
							style={{ left: track.left, width: track.width }}
						/>
						<span
							className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-brand shadow-[0_0_0_2px_var(--card)]"
							style={{ left: track.mark }}
						/>
					</div>
				))}
			</div>
		),
		// Weekly demos: one preview after the other goes online
		execution: (
			<div className="grid w-full gap-1.5 px-3">
				{["72%", "58%", "66%"].map((width, index) => (
					<div
						className="flex items-center gap-2 rounded-[7px] bg-card px-2 py-1.5 shadow-[0_0_0_1px_rgba(14,18,23,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
						key={width}
					>
						<span
							className={`size-1.5 shrink-0 rounded-full ${index === 0 ? "bg-success" : "bg-foreground/25"}`}
						/>
						<span className={`${bar} bg-foreground/15`} style={{ width }} />
						<span className="ml-auto text-[0.625rem] text-foreground/45 tabular-nums">
							{`#${3 - index}`}
						</span>
					</div>
				))}
			</div>
		),
		// The checks before launch, each one passed
		optimization: (
			<div className="flex items-center justify-center gap-2.5">
				{[0, 1, 2, 3].map((ring) => (
					<span
						className="flex size-9 items-center justify-center rounded-full text-success shadow-[inset_0_0_0_2px_currentColor]"
						key={ring}
					>
						<Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
					</span>
				))}
			</div>
		),
		// Live, and watched afterwards
		launch: (
			<div className="flex w-full flex-col items-center gap-3 px-4">
				<span className={`${chip} flex items-center gap-1.5 font-medium`}>
					<span className="relative flex size-2">
						<span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
						<span className="relative size-2 rounded-full bg-success" />
					</span>
					Live
				</span>
				<div className="flex h-5 w-full items-end gap-[3px]">
					{[60, 72, 64, 80, 70, 86, 78, 92, 84, 96, 88, 100].map(
						(height, index) => (
							<span
								className="flex-1 rounded-[2px] bg-success/45"
								// biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
								key={index}
								style={{ height: `${height}%` }}
							/>
						)
					)}
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
						>
							<StepSketch callFacts={callFacts} step={key} />
							<div className="px-3 pt-4 pb-3">
								<span
									aria-hidden="true"
									className="block h-0.5 overflow-hidden rounded-full bg-foreground/10"
								>
									<span
										className="process-step-line block h-full origin-left bg-brand"
										style={{ ["--step" as string]: index }}
									/>
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
