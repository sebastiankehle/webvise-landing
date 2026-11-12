"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/** Holds a live scene back until its frame comes near the screen, so the
 * page does not fetch and run every scene on arrival. Fills its frame; the
 * frame's still picture shows through until the scene mounts. */
export default function WhenNear({
	children,
	margin = "500px",
}: {
	children: ReactNode;
	margin?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [near, setNear] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setNear(true);
					observer.disconnect();
				}
			},
			{ rootMargin: margin }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [margin]);

	return (
		<div className="absolute inset-0" ref={ref}>
			{near ? children : null}
		</div>
	);
}
