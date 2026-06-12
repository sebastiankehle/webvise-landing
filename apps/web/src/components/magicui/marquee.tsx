import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
	pauseOnHover?: boolean;
	repeat?: number;
	reverse?: boolean;
	vertical?: boolean;
}

export function Marquee({
	children,
	className,
	reverse = false,
	pauseOnHover = false,
	vertical = false,
	repeat = 4,
	...props
}: MarqueeProps) {
	const repeatedItems = Array.from({ length: repeat }, (_, index) => ({
		hidden: index > 0,
		id: `repeat-${index}`,
	}));

	return (
		<div
			className={cn(
				"group flex overflow-hidden [--duration:40s] [--gap:1.25rem] [gap:var(--gap)]",
				vertical ? "flex-col" : "flex-row",
				className
			)}
			{...props}
		>
			{repeatedItems.map(({ hidden, id }) => (
				<div
					aria-hidden={hidden}
					className={cn(
						"flex shrink-0 justify-around [gap:var(--gap)]",
						vertical
							? "flex-col [animation:marquee-vertical_var(--duration)_linear_infinite]"
							: "flex-row [animation:marquee_var(--duration)_linear_infinite]",
						reverse && "[animation-direction:reverse]",
						pauseOnHover && "group-hover:[animation-play-state:paused]",
						"motion-reduce:[animation:none]"
					)}
					key={id}
				>
					{children}
				</div>
			))}
		</div>
	);
}
