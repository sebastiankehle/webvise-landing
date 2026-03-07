"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface StaggerChildrenProps {
	children: ReactNode;
	className?: string;
}

export default function StaggerChildren({
	children,
	className,
}: StaggerChildrenProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
