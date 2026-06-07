"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/marketing/animated-beam";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H3, Mono, Muted } from "@/components/ui/typography";

interface Step {
	description: string;
	number: string;
	title: string;
}

export default function ProcessSteps({ steps }: { steps: Step[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const beamStartRef = useRef<HTMLDivElement>(null);
	const beamEndRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative mt-16" ref={containerRef}>
			<StaggerChildren className="-mx-6 grid border-grid-line border-t md:grid-cols-5">
				{steps.map((step) => (
					<div
						className="group border-grid-line border-b p-6 md:border-r md:[&:nth-child(5n)]:border-r-0"
						key={step.number}
					>
						<Mono className="text-muted-foreground text-sm">{step.number}</Mono>
						<H3 className="mt-2 text-base">{step.title}</H3>
						<Muted className="mt-3 leading-[1.6]">{step.description}</Muted>
					</div>
				))}
			</StaggerChildren>
			{/* Animated beam along the bottom border */}
			<div className="pointer-events-none hidden md:block">
				<div
					className="absolute bottom-0 left-0 h-px w-px"
					ref={beamStartRef}
				/>
				<div className="absolute right-0 bottom-0 h-px w-px" ref={beamEndRef} />
				<AnimatedBeam
					containerRef={containerRef}
					curvature={0}
					duration={6}
					fromRef={beamStartRef}
					gradientStartColor="oklch(0.75 0.18 55)"
					gradientStopColor="oklch(0.75 0.18 55 / 0.3)"
					pathOpacity={0.1}
					pathWidth={1.5}
					toRef={beamEndRef}
				/>
			</div>
		</div>
	);
}
