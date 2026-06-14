import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

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
import { getCaseStudies } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";

export default async function CaseStudiesPreview() {
	const locale = await getLocale();
	const t = await getTranslations("caseStudies");
	const featured = getCaseStudies(locale).slice(0, 6);

	if (featured.length === 0) {
		return null;
	}
	return (
		<SectionWrapper hatch hideOnMobile id="case-studies" surface="inverted">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href="/case-studies"
					>
						{t("viewAll")}
					</Link>
				</div>
			</div>

			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
				{featured.map((cs, index) => (
					<Link
						className={`surface-card group flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${index > 2 ? "max-md:hidden" : ""}`}
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: cs.slug },
						}}
						key={cs.slug}
					>
						{cs.coverImage && (
							<div className="media-frame relative aspect-[2/1] w-full">
								<Image
									alt={`${cs.client} - ${cs.title}`}
									className="object-cover transition-all duration-500 group-hover:brightness-110"
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
									src={cs.coverImage}
								/>
							</div>
						)}
						<div className="flex flex-1 flex-col p-6 md:p-7">
							<Caption className="block text-brand-readable">
								{cs.industry}
							</Caption>
							<H3 className="mt-3">{cs.title}</H3>
							<Muted className="mt-3">{cs.excerpt}</Muted>
							<div className="mt-auto flex items-center justify-end pt-6">
								<ArrowRight className="h-4 w-4 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
							</div>
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
