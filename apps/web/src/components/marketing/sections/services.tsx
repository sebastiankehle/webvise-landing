import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { services } from "@/data/services";
import { Link } from "@/i18n/navigation";

export default async function Services() {
	const t = await getTranslations("services");

	return (
		<SectionWrapper id="services">
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
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
								<div className="flex h-10 w-10 items-center justify-center border border-brand/20 bg-brand/5 transition-colors group-hover:border-brand/40 group-hover:bg-brand/10">
									<service.icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
								</div>
								<h3 className="font-display text-xl">
									{t(`${service.translationKey}.title`)}
								</h3>
							</div>
							<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
								{t(`${service.translationKey}.tagline`)}
							</p>
						</div>
						<div className="mt-8 flex items-center justify-between border-border/40 border-t pt-5">
							<span className="text-muted-foreground text-xs">
								{t(`${service.translationKey}.timeline`)}
							</span>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
