import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
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
			<section className="section-inverted relative pt-32 pb-24 md:pt-44 md:pb-24">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
						<div className="max-w-[660px]">
							<H1>{t("title")}</H1>
						</div>
						<div className="max-w-[560px] lg:justify-self-end">
							<Lead>{t("subtitle")}</Lead>
						</div>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper
				className="pt-12 md:pt-16"
				hatch
				id="case-studies-list"
				surface="inverted"
			>
				<StaggerChildren className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
					{caseStudies.map((cs) => (
						<Link
							className="surface-card group relative flex min-h-[340px] flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:min-h-0"
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: cs.slug },
							}}
							key={cs.slug}
						>
							<div className="flex items-start justify-between gap-4 p-5 md:p-6 md:pb-4">
								<div className="min-w-0">
									<Caption className="block text-brand-readable">
										{cs.client} &middot; {cs.industry}
									</Caption>
									<H3 className="mt-1.5 line-clamp-2 text-lg">{cs.title}</H3>
									<Muted className="mt-2 line-clamp-2">{cs.excerpt}</Muted>
								</div>
								<ArrowRight className="h-4 w-4 shrink-0 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
							</div>
							{cs.coverImage && (
								<div className="relative mt-auto min-h-0 flex-1 pl-5 md:pl-6">
									<div className="media-frame relative h-full min-h-[180px] w-full">
										<Image
											alt={`${cs.client}: ${cs.title}`}
											className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
											fill
											sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
											src={cs.coverImage}
										/>
									</div>
								</div>
							)}
						</Link>
					))}
				</StaggerChildren>
			</SectionWrapper>
		</>
	);
}
