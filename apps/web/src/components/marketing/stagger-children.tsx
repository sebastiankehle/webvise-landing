"use client";

import { motion } from "motion/react";
import { Children, type ReactNode } from "react";

interface StaggerChildrenProps {
	children: ReactNode;
	className?: string;
	stagger?: number;
}

export default function StaggerChildren({
	children,
	className,
	stagger = 0.08,
}: StaggerChildrenProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-64px" }}
			variants={{
				visible: {
					transition: { staggerChildren: stagger },
				},
			}}
			className={className}
		>
			{Children.map(children, (child) => (
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 24 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
						},
					}}
				>
					{child}
				</motion.div>
			))}
		</motion.div>
	);
}
