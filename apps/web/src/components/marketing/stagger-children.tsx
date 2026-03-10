import type { ReactNode } from "react";

interface StaggerChildrenProps {
	children: ReactNode;
	className?: string;
}

export default function StaggerChildren({
	children,
	className,
}: StaggerChildrenProps) {
	return <div className={className}>{children}</div>;
}
