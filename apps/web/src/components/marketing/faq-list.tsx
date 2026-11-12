import { cn } from "@/lib/utils";

export interface FaqItem {
	answer: string;
	question: string;
}

/** Questions with their answers in plain sight. Nothing folds away. */
export function FaqList({
	className,
	items,
}: {
	className?: string;
	items: FaqItem[];
}) {
	return (
		<dl className={cn("grid gap-10", className)}>
			{items.map((item) => (
				<div key={item.question}>
					<dt className="font-display text-foreground text-lg leading-snug">
						{item.question}
					</dt>
					<dd className="mt-2.5 max-w-[62ch] text-base text-foreground/75 leading-[1.6]">
						{item.answer}
					</dd>
				</div>
			))}
		</dl>
	);
}
