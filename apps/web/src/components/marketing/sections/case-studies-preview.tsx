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
		"bloom-and-root-ecommerce",
		"mp-bau-construction",
	];
	const featured = featuredSlugs
		.map((slug) => caseStudies.find((cs) => cs.slug === slug))
		.filter(Boolean) as typeof caseStudies;
	const rest = caseStudies.filter((cs) => !featuredSlugs.includes(cs.slug));

	return (
		<SectionWrapper id="case-studies" dark>
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
			</div>

			{/* Featured row - 3 large cards */}
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
							<div className="relative mb-5 aspect-[8/5] w-full overflow-hidden border border-border">
								<Image
									src={cs.coverImage}
									alt={`${cs.client} – ${cs.title}`}
									fill
									className="object-cover transition-all duration-500 group-hover:brightness-110"
								/>
							</div>
						)}
						<div>
							<span className="font-mono text-[10px] text-brand uppercase tracking-widest">
								{cs.industry}
							</span>
							<h3 className="mt-2 font-display text-xl leading-snug">
								{cs.title}
							</h3>
							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								{cs.excerpt}
							</p>
						</div>
						<div className="mt-6 flex items-center justify-between border-border border-t pt-5">
							<span className="text-muted-foreground text-xs">
								{t("readMore")}
							</span>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>

			{/* Remaining projects - compact cards */}
			{rest.length > 0 && (
				<StaggerChildren className="mt-px grid gap-px overflow-hidden border border-border border-t-0 md:grid-cols-2 lg:grid-cols-3">
					{rest.map((cs) => (
						<Link
							key={cs.slug}
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: cs.slug },
							}}
							className="group flex items-center gap-5 border-border not-last:border-b p-5 transition-all hover:bg-[--surface-dark-secondary] md:not-nth-[3n]:border-r md:not-last:border-b-0"
						>
							{cs.coverImage && (
								<div className="relative aspect-[8/5] w-28 shrink-0 overflow-hidden border border-border">
									<Image
										src={cs.coverImage}
										alt={`${cs.client} – ${cs.title}`}
										fill
										className="object-cover transition-all duration-500 group-hover:brightness-110"
									/>
								</div>
							)}
							<div className="min-w-0">
								<span className="font-mono text-[9px] text-brand uppercase tracking-widest">
									{cs.industry}
								</span>
								<h3 className="mt-1 text-sm leading-snug">
									{cs.title}
								</h3>
								<div className="mt-2 flex items-center gap-1">
									<span className="text-muted-foreground text-xs">
										{t("readMore")}
									</span>
									<ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
								</div>
							</div>
						</Link>
					))}
				</StaggerChildren>
			)}

			<div className="mt-10 flex justify-center">
				<Link
					href="/case-studies"
					className="group inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
				>
					{t("viewAll")}
					<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>
		</SectionWrapper>
	);
}
