"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
	Area,
	AreaChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type Metric = "conversion" | "engagement" | "speed";

const datasets: Record<
	Metric,
	{
		label: string;
		lift: string;
		description: string;
		unit: string;
		data: Array<{ week: string; before: number | null; after: number | null }>;
	}
> = {
	conversion: {
		label: "Conversion Rate",
		lift: "+210%",
		description: "1.2% → 3.7%",
		unit: "%",
		data: [
			{ week: "", before: 1.2, after: null },
			{ week: " ", before: 1.1, after: null },
			{ week: "  ", before: 1.4, after: null },
			{ week: "   ", before: 1.0, after: null },
			{ week: "    ", before: 1.3, after: null },
			{ week: "     ", before: 1.2, after: null },
			{ week: "      ", before: 1.1, after: 1.1 },
			{ week: "W1", before: null, after: 1.4 },
			{ week: "W2", before: null, after: 1.7 },
			{ week: "W3", before: null, after: 1.6 },
			{ week: "W4", before: null, after: 2.0 },
			{ week: "W5", before: null, after: 2.2 },
			{ week: "W6", before: null, after: 2.1 },
			{ week: "W7", before: null, after: 2.5 },
			{ week: "W8", before: null, after: 2.8 },
			{ week: "W9", before: null, after: 2.6 },
			{ week: "W10", before: null, after: 3.1 },
			{ week: "W11", before: null, after: 3.4 },
			{ week: "W12", before: null, after: 3.2 },
			{ week: "W13", before: null, after: 3.7 },
		],
	},
	engagement: {
		label: "User Engagement",
		lift: "+125%",
		description: "42 → 95",
		unit: "",
		data: [
			{ week: "", before: 44, after: null },
			{ week: " ", before: 41, after: null },
			{ week: "  ", before: 46, after: null },
			{ week: "   ", before: 42, after: null },
			{ week: "    ", before: 45, after: null },
			{ week: "     ", before: 43, after: null },
			{ week: "      ", before: 44, after: 44 },
			{ week: "W1", before: null, after: 47 },
			{ week: "W2", before: null, after: 51 },
			{ week: "W3", before: null, after: 54 },
			{ week: "W4", before: null, after: 52 },
			{ week: "W5", before: null, after: 58 },
			{ week: "W6", before: null, after: 63 },
			{ week: "W7", before: null, after: 61 },
			{ week: "W8", before: null, after: 68 },
			{ week: "W9", before: null, after: 72 },
			{ week: "W10", before: null, after: 76 },
			{ week: "W11", before: null, after: 82 },
			{ week: "W12", before: null, after: 88 },
			{ week: "W13", before: null, after: 95 },
		],
	},
	speed: {
		label: "Lighthouse Score",
		lift: "57 → 100",
		description: "Instant optimization",
		unit: "/100",
		data: [
			{ week: "", before: 55, after: null },
			{ week: " ", before: 58, after: null },
			{ week: "  ", before: 54, after: null },
			{ week: "   ", before: 59, after: null },
			{ week: "    ", before: 56, after: null },
			{ week: "     ", before: 57, after: null },
			{ week: "      ", before: 57, after: 57 },
			{ week: "W1", before: null, after: 96 },
			{ week: "W2", before: null, after: 97 },
			{ week: "W3", before: null, after: 96 },
			{ week: "W4", before: null, after: 98 },
			{ week: "W5", before: null, after: 97 },
			{ week: "W6", before: null, after: 99 },
			{ week: "W7", before: null, after: 98 },
			{ week: "W8", before: null, after: 99 },
			{ week: "W9", before: null, after: 99 },
			{ week: "W10", before: null, after: 100 },
			{ week: "W11", before: null, after: 99 },
			{ week: "W12", before: null, after: 100 },
			{ week: "W13", before: null, after: 100 },
		],
	},
};

const metricOrder: Metric[] = ["conversion", "engagement", "speed"];

