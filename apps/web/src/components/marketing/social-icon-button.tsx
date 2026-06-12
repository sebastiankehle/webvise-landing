import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SocialIconButton({
	children,
	className,
	href,
	label,
	onClick,
}: {
	children: ReactNode;
	className?: string;
	href: string;
	label: string;
	onClick?: () => void;
}) {
	return (
		<Button
			aria-label={label}
			className={cn(
				"border-0 text-muted-foreground hover:border-0 hover:bg-transparent",
				className
			)}
			onClick={onClick}
			render={
				<a href={href} rel="noopener noreferrer" target="_blank">
					{children}
				</a>
			}
			size="icon"
			variant="ghost"
		/>
	);
}
