import { ExpandIcon } from "lucide-react";

export function CaseStudyImageAction() {
	return (
		<span className="absolute right-3 bottom-3 grid size-9 place-items-center border border-border/70 bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100">
			<ExpandIcon aria-hidden="true" className="size-4" strokeWidth={1.7} />
		</span>
	);
}
