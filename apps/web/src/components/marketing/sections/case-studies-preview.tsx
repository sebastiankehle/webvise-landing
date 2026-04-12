import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
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
			<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
				<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
					{t("title")}
				</h2>
				<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
					{t("subtitle")}
				</p>
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
							<span className="font-[510] text-brand text-xs tracking-[-0.011em]">
								{cs.industry}
							</span>
							<h3 className="mt-2 font-display text-[16px] leading-[21px] tracking-[-0.011em]">
								{cs.title}
							</h3>
							<p className="mt-3 text-muted-foreground text-sm leading-[1.5]">
								{cs.excerpt}
							</p>
						</div>
						<div className="mt-6 flex items-center justify-between border-border border-t pt-5">
							<span className="text-muted-foreground text-xs tracking-[-0.011em]">
								{t("readMore")}
							</span>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
