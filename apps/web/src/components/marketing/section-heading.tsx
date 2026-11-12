import type { ReactNode } from "react";

import { H2, Lead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/** A section title, with an optional description and route beside it. */
export function SectionHeading({
	action,
	className,
	description,
	title,
}: {
	action?: ReactNode;
	className?: string;
	description?: string;
	title: string;
}) {
	if (description) {
		return (
			<div
				className={cn(
					"grid gap-x-10 gap-y-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end",
					className
				)}
			>
				<H2 className="max-w-[660px]">{title}</H2>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{description}</Lead>
					{action && <div className="mt-5">{action}</div>}
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-wrap items-end justify-between gap-x-10 gap-y-4",
				className
			)}
		>
			<H2>{title}</H2>
			{action && <div className="pb-1">{action}</div>}
		</div>
	);
}
