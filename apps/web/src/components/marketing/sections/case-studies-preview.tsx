import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, H3, Label, Lead, Muted } from "@/components/ui/typography";
import { getCaseStudies } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";

export default async function CaseStudiesPreview() {
	const locale = await getLocale();
	const t = await getTranslations("caseStudies");
	const caseStudies = getCaseStudies(locale);

	if (caseStudies.length === 0) return null;

	const featuredSlugs = [
		"old-world-labs",
		"ohyp-fintech",
		"mp-bau-construction",
	];
	const featured = featuredSlugs
		.map((slug) => caseStudies.find((cs) => cs.slug === slug))
		.filter(Boolean) as typeof caseStudies;
	return (
		<SectionWrapper id="case-studies" dark>
			<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
				<div className="max-w-[640px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
				</div>
				<Link
					href="/case-studies"
					className="shrink-0 text-brand text-sm transition-opacity hover:opacity-80"
				>
					{t("viewAll")}
				</Link>
			</div>

			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-3">
				{featured.map((cs) => (
					<Link
						key={cs.slug}
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: cs.slug },
						}}
						className="group flex flex-col justify-between border-border not-last:border-b p-6 transition-all hover:bg-[--surface-dark-secondary] md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-8"
					>
						{cs.coverImage && (
							<div className="relative mb-5 aspect-[2/1] w-full overflow-hidden border border-border">
								<Image
									src={cs.coverImage}
									alt={`${cs.client} – ${cs.title}`}
									fill
									className="object-cover transition-all duration-500 group-hover:brightness-110"
								/>
							</div>
						)}
						<div>
							<Label>{cs.industry}</Label>
							<H3 className="mt-2 tracking-[-0.04em]">{cs.title}</H3>
							<Muted className="mt-3">{cs.excerpt}</Muted>
						</div>
						<div className="mt-6 flex items-center justify-end border-border border-t pt-5">
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
