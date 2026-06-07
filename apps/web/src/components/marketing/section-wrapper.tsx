import { cn } from "@/lib/utils";

function sectionBackground(dark: boolean, alternate: boolean): string {
	if (dark) {
		return "section-dark";
	}
	return alternate ? "section-alternate" : "bg-background";
}

export function CornerMarker({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"absolute h-3.5 w-3.5 select-none text-grid-line",
				className
			)}
		>
			<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
			<span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
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
			<div className="relative h-full">
				<span className="absolute inset-y-0 left-0 w-px bg-grid-line" />
				<span className="absolute inset-y-0 right-0 w-px bg-grid-line" />
				<CornerMarker className="-top-[6.5px] -left-[6.5px]" />
				<CornerMarker className="-top-[6.5px] -right-[6.5px]" />
				<CornerMarker className="-bottom-[6.5px] -left-[6.5px]" />
				<CornerMarker className="-right-[6.5px] -bottom-[6.5px]" />
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
						className="grid-hatch pointer-events-none absolute inset-y-0 left-0 hidden md:block md:w-[calc((100%_-_1320px)_/_2)]"
					/>
					<div
						aria-hidden="true"
						className="grid-hatch pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[calc((100%_-_1320px)_/_2)]"
					/>
				</>
			)}
			{/* Frame spans full section — no gap between sections */}
			<GridFrame className="inset-0" />
			<div className="relative mx-auto max-w-[1320px] px-6">{children}</div>
		</section>
	);
}
