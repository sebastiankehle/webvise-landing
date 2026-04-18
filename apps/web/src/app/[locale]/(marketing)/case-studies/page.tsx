import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper, {
	GridFrame,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H1, H3, Label, Lead, Muted } from "@/components/ui/typography";
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
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-24">
				<div className="pointer-events-none absolute inset-y-0 left-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-y-0 right-0 hidden grid-hatch md:block md:w-[calc((100%-1320px)/2)]" aria-hidden="true" />
				<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
					<div className="h-full border-x border-grid-line" />
				</div>
				<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
				<GridFrame className="inset-0" />
				<div className="relative mx-auto max-w-[1320px] px-6">
					<div className="max-w-[720px]">
						<H1>{t("title")}</H1>
						<Lead className="mt-5 max-w-[560px] text-[17px] leading-[1.55]">
							{t("subtitle")}
						</Lead>
					</div>
				</div>
			</section>

			<SectionWrapper id="case-studies-list" alternate className="pt-0 md:pt-0" hatch>
				<StaggerChildren className="-mx-6 grid border-t border-grid-line md:grid-cols-2 lg:grid-cols-3">
					{caseStudies.map((cs) => (
						<Link
							key={cs.slug}
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: cs.slug },
							}}
							className="group flex flex-col justify-between border-b border-grid-line p-6 transition-all hover:bg-muted/30 md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
						>
							{cs.coverImage && (
								<div className="relative mb-5 aspect-[2/1] w-full overflow-hidden border border-border/40">
									<Image
										src={cs.coverImage}
										alt={`${cs.client} – ${cs.title}`}
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
										className="object-cover transition-all duration-500 group-hover:brightness-110"
									/>
								</div>
							)}
							<div>
								<Label>{cs.industry}</Label>
								<H3 className="mt-2">{cs.title}</H3>
								<Muted className="mt-3 leading-[1.6]">{cs.excerpt}</Muted>
							</div>
							<div className="mt-6 flex items-center justify-between border-border/40 border-t pt-5">
								<div className="flex flex-wrap gap-1.5">
									{cs.techStack.slice(0, 3).map((tech) => (
										<Label
											key={tech}
											className="border border-border/40 px-2 py-0.5 text-muted-foreground"
										>
											{tech}
										</Label>
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
