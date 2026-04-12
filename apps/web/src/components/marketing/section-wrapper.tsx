import { cn } from "@/lib/utils";

export default function SectionWrapper({
	id,
	children,
	className,
	alternate = false,
	dark = false,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
	alternate?: boolean;
	dark?: boolean;
}) {
	return (
		<section
			id={id}
			className={cn(
				"relative py-20 md:py-36",
				dark
					? "section-dark"
					: alternate
						? "bg-card"
						: "bg-background",
				className,
			)}
		>
			<div className="relative mx-auto max-w-[1320px] px-6">{children}</div>
		</section>
	);
}
