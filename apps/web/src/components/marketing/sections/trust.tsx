import { Shield, BrainCircuit } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Link } from "@/i18n/navigation";

export default async function Trust() {
	const t = await getTranslations("trust");

	return (
		<SectionWrapper id="trust">
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("section.title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">
					{t("section.subtitle")}
				</p>
			</div>
			<StaggerChildren className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border md:grid-cols-2">
				<Link
					href="/trust"
					className="group flex items-center gap-5 border-border p-6 transition-colors hover:bg-muted/30 md:not-last:border-r md:p-10"
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
						<Shield className="h-5 w-5 text-brand" strokeWidth={1.5} />
					</div>
					<div>
						<p className="font-display text-lg tracking-tight transition-colors group-hover:text-brand">
							ISO 27001
						</p>
						<p className="mt-0.5 text-muted-foreground text-sm">
							{t("iso27001.label")}
						</p>
					</div>
				</Link>
				<Link
					href="/trust"
					className="group flex items-center gap-5 border-border border-t p-6 transition-colors hover:bg-muted/30 md:border-t-0 md:p-10"
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
						<BrainCircuit className="h-5 w-5 text-brand" strokeWidth={1.5} />
					</div>
					<div>
						<p className="font-display text-lg tracking-tight transition-colors group-hover:text-brand">
							ISO 42001
						</p>
						<p className="mt-0.5 text-muted-foreground text-sm">
							{t("iso42001.label")}
						</p>
					</div>
				</Link>
			</StaggerChildren>
			<p className="mt-6 text-sm text-muted-foreground">
				<Link
					href="/trust"
					className="text-brand transition-opacity hover:opacity-80"
				>
					{t("section.learnMore")} →
				</Link>
			</p>
		</SectionWrapper>
	);
}
