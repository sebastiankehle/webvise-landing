"use client";

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

interface ChartTranslations {
	conversionLabel: string;
	conversionDescription: string;
	engagementLabel: string;
	engagementDescription: string;
	speedLabel: string;
	speedDescription: string;
	before: string;
	afterWebvise: string;
	after: string;
}

type Metric = "conversion" | "engagement" | "speed";

function buildDatasets(t: ChartTranslations) {
	return {
		conversion: {
			label: t.conversionLabel,
			lift: "+210%",
			description: t.conversionDescription,
			unit: "%",
			data: [
				{ week: "", before: 1.2, after: null },
				{ week: " ", before: 1.1, after: null },
				{ week: "  ", before: 1.4, after: null },
				{ week: "   ", before: 1.0, after: null },
				{ week: "    ", before: 1.3, after: null },
				{ week: "     ", before: 1.2, after: null },
				{ week: "      ", before: 1.1, after: 1.1 },
				{ week: "W1", before: null, after: 1.9 },
				{ week: "W2", before: null, after: 2.1 },
				{ week: "W3", before: null, after: 2.0 },
				{ week: "W4", before: null, after: 2.3 },
				{ week: "W5", before: null, after: 2.5 },
				{ week: "W6", before: null, after: 2.4 },
				{ week: "W7", before: null, after: 2.7 },
				{ week: "W8", before: null, after: 2.9 },
				{ week: "W9", before: null, after: 2.8 },
				{ week: "W10", before: null, after: 3.1 },
				{ week: "W11", before: null, after: 3.4 },
				{ week: "W12", before: null, after: 3.5 },
				{ week: "W13", before: null, after: 3.7 },
			],
		},
		engagement: {
			label: t.engagementLabel,
			lift: "+125%",
			description: t.engagementDescription,
			unit: "",
			data: [
				{ week: "", before: 44, after: null },
				{ week: " ", before: 41, after: null },
				{ week: "  ", before: 46, after: null },
				{ week: "   ", before: 42, after: null },
				{ week: "    ", before: 45, after: null },
				{ week: "     ", before: 43, after: null },
				{ week: "      ", before: 44, after: 44 },
				{ week: "W1", before: null, after: 58 },
				{ week: "W2", before: null, after: 61 },
				{ week: "W3", before: null, after: 59 },
				{ week: "W4", before: null, after: 64 },
				{ week: "W5", before: null, after: 67 },
				{ week: "W6", before: null, after: 66 },
				{ week: "W7", before: null, after: 72 },
				{ week: "W8", before: null, after: 76 },
				{ week: "W9", before: null, after: 74 },
				{ week: "W10", before: null, after: 82 },
				{ week: "W11", before: null, after: 87 },
				{ week: "W12", before: null, after: 91 },
				{ week: "W13", before: null, after: 95 },
			],
		},
		speed: {
			label: t.speedLabel,
			lift: "57 → 100",
			description: t.speedDescription,
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
}

const metricOrder: Metric[] = ["conversion", "engagement", "speed"];

function CustomTooltip({
	active,
	payload,
	label,
	unit,
	beforeLabel,
	afterLabel,
	afterWebviseLabel,
}: {
	active?: boolean;
	payload?: Array<{ value: number | null; dataKey: string; color: string }>;
	label?: string;
	unit?: string;
	beforeLabel: string;
	afterLabel: string;
	afterWebviseLabel: string;
}) {
	if (!active || !payload?.length) return null;

	const valid = payload.filter((e) => e.value !== null);
	if (!valid.length) return null;

	const phase = valid.some((e) => e.dataKey === "after")
		? afterWebviseLabel
		: beforeLabel;

	return (
		<div className="border border-border bg-[--surface-dark-secondary] px-4 py-3 backdrop-blur-sm">
			<p className="mb-1.5 text-xs text-[--foreground]">
				{phase}
				{label && label.trim() !== "" && (
					<span className="ml-2 text-muted-foreground/60">
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
						<span className="text-muted-foreground text-xs tracking-[-0.011em]">
							{entry.dataKey === "before" ? beforeLabel : afterLabel}
						</span>
					</div>
					<span className="text-xs text-[--foreground] tabular-nums">
						{entry.value}
						{unit}
					</span>
				</div>
			))}
		</div>
	);
}

export default function MiniChart({
	translations,
}: {
	translations: ChartTranslations;
}) {
	const datasets = buildDatasets(translations);
	const [active, setActive] = useState<Metric>("conversion");
	const current = datasets[active];

	return (
		<div className="mt-14 border border-border">
			<div className="flex flex-col gap-3 border-border border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<p className="text-sm text-[--foreground]">
							{current.label}
						</p>
						<span className="font-[510] text-brand text-sm tracking-[-0.011em]">
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
									? "bg-[--foreground]/10 text-[--foreground]"
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
						margin={{ top: 20, right: 8, bottom: 0, left: 0 }}
					>
						<defs>
							<linearGradient id="afterFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="oklch(0.75 0.18 55)"
									stopOpacity={0.25}
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
									stopColor="oklch(1 0 0)"
									stopOpacity={0.06}
								/>
								<stop
									offset="100%"
									stopColor="oklch(1 0 0)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<XAxis
							dataKey="week"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: "oklch(1 0 0 / 0.25)" }}
							dy={8}
							tickFormatter={(v) => (v.trim() === "" ? "" : v)}
							interval={2}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: "oklch(1 0 0 / 0.25)" }}
							width={40}
							domain={[0, "auto"]}
						/>
						<Tooltip
							content={
								<CustomTooltip
									unit={current.unit}
									beforeLabel={translations.before}
									afterLabel={translations.after}
									afterWebviseLabel={translations.afterWebvise}
								/>
							}
							cursor={{
								stroke: "oklch(0.75 0.18 55 / 0.2)",
								strokeWidth: 1,
							}}
						/>
						<ReferenceLine
							x="      "
							stroke="oklch(0.75 0.18 55 / 0.4)"
							strokeDasharray="3 3"
							label={{
								value: "▾ webvise",
								position: "top",
								fill: "oklch(0.75 0.18 55 / 0.7)",
								fontSize: 10,
								fontWeight: 500,
								offset: 8,
							}}
						/>
						<Area
							type="monotone"
							dataKey="before"
							stroke="oklch(1 0 0 / 0.2)"
							strokeWidth={1.5}
							strokeDasharray="4 3"
							fill="url(#beforeFill)"
							dot={false}
							connectNulls={false}
							activeDot={{
								r: 3,
								stroke: "oklch(1 0 0 / 0.3)",
								strokeWidth: 1.5,
								fill: "oklch(0.13 0.01 250)",
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
								fill: "oklch(0.13 0.01 250)",
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
