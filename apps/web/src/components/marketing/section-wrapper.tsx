import { cn } from "@/lib/utils";

function sectionBackground(dark: boolean, alternate: boolean): string {
	if (dark) {
		return "section-dark";
	}
	return alternate ? "bg-white" : "bg-background";
}

export function CornerMarker({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"absolute h-3.5 w-3.5 select-none text-muted-foreground/30",
				className
			)}
		>
			<svg
				aria-hidden="true"
				className="h-full w-full"
				fill="none"
				viewBox="0 0 14 14"
			>
				<title>corner marker</title>
				<path d="M0 7h14M7 0v14" stroke="currentColor" strokeWidth="1" />
			</svg>
		</span>
	);
}

export function GridFrame({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute mx-auto hidden max-w-[1320px] md:block",
				className
			)}
		>
			<div className="relative h-full border-grid-line border-x">
				<CornerMarker className="-top-[7px] -left-[7px]" />
				<CornerMarker className="-top-[7px] -right-[7px]" />
				<CornerMarker className="-bottom-[7px] -left-[7px]" />
				<CornerMarker className="-right-[7px] -bottom-[7px]" />
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
			className={cn(
				"relative py-24 md:py-40",
				sectionBackground(dark, alternate),
				className
			)}
			id={id}
		>
			{/* Full-width horizontal line at section top — clean separator */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block"
			/>
			{/* Side gutter hatch */}
			{hatch && (
				<>
					<div
						aria-hidden="true"
						className="grid-hatch pointer-events-none absolute inset-y-0 left-0 hidden md:block md:w-[calc((100%-1320px)/2)]"
					/>
					<div
						aria-hidden="true"
						className="grid-hatch pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[calc((100%-1320px)/2)]"
					/>
				</>
			)}
			{/* Frame spans full section — no gap between sections */}
			<GridFrame className="inset-0" />
			<div className="relative mx-auto max-w-[1320px] px-6">{children}</div>
		</section>
	);
}
