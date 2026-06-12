import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const pageSpeedComparisons = [
	{
		afterProgress: 96,
		afterValue: "96",
		beforeProgress: 34,
		beforeValue: "34",
		label: "PageSpeed score",
		unit: "",
	},
	{
		afterProgress: 88,
		afterValue: "1.11",
		beforeProgress: 38,
		beforeValue: "3.8",
		label: "First Contentful Paint",
		unit: "s",
	},
	{
		afterProgress: 86,
		afterValue: "1.14",
		beforeProgress: 32,
		beforeValue: "4.2",
		label: "Largest Contentful Paint",
		unit: "s",
	},
];

function PageSpeedMetricCard({
	color,
	label,
	progress,
	unit,
	value,
}: {
	color: "brand" | "lime";
	label: string;
	progress: number;
	unit: string;
	value: string;
}) {
	const valueClassName =
		color === "lime" ? "text-[#a8d95f]" : "text-brand-readable";
	const barClassName = color === "lime" ? "bg-[#a8d95f]" : "bg-brand";

	return (
		<div
			className="relative min-h-fit w-full overflow-hidden rounded-2xl bg-card p-3 text-card-foreground"
			data-pagespeed-metric={label}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className="font-medium text-muted-foreground text-xs md:text-sm">
						{label}
					</p>
				</div>
				<div className="flex shrink-0 items-end gap-1">
					<span
						className={cn("font-medium text-xl leading-none", valueClassName)}
					>
						{value}
					</span>
					{unit ? (
						<span className="pb-0.5 text-muted-foreground text-xs">{unit}</span>
					) : null}
				</div>
			</div>
			<div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
				<div
					className={cn("h-full rounded-full", barClassName)}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

function ComparisonColumn({ tone }: { tone: "before" | "after" }) {
	return (
		<div className="grid gap-3">
			{pageSpeedComparisons.map((metric) => (
				<PageSpeedMetricCard
					color={tone === "after" ? "lime" : "brand"}
					key={`${tone}-${metric.label}`}
					label={metric.label}
					progress={
						tone === "after" ? metric.afterProgress : metric.beforeProgress
					}
					unit={metric.unit}
					value={tone === "after" ? metric.afterValue : metric.beforeValue}
				/>
			))}
		</div>
	);
}

function ComparisonArrow() {
	return (
		<div className="flex items-center justify-center text-brand-readable">
			<ArrowRight
				aria-hidden="true"
				className="size-6 rotate-90 lg:rotate-0"
				strokeWidth={1.75}
			/>
		</div>
	);
}

function PageSpeedComparison() {
	return (
		<div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
			<ComparisonColumn tone="before" />
			<ComparisonArrow />
			<ComparisonColumn tone="after" />
		</div>
	);
}

export function WpHealthPageSpeedPreview({
	className,
	hint,
}: {
	className?: string;
	hint?: string;
}) {
	return (
		<div className={cn("w-full", className)}>
			<PageSpeedComparison />
			{hint ? (
				<p className="mx-auto mt-4 max-w-[440px] text-center text-muted-foreground text-sm leading-6">
					{hint}
				</p>
			) : null}
		</div>
	);
}
