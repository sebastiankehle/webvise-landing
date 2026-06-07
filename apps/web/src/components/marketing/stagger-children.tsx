"use client";

import { useInView } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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
	const [fallbackVisible, setFallbackVisible] = useState(false);

	useEffect(() => {
		const timeout = window.setTimeout(() => setFallbackVisible(true), 1200);
		return () => window.clearTimeout(timeout);
	}, []);

	const shouldShow = isInView || fallbackVisible;

	return (
		<div
			className={cn(
				className,
				shouldShow ? "stagger-visible" : "stagger-hidden"
			)}
			ref={ref}
		>
			{children}
		</div>
	);
}
