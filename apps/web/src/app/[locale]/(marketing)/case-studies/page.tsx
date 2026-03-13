import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getCaseStudies } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("caseStudies");
	return {
		title: `${t("title")} - webvise`,
		description: t("subtitle"),
	};
}

export default async function CaseStudiesPage() {
	const locale = await getLocale();
	const t = await getTranslations("caseStudies");
	const caseStudies = getCaseStudies(locale);

	return (
		<>
			<section className="py-20 md:py-40">
				<div className="mx-auto max-w-[1200px] px-6">
					<div className="max-w-2xl">
						<h1 className="font-normal text-3xl tracking-tight md:text-5xl">
							{t("title")}
						</h1>
						<p className="mt-4 font-light text-lg text-muted-foreground">
							{t("subtitle")}
						</p>
					</div>
				</div>
			</section>

			<SectionWrapper id="case-studies-list" alternate>
				<StaggerChildren className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3">
					{caseStudies.map((cs) => (
						<Link
							key={cs.slug}
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: cs.slug },
							}}
							className="group flex flex-col justify-between border-border/40 border-t-2 border-t-transparent not-last:border-b p-6 transition-all hover:border-t-brand hover:bg-muted/30 md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-8"
						>
							<div>
								<span className="font-light text-brand text-xs uppercase tracking-wider">
									{cs.industry}
								</span>
								<h2 className="mt-2 font-medium text-lg leading-snug">
									{cs.title}
								</h2>
								<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
									{cs.excerpt}
								</p>
							</div>
							<div className="mt-6 flex items-center justify-between">
								<div className="flex flex-wrap gap-1.5">
									{cs.techStack.slice(0, 3).map((tech) => (
										<span
											key={tech}
											className="border border-border/40 px-2 py-0.5 font-light text-muted-foreground text-xs"
										>
											{tech}
										</span>
									))}
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</StaggerChildren>
			</SectionWrapper>

			<SectionWrapper id="cta">
				<div className="max-w-xl">
					<h2 className="font-normal text-2xl tracking-tight">
						{t("ctaTitle")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("ctaDescription")}
					</p>
					<div className="mt-8">
						<Link
							href={{ pathname: "/", hash: "contact" }}
							className="inline-flex items-center border border-brand bg-brand px-5 py-2.5 font-medium text-sm text-white transition-colors hover:bg-brand/80"
						>
							{t("ctaButton")}
						</Link>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
