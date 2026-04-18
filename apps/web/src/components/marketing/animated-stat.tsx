"use client";

import { useEffect, useRef } from "react";
import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

function parseStatValue(value: string) {
	const match = value.match(/^([^\d]*)(\d+)(.*)$/);
	if (!match) return null;
	return { prefix: match[1], number: Number.parseInt(match[2], 10), suffix: match[3] };
}

export default function AnimatedStat({
	value,
	className,
}: { value: string; className?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const parsed = parseStatValue(value);
	const motionVal = useMotionValue(0);
	const rounded = useTransform(motionVal, (v) => Math.round(v));
	const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

	useEffect(() => {
		if (!isInView || !parsed) return;
		const controls = animate(motionVal, parsed.number, {
			duration: 1.6,
			ease: [0.16, 1, 0.3, 1],
		});
		return () => controls.stop();
	}, [isInView, motionVal, parsed]);

	if (!parsed) {
		return (
			<span
				data-slot="stat"
				className={cn(
					"font-display text-3xl text-brand tracking-tight md:text-[48px] md:leading-[1]",
					className,
				)}
			>
				{value}
			</span>
		);
	}

	return (
		<span
			ref={ref}
			data-slot="stat"
			className={cn(
				"font-display text-3xl text-brand tracking-tight md:text-[48px] md:leading-[1]",
				className,
			)}
		>
			{parsed.prefix}
			<motion.span>{rounded}</motion.span>
			{parsed.suffix}
		</span>
	);
}
