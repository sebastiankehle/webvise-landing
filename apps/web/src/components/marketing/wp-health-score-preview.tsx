import { Body, Caption } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function ScoreCircle({
	label,
	score,
	tone,
}: {
	label: string;
	score: number;
	tone: "muted" | "success";
}) {
	return (
		<div className="flex flex-col items-center gap-4 text-center">
			<div
				className={cn(
					"flex h-28 w-28 items-center justify-center rounded-full border-[10px] bg-card",
					tone === "success"
						? "border-success text-success"
						: "border-border text-muted-foreground"
				)}
			>
				<Body className="font-medium text-3xl text-current leading-none">
					{score}
				</Body>
			</div>
			<Caption
				className={cn(
					"text-base",
					tone === "success" ? "text-success" : "text-muted-foreground"
				)}
			>
				{label}
			</Caption>
		</div>
	);
}

export function WpHealthScorePreview({
	afterLabel,
	className,
	currentLabel,
}: {
	afterLabel: string;
	className?: string;
	currentLabel: string;
}) {
	return (
		<div
			className={cn(
				"surface-card media-frame relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-10",
				className
			)}
		>
			<ScoreCircle label={currentLabel} score={34} tone="muted" />
			<ScoreCircle label={afterLabel} score={96} tone="success" />
		</div>
	);
}
