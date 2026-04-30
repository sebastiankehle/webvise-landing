import type * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Caption } from "./typography";

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("space-y-2", className)}
			data-slot="form-item"
			{...props}
		/>
	);
}

function FormLabel(props: React.ComponentProps<typeof Label>) {
	return <Label data-slot="form-label" {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<Caption className={className} data-slot="form-description" {...props} />
	);
}

function FormMessage({
	className,
	errors,
	...props
}: Omit<React.ComponentProps<"div">, "children"> & {
	errors?: ReadonlyArray<{ message?: string } | string | undefined>;
}) {
	if (!errors?.length) {
		return null;
	}

	return (
		<div className={cn(className)} data-slot="form-message" {...props}>
			{errors.map((error) => {
				const message = typeof error === "string" ? error : error?.message;
				if (!message) {
					return null;
				}
				return (
					<Caption className="text-destructive" key={message}>
						{message}
					</Caption>
				);
			})}
		</div>
	);
}

export { FormDescription, FormItem, FormLabel, FormMessage };
