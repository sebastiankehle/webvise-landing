import type * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-item"
			className={cn("space-y-2", className)}
			{...props}
		/>
	);
}

function FormLabel(props: React.ComponentProps<typeof Label>) {
	return <Label data-slot="form-label" {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="form-description"
			className={cn("text-muted-foreground text-xs", className)}
			{...props}
		/>
	);
}

function FormMessage({
	className,
	errors,
	...props
}: Omit<React.ComponentProps<"div">, "children"> & {
	errors?: ReadonlyArray<{ message?: string } | string | undefined>;
}) {
	if (!errors?.length) return null;

	return (
		<div data-slot="form-message" className={cn(className)} {...props}>
			{errors.map((error) => {
				const message =
					typeof error === "string" ? error : error?.message;
				if (!message) return null;
				return (
					<p key={message} className="text-destructive text-xs">
						{message}
					</p>
				);
			})}
		</div>
	);
}

export { FormDescription, FormItem, FormLabel, FormMessage };
