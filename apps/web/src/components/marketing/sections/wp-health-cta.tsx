import { Activity } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const t = await getTranslations("wpHealthReport.cta");

	return (
		<SectionWrapper id="wp-health">
			<div className="grid items-center gap-10 md:grid-cols-2">
				<div>
					<div className="flex items-center gap-3">
						<Activity className="h-5 w-5 text-brand" strokeWidth={1.5} />
						<span className="font-medium text-brand text-xs uppercase tracking-wider">
							{t("badge")}
						</span>
					</div>
					<h2 className="mt-4 font-normal text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground leading-relaxed">
						{t("description")}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
						<Button
							size="lg"
							className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
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
					<div className="w-full max-w-xs space-y-4 border border-border/40 p-6">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs">
								PageSpeed Score
							</span>
							<span className="font-medium text-red-500 text-sm">32/100</span>
						</div>
						<div className="h-2 w-full bg-muted">
							<div className="h-full w-[32%] bg-red-500" />
						</div>
						<div className="flex items-center gap-2 pt-2">
							<span className="h-4 w-px bg-border" />
							<span className="text-muted-foreground text-xs">vs</span>
							<span className="h-4 w-px bg-border" />
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs">
								After Next.js
							</span>
							<span className="font-medium text-green-500 text-sm">95/100</span>
						</div>
						<div className="h-2 w-full bg-muted">
							<div className="h-full w-[95%] bg-green-500" />
						</div>
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
