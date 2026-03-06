import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { services } from "@/data/services";

export default async function Services() {
	const t = await getTranslations("services");

	return (
		<SectionWrapper id="services">
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3">
				{services.map((service, i) => (
					<a
						key={service.slug}
						href={`/services/${service.slug}`}
						className="group flex flex-col justify-between border-border/40 p-8 transition-colors hover:bg-muted/30 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:nth-child(3n))]:border-r md:[&:nth-child(-n+3)]:border-b"
					>
						<div>
							<span className="font-medium text-muted-foreground/50 text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							<h3 className="mt-2 font-medium text-lg">
								{t(`${service.translationKey}.title`)}
							</h3>
							<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
								{t(`${service.translationKey}.tagline`)}
							</p>
						</div>
						<div className="mt-6 flex items-center justify-between">
							<span className="font-light text-muted-foreground text-sm">
								{t(`${service.translationKey}.timeline`)}
							</span>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</div>
					</a>
				))}
			</div>
		</SectionWrapper>
	);
}
