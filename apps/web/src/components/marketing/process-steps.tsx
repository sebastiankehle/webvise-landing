"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/marketing/animated-beam";
import StaggerChildren from "@/components/marketing/stagger-children";

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
		<div className="relative mt-14" ref={containerRef}>
			<StaggerChildren className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-5">
				{steps.map((step) => (
					<div
						key={step.number}
						className="group border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-last:border-r md:not-last:border-b-0 md:p-10"
					>
						<span className="font-display text-2xl text-brand/40">
							{step.number}
						</span>
						<h3 className="mt-3 font-display text-lg">{step.title}</h3>
						<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
							{step.description}
						</p>
					</div>
				))}
			</StaggerChildren>
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
