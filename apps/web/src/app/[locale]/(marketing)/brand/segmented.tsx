"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A row of pill buttons, as the language switcher draws them. */
export function Segmented({
	children,
	label,
}: {
	children: ReactNode;
	label: string;
}) {
	return (
		<fieldset className="m-0 inline-flex h-9 min-w-0 shrink-0 items-center rounded-full border border-foreground/15 p-0.5 text-sm">
			<legend className="sr-only">{label}</legend>
			{children}
		</fieldset>
	);
}

/** One pill. It presses to 0.98 in 150 ms, as the site's buttons do. */
export function Option({
	children,
	onClick,
	selected,
}: {
	children: ReactNode;
	onClick: () => void;
	selected: boolean;
}) {
	return (
		<button
			aria-pressed={selected}
			className={cn(
				"inline-flex h-[1.875rem] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 font-medium outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-[0.98]",
				selected
					? "bg-card text-foreground shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_1px_2px_rgba(14,18,23,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
					: "text-muted-foreground hover:text-foreground"
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}
