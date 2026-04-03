import { Activity } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const t = await getTranslations("wpHealthReport.cta");

	return (
		<SectionWrapper id="wp-health" alternate>
			<div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
				<div>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center border border-brand/20 bg-brand/5">
							<Activity className="h-4 w-4 text-brand" strokeWidth={1.5} />
						</div>
						<span className="text-brand text-xs">
							{t("badge")}
						</span>
					</div>
					<h2 className="mt-6 font-display text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">
						{t("description")}
					</p>
					<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
						<Button
							size="lg"
							className="border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
							data-ph-capture-attribute-cta-location="wp-health-cta"
							data-ph-capture-attribute-cta-variant="analyzer"
							render={<Link href="/wp-health-report" />}
						>
							{t("button")}
						</Button>
						<span className="text-muted-foreground text-xs">
							{t("trustLine")}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-full max-w-xs space-y-5 border border-border/40 p-8">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs">
								PageSpeed Score
							</span>
							<span className="font-display text-lg text-orange-600">32</span>
						</div>
						<div className="h-1.5 w-full bg-muted">
							<div className="h-full w-[32%] bg-orange-600" />
						</div>
						<div className="flex items-center gap-3 py-1">
							<span className="h-px flex-1 bg-border/40" />
							<span className="text-muted-foreground/50 text-xs">vs</span>
							<span className="h-px flex-1 bg-border/40" />
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs">
								After Next.js
							</span>
							<span className="font-display text-lg text-green-600">95</span>
						</div>
						<div className="h-1.5 w-full bg-muted">
							<div className="h-full w-[95%] bg-green-600" />
						</div>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
