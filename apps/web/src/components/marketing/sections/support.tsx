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
import { getCaseStudyBySlug } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";

const supportKeys = ["monitoring", "improvements", "extensions"];

export default async function Support() {
	const [locale, t, td] = await Promise.all([
		getLocale(),
		getTranslations("support"),
		getTranslations("serviceDetail"),
	]);
	const proofCaseStudy = getCaseStudyBySlug("relay", locale);

	return (
		<SectionWrapper hideOnMobile id="support">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<a
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href={homepageSectionHref("contact", locale)}
					>
						{t("contactLink")}
					</a>
				</div>
			</div>
			<div className="mt-14 grid items-start gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
				<StaggerChildren className="surface-card divide-y divide-border/60 self-stretch overflow-hidden rounded-2xl">
					{supportKeys.map((key) => (
						<div className="px-6 py-5 md:px-7" key={key}>
							<H3 className="text-base">{t(`items.${key}.title`)}</H3>
							<Muted className="mt-2 leading-relaxed">
								{t(`items.${key}.description`)}
							</Muted>
						</div>
					))}
				</StaggerChildren>
				{proofCaseStudy && (
					<Link
						className="surface-card media-frame group relative block self-stretch outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: proofCaseStudy.slug },
						}}
					>
						<div className="relative aspect-[16/9]">
							<Image
								alt={`${proofCaseStudy.client}: ${proofCaseStudy.title}`}
								className="object-cover object-left-top"
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								src="/images/case-studies/relay/workflow-library.webp"
							/>
						</div>
						<div className="flex items-center justify-between gap-4 border-border/60 border-t px-5 py-3.5">
							<Caption className="text-brand-readable">
								{td(
									proofCaseStudy.kind === "concept"
										? "conceptStudyLabel"
										: "recentProjectLabel",
									{ client: proofCaseStudy.client }
								)}
							</Caption>
							<ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand-readable" />
						</div>
					</Link>
				)}
			</div>
		</SectionWrapper>
	);
}
