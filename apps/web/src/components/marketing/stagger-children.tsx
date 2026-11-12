"use client";

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
	const [isInView, setIsInView] = useState(false);
	const [fallbackVisible, setFallbackVisible] = useState(false);

	useEffect(() => {
		const timeout = window.setTimeout(() => setFallbackVisible(true), 1200);
		const node = ref.current;
		// Once, when the block is 60px inside the viewport.
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "-60px" }
		);
		if (node) {
			observer.observe(node);
		}
		return () => {
			window.clearTimeout(timeout);
			observer.disconnect();
		};
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
