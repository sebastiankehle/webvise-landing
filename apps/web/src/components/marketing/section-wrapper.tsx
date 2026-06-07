import { cn } from "@/lib/utils";

type ConstructedGridVariant = "hero" | "section" | "page" | "content";
type GridContainerWidth = "site" | "media";

const gridContainerWidths: Record<GridContainerWidth, string> = {
	site: "max-w-[1320px]",
	media: "max-w-[1200px]",
};

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

export function GridTopSeparator() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block"
		/>
	);
}

export function GridHatch() {
	return (
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
	);
}

export function GridRails() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block"
		>
			<div className="h-full border-grid-line border-x" />
		</div>
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

export function ConstructedGrid({
	hatch = false,
	variant = "section",
}: {
	hatch?: boolean;
	variant?: ConstructedGridVariant;
}) {
	if (variant === "page") {
		return (
			<>
				{hatch && <GridHatch />}
				<GridRails />
				<GridTopSeparator />
				<GridFrame className="inset-0" />
			</>
		);
	}

	if (variant === "content") {
		return (
			<>
				<GridTopSeparator />
				{hatch && <GridHatch />}
				<GridRails />
			</>
		);
	}

	if (variant === "hero") {
		return (
			<>
				{hatch && <GridHatch />}
				<GridFrame className="inset-0" />
			</>
		);
	}

	return (
		<>
			<GridTopSeparator />
			{hatch && <GridHatch />}
			<GridFrame className="inset-0" />
		</>
	);
}

export function GridContainer({
	children,
	className,
	width = "site",
}: {
	children: React.ReactNode;
	className?: string;
	width?: GridContainerWidth;
}) {
	return (
		<div
			className={cn(
				"relative mx-auto",
				gridContainerWidths[width],
				"px-6",
				className
			)}
		>
			{children}
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
			<ConstructedGrid hatch={hatch} variant="section" />
			<GridContainer>{children}</GridContainer>
		</section>
	);
}
