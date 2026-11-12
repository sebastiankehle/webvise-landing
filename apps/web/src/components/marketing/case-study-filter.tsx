"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

const chip =
	"inline-flex h-9 items-center rounded-sm px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/70";

/** The project grid with a row of fields above it. Picking a field keeps the
 * projects that back that field's page; "all" shows every project. */
export default function CaseStudyFilter({
	all,
	fields,
	items,
	label,
}: {
	all: string;
	fields: { key: string; name: string; slugs: string[] }[];
	items: { node: ReactNode; slug: string }[];
	label: string;
}) {
	const [field, setField] = useState<string | null>(null);
	const slugs = fields.find((entry) => entry.key === field)?.slugs;
	const shown = slugs
		? items.filter((item) => slugs.includes(item.slug))
		: items;

	return (
		<>
			<fieldset className="flex flex-wrap gap-2">
				<legend className="sr-only">{label}</legend>
				{[{ key: null, name: all }, ...fields].map((entry) => (
					<button
						aria-pressed={field === entry.key}
						className={cn(
							chip,
							field === entry.key
								? "border border-foreground bg-foreground text-background"
								: "border border-foreground/15 text-foreground hover:bg-foreground/[0.06]"
						)}
						key={entry.key ?? "all"}
						onClick={() => setField(entry.key)}
						type="button"
					>
						{entry.name}
					</button>
				))}
			</fieldset>
			<div
				aria-live="polite"
				className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
			>
				{shown.map((item) => (
					<div className="contents" key={item.slug}>
						{item.node}
					</div>
				))}
			</div>
		</>
	);
}
