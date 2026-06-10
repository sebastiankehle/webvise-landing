import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H1, H3, Lead, Muted } from "@/components/ui/typography";
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
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<div className="max-w-[720px]">
						<H1>{t("title")}</H1>
						<Lead className="mt-5 max-w-[560px]">{t("subtitle")}</Lead>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper
				className="pt-12 md:pt-16"
				hatch
				id="case-studies-list"
				surface="alternate"
			>
				<StaggerChildren className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
					{caseStudies.map((cs) => (
						<Link
							className="surface-card group relative flex flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: cs.slug },
							}}
							key={cs.slug}
						>
							{cs.coverImage && (
								<div className="relative aspect-[2/1] w-full overflow-hidden">
									<Image
										alt={`${cs.client} - ${cs.title}`}
										className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
										fill
										sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
										src={cs.coverImage}
									/>
								</div>
							)}
							<div className="flex flex-1 flex-col p-5 md:p-6">
								<div className="flex items-start justify-between gap-4">
									<Caption className="text-brand-readable">
										{cs.client} &middot; {cs.industry}
									</Caption>
									<ArrowRight className="h-4 w-4 shrink-0 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
								</div>
								<H3 className="mt-2 line-clamp-2 text-lg">{cs.title}</H3>
								<Muted className="mt-2 line-clamp-3 leading-relaxed">
									{cs.excerpt}
								</Muted>
								<div className="mt-auto flex flex-wrap gap-1.5 pt-5">
									{cs.techStack.slice(0, 3).map((tech) => (
										<MarketingTag key={tech} variant="brand">
											{tech}
										</MarketingTag>
									))}
								</div>
							</div>
						</Link>
					))}
				</StaggerChildren>
			</SectionWrapper>
		</>
	);
}
