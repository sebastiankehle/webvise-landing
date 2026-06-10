import { getTranslations } from "next-intl/server";

import CardHoverIcon from "@/components/marketing/card-hover-icon";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	Caption,
	H2,
	H3,
	inlineLinkClassName,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { services } from "@/data/services";
import { Link } from "@/i18n/navigation";

export default async function Services() {
	const t = await getTranslations("services");

	return (
		<SectionWrapper id="services">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href={{ pathname: "/", hash: "scope" }}
					>
						{t("scopeLink")}
					</Link>
				</div>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
				{services.map((service) => (
					<Link
						className="surface-card flex flex-col p-6 outline-none focus-visible:ring-1 focus-visible:ring-ring/50 md:p-7"
						href={{
							pathname: "/services/[slug]",
							params: { slug: service.slug },
						}}
						key={service.slug}
					>
						<div>
							<div className="flex flex-col gap-4">
								<CardHoverIcon
									className="shrink-0 text-brand-icon"
									icon={service.icon}
								/>
								<H3>{t(`${service.translationKey}.title`)}</H3>
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
