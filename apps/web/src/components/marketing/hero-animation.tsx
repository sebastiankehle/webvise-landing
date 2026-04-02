"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const ease = [0.25, 0.4, 0, 1];

export default function HeroAnimation({
  headline,
  subtitle,
  actions,
  visual,
}: {
  headline: ReactNode;
  subtitle: ReactNode;
  actions: ReactNode;
  visual: ReactNode;
}) {
  return (
    <div className="grid items-center gap-16 md:grid-cols-2">
      <div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease }}
        >
          {headline}
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          {subtitle}
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          {actions}
        </motion.div>
      </div>
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.2 }}
      >
        <div className="relative w-full max-w-sm">{visual}</div>
      </motion.div>
    </div>
  );
}
