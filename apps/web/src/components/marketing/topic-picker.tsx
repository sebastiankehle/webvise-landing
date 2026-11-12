"use client";

import { ActionArrow, actionVariants } from "@/components/marketing/action";
import { BOOKING_TOPICS, type BookingTopic } from "@/data/booking";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const chipClassName =
	"flex h-11 cursor-pointer items-center rounded-sm border border-foreground/15 px-4 text-base text-foreground outline-none transition-[background-color,color,scale] duration-150 ease-out hover:bg-foreground/[0.06] active:scale-[0.98] peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-checked:hover:bg-foreground/85 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background";

/** The first question of the booking flow, asked where the visitor already
 * is. A plain GET form, so it works before any script has loaded. */
export function TopicPicker({
	action,
	className,
	cta,
	label,
	location,
	topics,
}: {
	/** Localised path of the booking page. */
	action: string;
	className?: string;
	cta: string;
	label: string;
	location: string;
	topics: Record<BookingTopic, string>;
}) {
	return (
		<form
			action={action}
			className={className}
			method="get"
			onSubmit={(event) => {
				const topic = new FormData(event.currentTarget).get("topic");
				track("cta_clicked", {
					location,
					variant: "topic_picker",
					destination: "/book",
					topic: typeof topic === "string" ? topic : null,
				});
			}}
		>
			<fieldset>
				<legend className="font-medium text-base text-foreground">
					{label}
				</legend>
				<div className="mt-3 flex flex-wrap gap-2">
					{BOOKING_TOPICS.map((topic, index) => (
						<label key={topic}>
							<input
								className="peer sr-only"
								defaultChecked={index === 0}
								name="topic"
								type="radio"
								value={topic}
							/>
							<span className={chipClassName}>{topics[topic]}</span>
						</label>
					))}
				</div>
			</fieldset>
			<button className={cn(actionVariants(), "mt-8")} type="submit">
				{cta}
				<ActionArrow />
			</button>
		</form>
	);
}
