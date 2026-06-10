"use client";

import dynamic from "next/dynamic";

import type { ComponentProps } from "react";

const MiniChart = dynamic(() => import("@/components/marketing/mini-chart"), {
	ssr: false,
	loading: () => (
		<div className="surface-card mt-5 overflow-hidden">
			{/* Reserve same space as MiniChart: header ~64px + chart 224px + footer ~44px */}
			<div className="h-[332px]" />
		</div>
	),
});

type MiniChartProps = ComponentProps<typeof MiniChart>;

export default function MiniChartLazy(props: MiniChartProps) {
	return <MiniChart {...props} />;
}
