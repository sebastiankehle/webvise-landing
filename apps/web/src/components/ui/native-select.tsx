import type * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<select
			className={cn(
				"h-8 w-full min-w-0 rounded-lg border border-input bg-card px-2.5 py-1 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand-border disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-card/35 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-muted/60",
				className
			)}
			data-slot="native-select"
			{...props}
		/>
	);
}

export { NativeSelect };
