import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { services } from "@/data/services";
import { Link } from "@/i18n/navigation";

export default async function Services() {
	const t = await getTranslations("services");

	return (
		<SectionWrapper id="services">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3">
				{services.map((service) => (
					<Link
						key={service.slug}
						href={{
							pathname: "/services/[slug]",
							params: { slug: service.slug },
						}}
						className="group flex flex-col justify-between border-border/40 not-last:border-b p-8 transition-all hover:bg-muted/30 md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-10"
					>
						<div>
							<div className="flex flex-col gap-4">
								<service.icon
									className="h-5 w-5 shrink-0 text-brand"
									strokeWidth={1.5}
								/>
								<H3>{t(`${service.translationKey}.title`)}</H3>
							</div>
							<Muted className="mt-4">
								{t(`${service.translationKey}.tagline`)}
							</Muted>
						</div>
						<div className="mt-8 flex items-center justify-between border-border/40 border-t pt-5">
							<Caption>{t(`${service.translationKey}.timeline`)}</Caption>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
