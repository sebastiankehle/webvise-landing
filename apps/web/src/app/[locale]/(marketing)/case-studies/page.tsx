import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getCaseStudies } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("caseStudies"),
		getLocale(),
	]);
	const title = t("title");
	const description = t("subtitle");

	return {
		title,
		description,
		alternates: generateAlternates("/case-studies", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/case-studies", locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

export default async function CaseStudiesPage() {
	const locale = await getLocale();
	const t = await getTranslations("caseStudies");
	const caseStudies = getCaseStudies(locale);

	return (
		<>
			<section className="py-24 md:py-44">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="max-w-[720px]">
						<h1 className="font-display text-[40px] leading-[1.1] md:text-[56px]">
							{t("title")}
						</h1>
						<p className="mt-5 max-w-[560px] text-[17px] text-muted-foreground leading-[1.5]">
							{t("subtitle")}
						</p>
					</div>
				</div>
			</section>

			{/* Problem Statement */}
			<section className="py-20 md:py-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<p className="max-w-[960px] font-display text-[28px] leading-[1.3] md:text-[36px]">
						<span className="text-foreground">{t("statement.known")}</span>{" "}
						<span className="text-muted-foreground">{t("statement.pain")}</span>
					</p>
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
							className="group flex flex-col justify-between border-border/40 not-last:border-b p-8 transition-all hover:bg-muted/30 md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-10"
						>
							{cs.coverImage && (
								<div className="relative mb-5 aspect-[2/1] w-full overflow-hidden border border-border/40">
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
								<h2 className="mt-2 font-display text-[16px] leading-[21px] tracking-[-0.011em]">
									{cs.title}
								</h2>
								<p className="mt-3 text-muted-foreground text-sm leading-[1.5]">
									{cs.excerpt}
								</p>
							</div>
							<div className="mt-6 flex items-center justify-between border-border/40 border-t pt-5">
								<div className="flex flex-wrap gap-1.5">
									{cs.techStack.slice(0, 3).map((tech) => (
										<span
											key={tech}
											className="border border-border/40 px-2 py-0.5 text-muted-foreground text-xs"
										>
											{tech}
										</span>
									))}
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
							</div>
						</Link>
					))}
				</StaggerChildren>
			</SectionWrapper>

		</>
	);
}
