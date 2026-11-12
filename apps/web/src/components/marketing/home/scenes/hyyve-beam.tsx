"use client";

import { type ReactNode, type Ref, useRef } from "react";

import { AnimatedBeam } from "@/components/marketing/animated-beam";
import { cn } from "@/lib/utils";

import { HyyveMark, MARKS, SlackColorMark } from "./project-hyyve";

// Hyyve's own beam visual, ported from its landing page (magic-visuals.tsx):
// each connected tool sends a beam into the hive.

function BeamNode({
	children,
	className,
	ref,
}: {
	children: ReactNode;
	className?: string;
	ref?: Ref<HTMLDivElement>;
}) {
	return (
		<div
			className={cn(
				"z-10 flex size-11 items-center justify-center rounded-full bg-[#0f1012] shadow-[0_0_22px_-10px_rgba(0,0,0,0.9)]",
				className
			)}
			ref={ref}
		>
			{children}
		</div>
	);
}

const TOOLS = MARKS.slice(0, 4);

export default function HyyveBeam() {
	const containerRef = useRef<HTMLDivElement>(null);
	const hubRef = useRef<HTMLDivElement>(null);
	const r0 = useRef<HTMLDivElement>(null);
	const r1 = useRef<HTMLDivElement>(null);
	const r2 = useRef<HTMLDivElement>(null);
	const r3 = useRef<HTMLDivElement>(null);
	const r4 = useRef<HTMLDivElement>(null);
	const refs = [r0, r1, r2, r3, r4];

	return (
		<div
			className="absolute inset-0 flex items-center justify-between bg-[#050506] px-10 py-8 text-[#f2f3f5] sm:px-16"
			ref={containerRef}
		>
			<div className="flex flex-col justify-center gap-5">
				<BeamNode ref={r0}>
					<SlackColorMark className="size-5" />
				</BeamNode>
				{TOOLS.map((mark, i) => (
					<BeamNode key={mark.label} ref={refs[i + 1]}>
						<svg
							aria-hidden="true"
							className="size-5"
							fill={mark.color}
							viewBox="0 0 24 24"
						>
							<path d={mark.path} />
						</svg>
					</BeamNode>
				))}
			</div>
			<BeamNode className="size-16" ref={hubRef}>
				<HyyveMark className="size-9" />
			</BeamNode>
			{refs.map((ref, i) => (
				<AnimatedBeam
					containerRef={containerRef}
					delay={i * 0.5}
					duration={3.5}
					fromRef={ref}
					gradientStartColor="#42d6c3"
					gradientStopColor="#42d6c3"
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed beam list
					key={i}
					pathColor="#3a3d42"
					pathOpacity={0.5}
					pathWidth={1.5}
					toRef={hubRef}
				/>
			))}
		</div>
	);
}
