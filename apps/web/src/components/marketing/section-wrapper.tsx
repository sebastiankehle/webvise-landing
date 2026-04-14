import { cn } from "@/lib/utils";

export function CornerMarker({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"absolute h-3.5 w-3.5 text-muted-foreground/30 select-none",
				className,
			)}
			aria-hidden="true"
		>
			<svg viewBox="0 0 14 14" fill="none" className="h-full w-full">
				<path d="M0 7h14M7 0v14" stroke="currentColor" strokeWidth="1" />
			</svg>
		</span>
	);
}

export function GridFrame({
	children,
	className,
}: { children?: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute mx-auto hidden max-w-[1320px] md:block",
				className,
			)}
			aria-hidden="true"
		>
			<div className="relative h-full border-x border-grid-line">
				<CornerMarker className="-top-[7px] -left-[7px]" />
				<CornerMarker className="-top-[7px] -right-[7px]" />
				<CornerMarker className="-bottom-[7px] -left-[7px]" />
				<CornerMarker className="-bottom-[7px] -right-[7px]" />
				{children}
			</div>
		</div>
	);
}

export default function SectionWrapper({
	id,
	children,
	className,
	alternate = false,
	dark = false,
	hatch = false,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
	alternate?: boolean;
	dark?: boolean;
	hatch?: boolean;
}) {
	return (
		<section
			id={id}
			className={cn(
				"relative py-24 md:py-40",
				dark ? "section-dark" : alternate ? "bg-white" : "bg-background",
				className,
			)}
		>
			{/* Full-width horizontal line at section top — clean separator */}
			<div
				className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block"
				aria-hidden="true"
			/>
			{/* Side gutter hatch */}
			{hatch && (
				<>
					<div
						className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]"
						aria-hidden="true"
					/>
					<div
						className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]"
						aria-hidden="true"
					/>
				</>
			)}
			{/* Frame spans full section — no gap between sections */}
			<GridFrame className="inset-0" />
			<div className="relative mx-auto max-w-[1320px] px-6">{children}</div>
		</section>
	);
}
