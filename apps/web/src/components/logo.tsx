interface Polygon {
	className: string;
	fill: string;
	opacity: number;
	points: string;
}

const POLYGONS: readonly Polygon[] = [
	{
		className: "logo-seg-1",
		fill: "#f97316",
		opacity: 0.9,
		points: "16,2 8,10 16,12",
	},
	{
		className: "logo-seg-2",
		fill: "#fb923c",
		opacity: 0.85,
		points: "16,2 24,10 16,12",
	},
	{
		className: "logo-seg-3",
		fill: "#fdba74",
		opacity: 0.8,
		points: "8,10 4,18 16,12",
	},
	{
		className: "logo-seg-4",
		fill: "#f97316",
		opacity: 0.75,
		points: "24,10 28,18 16,12",
	},
	{
		className: "logo-seg-5",
		fill: "#fb923c",
		opacity: 0.9,
		points: "16,12 4,18 10,26",
	},
	{
		className: "logo-seg-6",
		fill: "#fdba74",
		opacity: 0.85,
		points: "16,12 28,18 22,26",
	},
	{
		className: "logo-seg-7",
		fill: "#f97316",
		opacity: 0.8,
		points: "16,12 10,26 16,30",
	},
	{
		className: "logo-seg-8",
		fill: "#fb923c",
		opacity: 0.75,
		points: "16,12 22,26 16,30",
	},
];

export default function Logo({
	className,
	animated,
}: {
	className?: string;
	animated?: boolean;
}) {
	return (
		<svg
			aria-hidden="true"
			className={`${animated ? "logo-animated" : ""} ${className ?? ""}`}
			fill="none"
			viewBox="0 0 32 32"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>webvise</title>
			{POLYGONS.map((p) => (
				<polygon
					className={animated ? `logo-seg ${p.className}` : undefined}
					fill={p.fill}
					key={p.className}
					opacity={animated ? undefined : p.opacity}
					points={p.points}
					style={
						animated ? { ["--seg-opacity" as string]: p.opacity } : undefined
					}
				/>
			))}
		</svg>
	);
}
