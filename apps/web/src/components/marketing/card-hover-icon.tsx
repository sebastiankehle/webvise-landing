"use client";

import type { ComponentType, RefAttributes } from "react";
import { useEffect, useRef } from "react";

export interface AnimatedIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

export type AnimatedIcon = ComponentType<
	{ className?: string; size?: number } & RefAttributes<AnimatedIconHandle>
>;

export default function CardHoverIcon({
	className,
	icon: Icon,
	size = 20,
}: {
	className?: string;
	icon: AnimatedIcon;
	size?: number;
}) {
	const iconRef = useRef<AnimatedIconHandle>(null);
	const wrapperRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const card = wrapperRef.current?.closest("a, .surface-card");
		if (!card) {
			return;
		}

		const start = () => iconRef.current?.startAnimation();
		const stop = () => iconRef.current?.stopAnimation();
		card.addEventListener("mouseenter", start);
		card.addEventListener("mouseleave", stop);

		return () => {
			card.removeEventListener("mouseenter", start);
			card.removeEventListener("mouseleave", stop);
		};
	}, []);

	return (
		<span className="contents" ref={wrapperRef}>
			<Icon className={className} ref={iconRef} size={size} />
		</span>
	);
}
