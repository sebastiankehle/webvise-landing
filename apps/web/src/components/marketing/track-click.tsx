"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/track";

interface TrackClickProps {
	event: string;
	properties?: Record<string, string | number | boolean | null>;
	children: ReactNode;
}

export function TrackClick({ event, properties, children }: TrackClickProps) {
	return (
		<span
			onClick={() => track(event, properties)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") track(event, properties);
			}}
			className="contents"
		>
			{children}
		</span>
	);
}
