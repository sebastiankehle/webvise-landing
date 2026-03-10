import { Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

function SubmitButton({
	children,
	isSubmitting,
	className,
	...props
}: Omit<React.ComponentProps<typeof Button>, "type"> & {
	isSubmitting?: boolean;
}) {
	return (
		<Button
			type="submit"
			disabled={isSubmitting || props.disabled}
			className={cn(className)}
			{...props}
		>
			{isSubmitting && <Loader2 className="animate-spin" />}
			{children}
		</Button>
	);
}

export { SubmitButton };
