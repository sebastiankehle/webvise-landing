"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/marketing/animated-beam";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H3, Muted } from "@/components/ui/typography";

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
		<div className="relative mt-10 md:mt-16" ref={containerRef}>
			{/* Connector beam behind the cards at step-number height — the pulse
			    only shows in the gaps between steps. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 hidden lg:block"
			>
				<div className="absolute top-9 left-0 h-px w-px" ref={beamStartRef} />
				<div className="absolute top-9 right-0 h-px w-px" ref={beamEndRef} />
				<AnimatedBeam
					containerRef={containerRef}
					curvature={0}
					duration={6}
					fromRef={beamStartRef}
					gradientStartColor="oklch(0.75 0.18 55)"
					gradientStopColor="oklch(0.75 0.18 55 / 0.3)"
					pathOpacity={0.35}
					pathWidth={1.5}
					toRef={beamEndRef}
				/>
			</div>
			<StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
				{steps.map((step, index) => (
					<div className="surface-card relative p-6" key={step.number}>
						<Caption className="text-brand-readable tabular-nums">
							{String(index + 1).padStart(2, "0")}
						</Caption>
						<H3 className="mt-5 text-base">{step.title}</H3>
						<Muted className="mt-3 leading-relaxed">{step.description}</Muted>
					</div>
				))}
			</StaggerChildren>
		</div>
	);
}
