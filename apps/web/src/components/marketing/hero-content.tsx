import type { ReactNode } from "react";

export default function HeroContent({ children }: { children: ReactNode }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both">
			{children}
		</div>
	);
}
