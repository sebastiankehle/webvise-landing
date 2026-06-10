import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import CardHoverIcon from "@/components/marketing/card-hover-icon";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	H2,
	H3,
	inlineLinkClassName,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { customSystems } from "@/data/systems";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function CustomSystems() {
	const t = await getTranslations("customSystems");
	const th = await getTranslations("hero");

	return (
		<SectionWrapper id="systems" surface="alternate">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href={{ pathname: "/", hash: "contact" }}
					>
						{th("cta")}
					</Link>
				</div>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-6">
				{customSystems.map(
					({ slug, translationKey: key, exampleCount, icon }, index) => (
						<Link
							className={cn(
								"surface-card group relative p-6 outline-none focus-visible:ring-1 focus-visible:ring-ring/50 md:p-8",
								index < 2 ? "lg:col-span-3" : "lg:col-span-2"
							)}
							href={{
								pathname: "/systems/[slug]",
								params: { slug },
							}}
							key={key}
						>
							<CardHoverIcon className="text-brand-icon" icon={icon} />
							<H3 className="mt-5">{t(`items.${key}.title`)}</H3>
							<Muted className="mt-3 leading-relaxed">
								{t(`items.${key}.description`)}
							</Muted>
							<div className="mt-6 flex flex-wrap gap-2">
								{Array.from({ length: exampleCount }, (_, i) => {
									const example = t(`items.${key}.examples.${i}`);

									return (
										<MarketingTag key={example} variant="subtle">
											{example}
										</MarketingTag>
									);
								})}
							</div>
							<ArrowRight className="absolute top-6 right-6 h-4 w-4 text-brand-icon opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 md:top-8 md:right-8" />
						</Link>
					)
				)}
			</StaggerChildren>
		</SectionWrapper>
	);
}
