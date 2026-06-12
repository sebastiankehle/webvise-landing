import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<div className="relative w-full min-w-0">
			<select
				className={cn(
					"h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-card bg-none px-2.5 py-1 pr-9 text-xs outline-none transition-colors [-webkit-appearance:none] [appearance:none] [background-image:none] focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand-border disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-card/35 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-muted/60 [&::-ms-expand]:hidden",
					className
				)}
				data-slot="native-select"
				{...props}
			/>
			<ChevronDown
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
				strokeWidth={1.75}
			/>
		</div>
	);
}

export { NativeSelect };
