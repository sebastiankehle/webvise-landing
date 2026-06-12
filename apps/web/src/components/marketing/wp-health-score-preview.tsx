import StaggerChildren from "@/components/marketing/stagger-children";
import { Body, Caption } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface PreviewMetricLabels {
	cumulativeLayoutShift: string;
	firstContentfulPaint: string;
	interactionToNextPaint: string;
	largestContentfulPaint: string;
}

function MetricCard({
	label,
	progress,
	value,
	tone,
}: {
	label: string;
	progress: number;
	value: string;
	tone: "muted" | "success" | "warning";
}) {
	let toneClassName = "text-muted-foreground";
	if (tone === "success") {
		toneClassName = "text-success";
	}
	if (tone === "warning") {
		toneClassName = "text-brand-readable";
	}

	return (
		<div className="surface-card p-4 md:p-5">
			<div className="flex items-start justify-between gap-4">
				<Caption className="max-w-[11rem] text-sm leading-snug">
					{label}
				</Caption>
				<Body
					className={cn("font-medium text-2xl leading-none", toneClassName)}
				>
					{value}
				</Body>
			</div>
			<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-border/60">
				<div
					className={cn(
						"h-full rounded-full",
						tone === "success" ? "bg-success" : "bg-brand"
					)}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

export function WpHealthScorePreview({
	afterLabel,
	className,
	currentLabel,
	metricLabels,
}: {
	afterLabel: string;
	className?: string;
	currentLabel: string;
	metricLabels: PreviewMetricLabels;
}) {
	const metrics = [
		{
			label: currentLabel,
			progress: 34,
			tone: "muted" as const,
			value: "34",
		},
		{
			label: afterLabel,
			progress: 96,
			tone: "success" as const,
			value: "96",
		},
		{
			label: metricLabels.firstContentfulPaint,
			progress: 92,
			tone: "success" as const,
			value: "1.11s",
		},
		{
			label: metricLabels.largestContentfulPaint,
			progress: 90,
			tone: "success" as const,
			value: "1.14s",
		},
		{
			label: metricLabels.interactionToNextPaint,
			progress: 88,
			tone: "success" as const,
			value: "88ms",
		},
		{
			label: metricLabels.cumulativeLayoutShift,
			progress: 100,
			tone: "success" as const,
			value: "0",
		},
	];

	return (
		<StaggerChildren
			className={cn("relative grid gap-3 md:grid-cols-2", className)}
		>
			{metrics.map((metric) => (
				<MetricCard
					key={metric.label}
					label={metric.label}
					progress={metric.progress}
					tone={metric.tone}
					value={metric.value}
				/>
			))}
		</StaggerChildren>
	);
}
