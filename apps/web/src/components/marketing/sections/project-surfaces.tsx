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
import { cn } from "@/lib/utils";

const surfaceFrames: ReadonlyArray<{
	captionKey: string;
	className: string;
	featured: boolean;
	imageClassName: string;
	slug: string;
	src: string;
}> = [
	{
		slug: "relay",
		captionKey: "relayMargin",
		src: "/images/case-studies/relay/margin-dashboard.webp",
		className: "md:col-span-7 md:row-span-2",
		imageClassName: "object-left-top",
		featured: true,
	},
	{
		slug: "keel",
		captionKey: "keelContract",
		src: "/images/case-studies/keel/typed-tool-contract.webp",
		className: "md:col-span-5",
		imageClassName: "object-left-top",
		featured: false,
	},
	{
		slug: "morrow",
		captionKey: "morrowMemory",
		src: "/images/case-studies/morrow/memory-health-dashboard.webp",
		className: "md:col-span-5",
		imageClassName: "object-left-top",
		featured: false,
	},
	{
		slug: "rautenberg-pitch-engine",
		captionKey: "pitchPipeline",
		src: "/images/case-studies/rautenberg-pitch-engine/pipeline.webp",
		className: "md:col-span-4",
		imageClassName: "object-left-top",
		featured: false,
	},
	{
		slug: "ohyp-fintech",
		captionKey: "ohypAdmin",
		src: "/images/case-studies/ohyp-fintech/admin-dashboard.webp",
		className: "md:col-span-4",
		imageClassName: "object-left-top",
		featured: false,
	},
	{
		slug: "mp-bau-construction",
		captionKey: "mpbauChatbot",
		src: "/images/case-studies/mp-bau-construction/chatbot.webp",
		className: "md:col-span-4",
		imageClassName: "object-right-bottom",
		featured: false,
	},
];

export default async function ProjectSurfaces() {
	const [locale, t] = await Promise.all([
		getLocale(),
		getTranslations("projectSurfaces"),
	]);
	const frames = surfaceFrames
		.map((frame) => ({
			...frame,
			caseStudy: getCaseStudyBySlug(frame.slug, locale),
		}))
		.filter((frame) => frame.caseStudy);

	if (frames.length === 0) {
		return null;
	}

	return (
		<SectionWrapper className="overflow-hidden" id="project-surfaces">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<Caption className="mb-4 block text-brand-readable">
						{t("eyebrow")}
					</Caption>
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href="/case-studies"
					>
						{t("viewAll")}
					</Link>
				</div>
			</div>

			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:auto-rows-[250px] md:grid-cols-12 lg:auto-rows-[270px]">
				{frames.map((frame, index) => {
					const caseStudy = frame.caseStudy;
					if (!caseStudy) {
						return null;
					}

					const surfaceTitle = t(`frames.${frame.captionKey}`);
					const sizes = frame.featured
						? "(min-width: 1024px) 58vw, (min-width: 768px) 100vw, 100vw"
						: "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw";

					return (
						<Link
							className={cn(
								"surface-card group relative flex min-h-[340px] flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:min-h-0",
								index > 2 && "max-md:hidden",
								frame.className
							)}
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: caseStudy.slug },
							}}
							key={`${frame.slug}-${frame.src}`}
						>
							<div className="flex items-start justify-between gap-4 p-5 md:p-6 md:pb-4">
								<div className="min-w-0">
									<Caption className="block text-brand-readable">
										{caseStudy.client}
									</Caption>
									<H3
										className={cn(
											"mt-1.5 line-clamp-2",
											frame.featured ? "text-xl" : "text-lg"
										)}
									>
										{surfaceTitle}
									</H3>
									{frame.featured ? (
										<Muted className="mt-2 line-clamp-2 max-w-md">
											{caseStudy.excerpt}
										</Muted>
									) : null}
								</div>
								<ArrowRight className="h-4 w-4 shrink-0 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
							</div>
							<div className="relative mt-auto min-h-0 flex-1 pl-5 md:pl-6">
								<div className="relative h-full min-h-[180px] w-full overflow-hidden rounded-tl-xl">
									<Image
										alt={`${caseStudy.client}: ${surfaceTitle}`}
										className={cn(
											"object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]",
											frame.imageClassName
										)}
										fill
										sizes={sizes}
										src={frame.src}
									/>
								</div>
							</div>
						</Link>
					);
				})}
			</StaggerChildren>
		</SectionWrapper>
	);
}
