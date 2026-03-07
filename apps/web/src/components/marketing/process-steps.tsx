"use client";

import { motion } from "motion/react";

interface Step {
	number: string;
	title: string;
	description: string;
}

export default function ProcessSteps({ steps }: { steps: Step[] }) {
	return (
		<div className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-5">
			{steps.map((step, i) => (
				<motion.div
					key={step.number}
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-64px" }}
					transition={{
						duration: 0.5,
						delay: i * 0.1,
						ease: [0.25, 0.1, 0.25, 1],
					}}
					className="border-border/40 p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-b-0"
				>
					<span className="font-medium text-brand/60 text-xs">
						{step.number}
					</span>
					<h3 className="mt-2 font-medium text-base">{step.title}</h3>
					<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
						{step.description}
					</p>
				</motion.div>
			))}
		</div>
	);
}
