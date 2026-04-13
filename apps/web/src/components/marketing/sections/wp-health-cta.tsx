import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Body, Caption, H2, Lead, Mono } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function WpHealthCta() {
	const t = await getTranslations("wpHealthReport.cta");

	return (
		<SectionWrapper id="wp-health" alternate>
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-4 max-w-[520px]">{t("description")}</Lead>
			</div>

			<div className="mt-14 grid items-center gap-px overflow-hidden border border-border/40 md:grid-cols-2">
				{/* Score comparison */}
				<div className="space-y-5 border-border/40 p-8 md:border-r md:p-10">
					<div className="flex items-center justify-between">
						<Caption>PageSpeed Score</Caption>
						<Mono className="text-lg text-orange-600">32</Mono>
					</div>
					<div className="h-1.5 w-full bg-muted">
						<div className="h-full w-[32%] bg-orange-600" />
					</div>
					<div className="flex items-center gap-3 py-1">
						<span className="h-px flex-1 bg-border/40" />
						<Caption className="text-muted-foreground/50">vs</Caption>
						<span className="h-px flex-1 bg-border/40" />
					</div>
					<div className="flex items-center justify-between">
						<Caption>After Next.js</Caption>
						<Mono className="text-green-600 text-lg">95</Mono>
					</div>
					<div className="h-1.5 w-full bg-muted">
						<div className="h-full w-[95%] bg-green-600" />
					</div>
				</div>

				{/* CTA */}
				<div className="flex flex-col items-start justify-center p-8 md:p-10">
					<Body className="text-sm leading-[1.6]">{t("trustLine")}</Body>
					<Button
						size="lg"
						className="mt-6 border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
						data-ph-capture-attribute-cta-location="wp-health-cta"
						data-ph-capture-attribute-cta-variant="analyzer"
						render={<Link href="/wp-health-report" />}
					>
						{t("button")}
					</Button>
				</div>
			</div>
		</SectionWrapper>
	);
}
