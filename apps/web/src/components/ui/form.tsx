import type * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Caption } from "./typography";

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
		<Caption data-slot="form-description" className={className} {...props} />
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
				const message = typeof error === "string" ? error : error?.message;
				if (!message) return null;
				return (
					<Caption key={message} className="text-destructive">
						{message}
					</Caption>
				);
			})}
		</div>
	);
}

export { FormDescription, FormItem, FormLabel, FormMessage };
