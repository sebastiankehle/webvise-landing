import type { ReactNode } from "react";

/** Client quotes for a phone: whole cards one under the other, nothing that
 * moves or runs off the edge. The first three show; the rest open below. */
export function QuoteStack({
	items,
	more,
}: {
	items: ReactNode[];
	more: string;
}) {
	const rest = items.slice(3);
	return (
		<div className="grid gap-4">
			{items.slice(0, 3)}
			{rest.length > 0 && (
				<details className="group">
					<summary className="flex h-12 cursor-pointer list-none items-center justify-center rounded-sm text-base text-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.14)] outline-none focus-visible:ring-2 focus-visible:ring-ring/70 group-open:hidden dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] [&::-webkit-details-marker]:hidden">
						{more}
					</summary>
					<div className="grid gap-4">{rest}</div>
				</details>
			)}
		</div>
	);
}
