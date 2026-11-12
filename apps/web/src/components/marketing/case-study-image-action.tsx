import { ExpandIcon } from "lucide-react";

export function CaseStudyImageAction() {
	return (
		<span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-sm bg-background text-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
			<ExpandIcon aria-hidden="true" className="size-4" strokeWidth={1.7} />
		</span>
	);
}