function CustomTooltip({
	active,
	payload,
	label,
	unit,
}: {
	active?: boolean;
	payload?: Array<{ value: number | null; dataKey: string; color: string }>;
	label?: string;
	unit?: string;
}) {
	if (!active || !payload?.length) return null;

	const valid = payload.filter((e) => e.value !== null);
	if (!valid.length) return null;

	const phase = valid.some((e) => e.dataKey === "after")
		? "After webvise"
		: "Before";

	return (
		<div className="border border-border/40 bg-background/95 px-4 py-3 backdrop-blur-sm">
			<p className="mb-1.5 font-medium text-foreground text-xs">
				{phase}
				{label && label.trim() !== "" && (
					<span className="ml-2 font-normal text-muted-foreground/60">
						{label}
					</span>
				)}
			</p>
			{valid.map((entry) => (
				<div
					key={entry.dataKey}
					className="flex items-center justify-between gap-8"
				>
					<div className="flex items-center gap-2">
						<div
							className="size-1.5 rounded-full"
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-muted-foreground text-xs">
							{entry.dataKey === "before" ? "Before" : "After"}
						</span>
					</div>
					<span className="font-medium text-foreground text-xs tabular-nums">
						{entry.value}
						{unit}
					</span>
				</div>
			))}
		</div>
	);
}

export default function MiniChart() {
	const [active, setActive] = useState<Metric>("conversion");
	const current = datasets[active];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.8, delay: 0.3 }}
			className="mt-12 border border-border/40"
		>
			<div className="flex flex-col gap-3 border-b border-border/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<p className="font-medium text-foreground text-sm">
							{current.label}
						</p>
						<span className="font-medium text-brand text-sm tabular-nums">
							{current.lift}
						</span>
					</div>
					<p className="mt-0.5 text-muted-foreground text-xs">
						{current.description}
					</p>
				</div>
				<div className="flex gap-1">
					{metricOrder.map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => setActive(key)}
							className={`px-2.5 py-1 text-xs transition-colors ${
								active === key
									? "bg-foreground/5 font-medium text-foreground"
									: "text-muted-foreground/50 hover:text-muted-foreground"
							}`}
						>
							{datasets[key].label}
						</button>
					))}
				</div>
			</div>
			<div className="px-2 pt-4 pb-2 sm:px-4">
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart
						data={current.data}
						margin={{ top: 20, right: 8, bottom: 0, left: -12 }}
					>
						<defs>
							<linearGradient id="afterFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="oklch(0.75 0.18 55)"
									stopOpacity={0.2}
								/>
								<stop
									offset="100%"
									stopColor="oklch(0.75 0.18 55)"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id="beforeFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="oklch(0.5 0 0)"
									stopOpacity={0.05}
								/>
								<stop
									offset="100%"
									stopColor="oklch(0.5 0 0)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<XAxis
							dataKey="week"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: "oklch(0.5 0 0 / 0.25)" }}
							dy={8}
							tickFormatter={(v) => (v.trim() === "" ? "" : v)}
							interval={2}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: "oklch(0.5 0 0 / 0.25)" }}
							width={32}
							domain={[0, "auto"]}
						/>
						<Tooltip
							content={<CustomTooltip unit={current.unit} />}
							cursor={{
								stroke: "oklch(0.75 0.18 55 / 0.12)",
								strokeWidth: 1,
							}}
						/>
						<ReferenceLine
							x="      "
							stroke="oklch(0.75 0.18 55 / 0.3)"
							strokeDasharray="3 3"
							label={{
								value: "▾ webvise",
								position: "top",
								fill: "oklch(0.75 0.18 55 / 0.6)",
								fontSize: 10,
								fontWeight: 500,
								offset: 8,
							}}
						/>
						<Area
							type="monotone"
							dataKey="before"
							stroke="oklch(0.5 0 0 / 0.15)"
							strokeWidth={1.5}
							strokeDasharray="4 3"
							fill="url(#beforeFill)"
							dot={false}
							connectNulls={false}
							activeDot={{
								r: 3,
								stroke: "oklch(0.5 0 0 / 0.2)",
								strokeWidth: 1.5,
								fill: "var(--color-background)",
							}}
						/>
						<Area
							type="monotone"
							dataKey="after"
							stroke="oklch(0.75 0.18 55)"
							strokeWidth={2}
							fill="url(#afterFill)"
							dot={false}
							connectNulls={false}
							activeDot={{
								r: 4,
								stroke: "oklch(0.75 0.18 55)",
								strokeWidth: 2,
								fill: "var(--color-background)",
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}
