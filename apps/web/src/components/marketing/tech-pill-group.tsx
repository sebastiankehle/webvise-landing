"use client";

import { useEffect, useState } from "react";

import { MarketingTag } from "@/components/marketing/marketing-tag";
import { cn } from "@/lib/utils";

export function TechPillGroup({ items }: { items: string[] }) {
	const [active, setActive] = useState(-1);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
	}, [items.length]);

	return (
		<div className="flex flex-wrap gap-2">
			{items.map((tech, index) => (
				<MarketingTag
					className={cn(
						"border-transparent bg-foreground/10 text-foreground transition-colors duration-700",
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
