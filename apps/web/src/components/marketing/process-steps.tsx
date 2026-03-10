"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/marketing/animated-beam";

interface Step {
	number: string;
	title: string;
	description: string;
}

export default function ProcessSteps({ steps }: { steps: Step[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const beamStartRef = useRef<HTMLDivElement>(null);
	const beamEndRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative mt-12" ref={containerRef}>
			<div className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-5">
				{steps.map((step) => (
					<div
						key={step.number}
						className="border-border/40 not-last:border-b p-6 md:not-last:border-r md:not-last:border-b-0 md:p-8"
					>
						<span className="font-medium text-brand/60 text-xs">
							{step.number}
						</span>
						<h3 className="mt-2 font-medium text-base">{step.title}</h3>
						<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
							{step.description}
						</p>
					</div>
				))}
			</div>
			{/* Animated beam along the bottom border */}
			<div className="pointer-events-none hidden md:block">
				<div
					ref={beamStartRef}
					className="absolute bottom-0 left-0 h-px w-px"
				/>
				<div ref={beamEndRef} className="absolute right-0 bottom-0 h-px w-px" />
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={beamStartRef}
					toRef={beamEndRef}
					curvature={0}
					duration={6}
					pathWidth={1.5}
					pathOpacity={0.1}
					gradientStartColor="oklch(0.75 0.18 55)"
					gradientStopColor="oklch(0.75 0.18 55 / 0.3)"
				/>
			</div>
		</div>
	);
}
