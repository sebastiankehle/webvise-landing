"use client";

import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** The six steps, with the classes of the site's own components so each row
 * shows the size the site uses at this width. */
const STEP_CLASSES = {
	display:
		"text-[2.25rem] leading-[1.05] tracking-[-0.035em] sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.02] font-medium",
	title:
		"text-3xl leading-[1.1] tracking-[-0.03em] md:text-5xl md:leading-[1.06] font-medium",
	section:
		"text-[1.75rem] leading-[1.12] tracking-[-0.028em] md:text-[2.5rem] md:leading-[1.08] font-medium",
	heading: "text-lg leading-snug tracking-[-0.015em] font-medium",
	body: "text-base leading-7 font-normal tracking-normal",
	small: "text-sm leading-6 font-normal tracking-normal",
} as const;

export type TypeStepKey = keyof typeof STEP_CLASSES;

export interface TypeStep {
	key: TypeStepKey;
	name: string;
	spec: string;
}

export function TypeTester({
	label,
	sample,
	steps,
}: {
	label: string;
	sample: string;
	steps: readonly TypeStep[];
}) {
	const [text, setText] = useState(sample);
	const inputId = useId();
	const shown = text.trim() ? text : sample;

	return (
		<div>
			<label className="block text-muted-foreground text-sm" htmlFor={inputId}>
				{label}
			</label>
			<Input
				autoComplete="off"
				className="mt-2 h-11 rounded-sm bg-background px-3.5 text-base sm:max-w-md md:text-base"
				id={inputId}
				maxLength={80}
				onChange={(event) => setText(event.target.value)}
				spellCheck={false}
				type="text"
				value={text}
			/>
			<div className="mt-8 border-grid-line border-t">
				{steps.map(({ key, name, spec }) => (
					<div
						className="grid gap-2 border-grid-line border-b py-6 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-baseline sm:gap-8"
						key={key}
					>
						<p
							className={cn(
								"min-w-0 break-words font-display text-foreground",
								STEP_CLASSES[key]
							)}
						>
							{shown}
						</p>
						<p className="text-sm leading-6 sm:text-right">
							<span className="block text-foreground">{name}</span>
							<span className="block text-muted-foreground tabular-nums">
								{spec}
							</span>
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
