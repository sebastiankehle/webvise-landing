import { ExpandIcon } from "lucide-react";

import { Body, Caption } from "@/components/ui/typography";

export function CaseStudyImageAction({
	clickLabel,
	tapLabel,
}: {
	clickLabel: string;
	tapLabel: string;
}) {
	return (
		<>
			<span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-background/10 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
				<Body className="flex items-center gap-2 border border-border/70 bg-background px-3 py-2 text-foreground text-sm shadow-sm">
					<ExpandIcon className="size-4" />
					{clickLabel}
				</Body>
			</span>
			<Caption className="absolute right-2 bottom-2 flex items-center gap-1.5 border border-border/70 bg-background px-2.5 py-1.5 text-foreground shadow-sm sm:hidden">
				<ExpandIcon className="size-3.5" />
				{tapLabel}
			</Caption>
		</>
	);
}
