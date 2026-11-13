import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Lighthouse's own gauge: radius 56 in a 120 box, its fail red and pass green.
const RING = 2 * Math.PI * 56;
const TONES = {
	fail: {
		ring: "#ff4e42",
		text: "text-[#c00] dark:text-[#ff4e42]",
	},
	pass: {
		ring: "#0cce6b",
		text: "text-[#018642] dark:text-[#0cce6b]",
	},
} as const;

type Tone = keyof typeof TONES;

/** The same site measured before and after its rebuild. */
const REPORTS: {
	metrics: { name: string; value: string }[];
	score: number;
	stack: string;
	tone: Tone;
}[] = [
	{
		metrics: [
			{ name: "First Contentful Paint", value: "3.8 s" },
			{ name: "Largest Contentful Paint", value: "4.2 s" },
		],
		score: 34,
		stack: "WordPress",
		tone: "fail",
	},
	{
		metrics: [
			{ name: "First Contentful Paint", value: "1.11 s" },
			{ name: "Largest Contentful Paint", value: "1.14 s" },
		],
		score: 96,
		stack: "Next.js",
		tone: "pass",
	},
];

/** Lighthouse marks a failing value with a triangle and a passing one with a
 * circle. */
function Mark({ tone }: { tone: Tone }) {
	return (
		<svg aria-hidden="true" className="size-2.5 flex-none" viewBox="0 0 10 10">
			{tone === "fail" ? (
				<path d="M5 1 9.5 9h-9z" fill={TONES.fail.ring} />
			) : (
				<circle cx="5" cy="5" fill={TONES.pass.ring} r="4.5" />
			)}
		</svg>
	);
}

/** One PageSpeed report: the stack it ran on, the performance gauge and the
 * two paint times. */
function Report({ metrics, score, stack, tone }: (typeof REPORTS)[number]) {
	const { ring, text } = TONES[tone];
	return (
		<div className="flex w-full max-w-[17rem] flex-col rounded-[12px] bg-card p-4 shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_16px_32px_-20px_rgba(14,18,23,0.4)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
			<div className="flex items-center justify-between gap-3 text-sm">
				<span className="text-muted-foreground">PageSpeed Insights</span>
				<span
					className={cn(
						"rounded-full px-2 py-0.5 text-xs",
						tone === "pass"
							? "bg-foreground text-background"
							: "text-muted-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.14)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
					)}
				>
					{stack}
				</span>
			</div>
			<div className="mt-5 flex flex-col items-center gap-2">
				<span className="relative grid size-24 place-items-center">
					<svg
						aria-hidden="true"
						className="absolute inset-0 size-full -rotate-90"
						viewBox="0 0 120 120"
					>
						<circle cx="60" cy="60" fill={ring} fillOpacity="0.1" r="56" />
						<circle
							cx="60"
							cy="60"
							fill="none"
							r="56"
							stroke={ring}
							strokeDasharray={`${(RING * score) / 100} ${RING}`}
							strokeLinecap="round"
							strokeWidth="8"
						/>
					</svg>
					<span
						className={cn(
							"font-display text-3xl tabular-nums leading-none tracking-[-0.03em]",
							text
						)}
					>
						{score}
					</span>
				</span>
				<span className="text-foreground text-sm">Performance</span>
			</div>
			<ul className="mt-5 border-foreground/[0.08] border-t">
				{metrics.map((metric) => (
					<li
						className="flex items-center gap-2 border-foreground/[0.08] border-b py-2.5 text-sm last:border-b-0 last:pb-0"
						key={metric.name}
					>
						<Mark tone={tone} />
						<span className="min-w-0 flex-1 truncate text-foreground">
							{metric.name}
						</span>
						<span className={cn("flex-none tabular-nums", text)}>
							{metric.value}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

/** A WordPress site's PageSpeed report beside the one it scored after its
 * rebuild, drawn the way Google's tool shows them. */
export function WpHealthPageSpeedPreview({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center gap-4 sm:flex-row sm:justify-center",
				className
			)}
		>
			<Report {...REPORTS[0]} />
			<ArrowRight
				aria-hidden="true"
				className="size-5 flex-none rotate-90 text-muted-foreground sm:rotate-0"
				strokeWidth={1.75}
			/>
			<Report {...REPORTS[1]} />
		</div>
	);
}
