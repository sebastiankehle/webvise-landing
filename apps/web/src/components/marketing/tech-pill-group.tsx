"use client";

import { useEffect, useRef, useState } from "react";

import { MarketingTag } from "@/components/marketing/marketing-tag";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export function TechPillGroup({ items }: { items: string[] }) {
	const [active, setActive] = useState(-1);
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { threshold: 0.3 });

	useEffect(() => {
		if (
			!inView ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}
		let interval: ReturnType<typeof setInterval> | undefined;
		const start = setTimeout(() => {
			setActive(Math.floor(Math.random() * items.length));
			interval = setInterval(() => {
				setActive((prev) => {
					const next = Math.floor(Math.random() * items.length);
					return next === prev ? (next + 1) % items.length : next;
				});
			}, 2600);
		}, Math.random() * 2600);

		return () => {
			clearTimeout(start);
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [items.length, inView]);

	return (
		<div className="flex flex-wrap gap-2" ref={ref}>
			{items.map((tech, index) => (
				<MarketingTag
					className={cn(
						"border-foreground/15 bg-transparent text-foreground transition-colors duration-700",
						index === active && "bg-brand text-brand-foreground"
					)}
					key={tech}
					variant="subtle"
				>
					{tech}
				</MarketingTag>
			))}
		</div>
	);
}
