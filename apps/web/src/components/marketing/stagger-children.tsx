"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
	/** The list's accessible name, when it renders as a list. */
	"aria-label"?: string;
	/** The element to render: a div, or a list when the items are a list. */
	as?: "div" | "ol" | "ul";
	children: ReactNode;
	className?: string;
	/** Set data-playing on the wrapper while it is on screen. */
	trackVisibility?: boolean;
}

export default function StaggerChildren({
	"aria-label": ariaLabel,
	as: Tag = "div",
	children,
	className,
	trackVisibility,
}: StaggerChildrenProps) {
	const ref = useRef<HTMLElement>(null);
	const [isInView, setIsInView] = useState(false);
	const [fallbackVisible, setFallbackVisible] = useState(false);
	const onScreen = useInView(ref);

	useEffect(() => {
		// Browsers without IntersectionObserver reveal after a short wait.
		if (typeof IntersectionObserver === "undefined") {
			const timeout = window.setTimeout(() => setFallbackVisible(true), 1200);
			return () => window.clearTimeout(timeout);
		}
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
		return () => observer.disconnect();
	}, []);

	const shouldShow = isInView || fallbackVisible;

	return (
		<Tag
			aria-label={ariaLabel}
			className={cn(
				className,
				shouldShow ? "stagger-visible" : "stagger-hidden"
			)}
			data-playing={trackVisibility && onScreen ? "true" : undefined}
			// One ref serves all three element types
			ref={ref as RefObject<HTMLDivElement & HTMLOListElement>}
		>
			{children}
		</Tag>
	);
}
