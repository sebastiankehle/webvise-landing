import { ArrowRight } from "lucide-react";
import type * as React from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type MarketingArrowLinkProps = React.ComponentProps<typeof Link>;

export function MarketingArrowLink({
	children,
	className,
	...props
}: MarketingArrowLinkProps) {
	return (
		<Link
			className={cn(
				"group inline-flex items-center gap-1.5 text-brand-readable text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50",
				className
			)}
			{...props}
		>
			{children}
			<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
