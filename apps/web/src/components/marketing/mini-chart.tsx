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
import { Body, Caption } from "@/components/ui/typography";

interface ChartTranslations {
	after: string;
	afterWebvise: string;
	before: string;
	conversionDescription: string;
	conversionLabel: string;
	engagementDescription: string;
	engagementLabel: string;
	speedDescription: string;
	speedLabel: string;
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
	if (!(active && payload?.length)) {
		return null;
	}

	const valid = payload.filter((e) => e.value !== null);
	if (!valid.length) {
		return null;
	}

	const phase = valid.some((e) => e.dataKey === "after")
		? afterWebviseLabel
		: beforeLabel;

	return (
		<div className="border border-border bg-card px-4 py-3 shadow-sm">
			<Caption className="mb-1.5 block text-foreground">
				{phase}
				{label && label.trim() !== "" && (
					<span className="ml-2 text-muted-foreground">{label}</span>
				)}
			</Caption>
			{valid.map((entry) => (
				<div
					className="flex items-center justify-between gap-8"
					key={entry.dataKey}
				>
					<div className="flex items-center gap-2">
						<div
							className="size-1.5 rounded-full"
							style={{ backgroundColor: entry.color }}
						/>
						<Caption>
							{entry.dataKey === "before" ? beforeLabel : afterLabel}
						</Caption>
					</div>
					<Caption className="text-foreground tabular-nums">
						{entry.value}
						{unit}
					</Caption>
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
		<div className="surface-card mt-5 overflow-hidden">
			<div className="flex flex-col gap-3 border-border/60 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<Body className="text-foreground text-sm">{current.label}</Body>
						<Body className="text-brand-readable text-sm tabular-nums">
							{current.lift}
						</Body>
					</div>
					<Caption className="mt-0.5 block">{current.description}</Caption>
				</div>
				<div className="flex gap-1">
					{metricOrder.map((key) => (
						<button
							aria-pressed={active === key}
							className={`px-2.5 py-1 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 ${
								active === key
									? "bg-foreground/10 text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
							key={key}
							onClick={() => setActive(key)}
							type="button"
						>
							{datasets[key].label}
						</button>
					))}
				</div>
			</div>
			<div className="px-2 pt-4 pb-2 sm:px-4">
				<ResponsiveContainer height={200} width="100%">
					<AreaChart
						data={current.data}
						margin={{ top: 20, right: 8, bottom: 0, left: 0 }}
					>
						<defs>
							<linearGradient id="afterFill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="var(--brand)" stopOpacity={0.25} />
								<stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="beforeFill" x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--foreground)"
									stopOpacity={0.06}
								/>
								<stop
									offset="100%"
									stopColor="var(--foreground)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<XAxis
							axisLine={false}
							dataKey="week"
							dy={8}
							interval={2}
							tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
							tickFormatter={(v) => (v.trim() === "" ? "" : v)}
							tickLine={false}
						/>
						<YAxis
							axisLine={false}
							domain={[0, "auto"]}
							tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
							tickLine={false}
							width={40}
						/>
						<Tooltip
							content={
								<CustomTooltip
									afterLabel={translations.after}
									afterWebviseLabel={translations.afterWebvise}
									beforeLabel={translations.before}
									unit={current.unit}
								/>
							}
							cursor={{
								stroke: "var(--brand)",
								strokeWidth: 1,
							}}
						/>
						<ReferenceLine
							label={{
								value: "▾ webvise",
								position: "top",
								fill: "var(--brand)",
								fontSize: 10,
								fontWeight: 500,
								offset: 8,
							}}
							stroke="var(--brand)"
							strokeDasharray="3 3"
							x="      "
						/>
						<Area
							activeDot={{
								r: 3,
								stroke: "var(--border)",
								strokeWidth: 1.5,
								fill: "var(--card)",
							}}
							connectNulls={false}
							dataKey="before"
							dot={false}
							fill="url(#beforeFill)"
							stroke="var(--muted-foreground)"
							strokeDasharray="4 3"
							strokeWidth={1.5}
							type="monotone"
						/>
						<Area
							activeDot={{
								r: 4,
								stroke: "var(--brand)",
								strokeWidth: 2,
								fill: "var(--card)",
							}}
							connectNulls={false}
							dataKey="after"
							dot={false}
							fill="url(#afterFill)"
							stroke="var(--brand)"
							strokeWidth={2}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
