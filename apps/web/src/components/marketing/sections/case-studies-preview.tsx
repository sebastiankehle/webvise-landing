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
	const caseStudies = getCaseStudies(locale).slice(0, 3);

	if (caseStudies.length === 0) return null;

	return (
		<SectionWrapper id="case-studies">
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<StaggerChildren className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3">
				{caseStudies.map((cs) => (
					<Link
						key={cs.slug}
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: cs.slug },
						}}
						className="group flex flex-col justify-between border-border/40 border-t-2 border-t-transparent not-last:border-b p-6 transition-all hover:border-t-brand hover:bg-muted/30 md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-8"
					>
						{cs.coverImage && (
							<div className="relative mb-4 aspect-[8/5] w-full overflow-hidden border border-border/40">
								<Image
									src={cs.coverImage}
									alt={cs.title}
									fill
									className="object-cover transition-transform group-hover:scale-105"
								/>
							</div>
						)}
						<div>
							<span className="font-light text-brand text-xs uppercase tracking-wider">
								{cs.industry}
							</span>
							<h3 className="mt-2 font-medium text-lg leading-snug">
								{cs.title}
							</h3>
							<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
								{cs.excerpt}
							</p>
						</div>
						<div className="mt-6 flex items-center justify-between">
							<span className="font-light text-muted-foreground text-xs">
								{t("readMore")}
							</span>
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</div>
					</Link>
				))}
			</StaggerChildren>
			<div className="mt-8 flex justify-center">
				<Link
					href="/case-studies"
					className="group inline-flex items-center gap-2 font-light text-muted-foreground text-sm transition-colors hover:text-foreground"
				>
					{t("viewAll")}
					<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>
		</SectionWrapper>
	);
}
