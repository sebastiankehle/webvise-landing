import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import CardHoverIcon, {
	type AnimatedIcon,
} from "@/components/marketing/card-hover-icon";
import { H3, Muted } from "@/components/ui/typography";

export const relatedLinkCardClassName =
	"surface-card group flex items-start gap-5 p-6 outline-none focus-visible:ring-1 focus-visible:ring-ring/50";

export function RelatedLinkCardContent({
	description,
	icon,
	title,
}: {
	description: ReactNode;
	icon: AnimatedIcon;
	title: ReactNode;
}) {
	return (
		<>
			<CardHoverIcon className="mt-0.5 shrink-0 text-brand-icon" icon={icon} />
			<div className="min-w-0 flex-1">
				<H3>{title}</H3>
				<Muted className="mt-1 line-clamp-2 leading-relaxed">
					{description}
				</Muted>
			</div>
			<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-readable opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
		</>
	);
}
