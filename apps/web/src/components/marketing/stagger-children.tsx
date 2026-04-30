"use client";

import { useInView } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
	children: ReactNode;
	className?: string;
}

export default function StaggerChildren({
	children,
	className,
}: StaggerChildrenProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-60px" });

	return (
		<div
			className={cn(className, isInView ? "stagger-visible" : "stagger-hidden")}
			ref={ref}
		>
			{children}
		</div>
	);
}
