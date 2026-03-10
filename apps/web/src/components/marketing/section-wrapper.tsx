import { cn } from "@/lib/utils";

export default function SectionWrapper({
	id,
	children,
	className,
	alternate = false,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
	alternate?: boolean;
}) {
	return (
		<section
			id={id}
			className={cn(
				"py-16 md:py-32",
				alternate ? "bg-white" : "bg-background",
				className,
			)}
		>
			<div className="mx-auto max-w-[1200px] px-6">{children}</div>
		</section>
	);
}
