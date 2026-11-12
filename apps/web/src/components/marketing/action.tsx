import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { TrackClick } from "@/components/marketing/track-click";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** The one button shape of the marketing site: flat fill, 6px radius. */
export const actionVariants = cva(
	"group/action inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: "bg-brand text-brand-foreground hover:bg-brand-hover",
				ink: "bg-primary text-primary-foreground hover:bg-primary/85",
				quiet: "bg-foreground/[0.06] text-foreground hover:bg-foreground/10",
			},
			size: {
				md: "h-10 px-4 text-sm",
				lg: "h-12 px-6 text-base",
			},
		},
		defaultVariants: { variant: "primary", size: "lg" },
	}
);

export function ActionArrow() {
	return (
		<ArrowRight
			aria-hidden="true"
			className="size-4 transition-transform duration-150 ease-out group-hover/action:translate-x-0.5 group-hover/arrow:translate-x-0.5"
		/>
	);
}

type LinkProps = ComponentProps<typeof Link>;

interface ActionLinkProps extends VariantProps<typeof actionVariants> {
	arrow?: boolean;
	children: ReactNode;
	className?: string;
	href: LinkProps["href"];
	/** Analytics: where on the page this action sits. */
	location: string;
	onClick?: () => void;
}

export function ActionLink({
	arrow = false,
	children,
	className,
	href,
	location,
	onClick,
	size,
	variant,
}: ActionLinkProps) {
	return (
		<TrackClick
			event="cta_clicked"
			properties={{
				location,
				variant: variant ?? "primary",
				destination: typeof href === "string" ? href : href.pathname,
			}}
		>
			<Link
				className={cn(actionVariants({ variant, size }), className)}
				href={href}
				onClick={onClick}
			>
				{children}
				{arrow && <ActionArrow />}
			</Link>
		</TrackClick>
	);
}

/** Inline text link with an arrow, for secondary routes. */
export function ArrowLink({
	children,
	className,
	...props
}: LinkProps & { children: ReactNode }) {
	return (
		<Link
			className={cn(
				"group/arrow inline-flex items-center gap-1.5 font-medium text-base text-foreground underline decoration-foreground/25 underline-offset-[6px] outline-none transition-colors hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring/70",
				className
			)}
			{...props}
		>
			{children}
			<ActionArrow />
		</Link>
	);
}
