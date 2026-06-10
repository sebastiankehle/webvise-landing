import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const marketingTagVariants = cva(
	"inline-flex items-center text-xs leading-none transition-colors",
	{
		variants: {
			variant: {
				neutral: "rounded-md bg-foreground/65 px-2.5 py-1 text-background",
				subtle: "rounded-md bg-foreground/65 px-2.5 py-1 text-background",
				interactive:
					"rounded-md bg-foreground/65 px-3 py-1.5 text-background hover:bg-foreground/75",
				brand: "rounded-md bg-brand px-2 py-0.5 text-brand-foreground",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	}
);

function MarketingTag({
	className,
	variant,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof marketingTagVariants>) {
	return (
		<span
			className={cn(marketingTagVariants({ variant, className }))}
			data-slot="marketing-tag"
			{...props}
		/>
	);
}

export { MarketingTag, marketingTagVariants };
