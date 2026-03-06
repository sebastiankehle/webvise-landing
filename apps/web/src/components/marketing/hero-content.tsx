"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function HeroContent({ children }: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
		>
			{children}
		</motion.div>
	);
}
