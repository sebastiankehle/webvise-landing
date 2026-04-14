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
			<StaggerChildren className="mt-16 -mx-6 grid border-t border-grid-line md:grid-cols-2 lg:grid-cols-3">
				{services.map((service) => (
					<Link
						key={service.slug}
						href={{
							pathname: "/services/[slug]",
							params: { slug: service.slug },
						}}
						className="group flex flex-col border-b border-grid-line p-6 transition-all md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
					>
						<div>
							<div className="flex flex-col gap-4">
								<service.icon
									className="h-5 w-5 shrink-0 text-brand"
									strokeWidth={1.5}
								/>
								<H3 className="transition-colors group-hover:text-brand">
									{t(`${service.translationKey}.title`)}
								</H3>
							</div>
							<Muted className="mt-4">
								{t(`${service.translationKey}.tagline`)}
							</Muted>
							<Caption className="mt-4">
								{t(`${service.translationKey}.timeline`)}
							</Caption>
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
