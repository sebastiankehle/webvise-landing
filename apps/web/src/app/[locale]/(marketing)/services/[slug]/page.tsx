import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import { ActionArrow, ActionLink } from "@/components/marketing/action";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { FaqList } from "@/components/marketing/faq-list";
import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H1, H2, H3 } from "@/components/ui/typography";
import type { BookingTopic } from "@/data/booking";
import {
	getCaseStudies,
	getCaseStudyBySlug,
	getFeaturedCaseStudies,
} from "@/data/case-studies";
import { getDeckBySlug } from "@/data/decks";
import {
	getOfferingBySlug,
	getOfferingProof,
	getRelatedOfferings,
	type Offering,
	type OfferingGroupKey,
	offerings,
} from "@/data/offerings";
import { Link } from "@/i18n/navigation";
import { pinLocale } from "@/i18n/static-locale";
import {
	offeringDetail,
	offeringMeta,
	offeringTagline,
	offeringTitle,
} from "@/lib/offering-content";
import { generateAlternates, localizedUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** The booking flow opens on the topic that matches the offering's group. */
const groupTopics: Record<OfferingGroupKey, BookingTopic> = {
	launch: "website",
	operate: "software",
	automate: "automation",
};

export function generateStaticParams() {
	return offerings.map((offering) => ({ slug: offering.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	await pinLocale(params);
	const { slug } = await params;
	const offering = getOfferingBySlug(slug);
	if (!offering) {
		return {};
	}

	const [ts, tc, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getLocale(),
	]);

	const { description, title } = offeringMeta(offering, ts, tc);
	const path = `/services/${slug}`;

	return {
		title,
		description,
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl(path, locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

export default async function ServicePage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	await pinLocale(params);
	const { slug } = await params;
	const offering = getOfferingBySlug(slug);

	if (!offering) {
		notFound();
	}

	return <ServiceOfferingPage offering={offering} />;
}

async function ServiceOfferingPage({ offering }: { offering: Offering }) {
	const slug = offering.slug;
	const [t, tc, td, tg, th, tschema, locale] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
		getTranslations("serviceDetail"),
		getTranslations("deckGate"),
		getTranslations("home"),
		getTranslations("schema"),
		getLocale(),
	]);
	const deck = getDeckBySlug(slug);
	const proof = getOfferingProof(offering);
	const proofCaseStudy = getCaseStudyBySlug(proof.caseStudySlug, locale);
	const proofShots = proof.shots ?? (proofCaseStudy?.images ?? []).slice(0, 2);
	const relatedOfferings = getRelatedOfferings(slug);
	// Projects that used this offering first, then other featured work. The
	// project already shown as proof is left out.
	const relatedWork = [
		...getCaseStudies(locale, { kind: "client" }).filter((caseStudy) =>
			caseStudy.services.includes(slug)
		),
		...getFeaturedCaseStudies(locale),
	]
		.filter(
			(caseStudy, index, all) =>
				caseStudy.slug !== proof.caseStudySlug &&
				all.findIndex((other) => other.slug === caseStudy.slug) === index
		)
		.slice(0, 3);
	const detail = offeringDetail(offering, t, tc, td);

	const serviceUrl = localizedUrl(`/services/${slug}`, locale);
	const faqEntries =
		detail.faqItems.length > 0
			? [
					{
						"@type": "FAQPage" as const,
						"@id": `${serviceUrl}#faq`,
						mainEntity: detail.faqItems.map((item) => ({
							"@type": "Question" as const,
							name: item.question,
							acceptedAnswer: {
								"@type": "Answer" as const,
								text: item.answer,
							},
						})),
					},
				]
			: [];

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Service",
				"@id": `${serviceUrl}#service`,
				name: detail.schemaTitle,
				description: detail.schemaDescription,
				provider: {
					"@id": "https://www.webvise.io/#organization",
				},
				areaServed: {
					"@type": "GeoShape",
					name: tschema("worldwide"),
				},
				serviceType: detail.schemaTitle,
			},
			{
				"@type": "BreadcrumbList",
				"@id": `${serviceUrl}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: tschema("home"),
						item: localizedUrl("/", locale),
					},
					{
						"@type": "ListItem",
						position: 2,
						name: tschema("services"),
						item: localizedUrl("/services", locale),
					},
					{
						"@type": "ListItem",
						position: 3,
						name: detail.schemaTitle,
						item: serviceUrl,
					},
				],
			},
			...faqEntries,
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible grid gap-x-10 gap-y-12 lg:grid-cols-12 lg:items-center">
						<div className="lg:col-span-6">
							<H1>{detail.title}</H1>
							<p className="mt-6 max-w-[54ch] text-foreground text-lg leading-[1.6]">
								{detail.description}
							</p>
							<ActionLink
								arrow
								className="mt-8"
								href={{
									pathname: "/book",
									query: { topic: groupTopics[offering.group] },
								}}
								location="service_detail"
							>
								{th("hero.cta")}
							</ActionLink>
							<dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5">
								{detail.summaryItems.map((item) => (
									<div key={item.label}>
										<dt className="text-muted-foreground text-sm">
											{item.label}
										</dt>
										<dd className="mt-1 text-base text-foreground">
											{item.value}
										</dd>
									</div>
								))}
							</dl>
						</div>

						{/* The proof project, as its live scene in a frame */}
						{proofCaseStudy && (
							<Link
								className="group/arrow block outline-none lg:col-span-6"
								href={{
									pathname: "/case-studies/[slug]",
									params: { slug: proofCaseStudy.slug },
								}}
							>
								<div className="rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] ring-ring/70 ring-offset-4 ring-offset-background group-focus-visible/arrow:ring-2 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
									<div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
										{hasProjectScene(proofCaseStudy.slug) && !proof.still ? (
											<ProjectScene
												opening={
													proofCaseStudy.cardImage ??
													proofCaseStudy.coverImage ??
													proof.image
												}
												sizes="(min-width: 1024px) 620px, 100vw"
												slug={proofCaseStudy.slug}
											/>
										) : (
											<Image
												alt={`${proofCaseStudy.client}: ${proofCaseStudy.title}`}
												className={cn(
													"object-cover object-left-top",
													proof.imageClassName
												)}
												fill
												priority
												quality={90}
												sizes="(min-width: 1024px) 620px, 100vw"
												src={proof.image}
											/>
										)}
									</div>
								</div>
								<div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-1 px-2 text-base">
									<span className="text-foreground">
										{td(
											proofCaseStudy.kind === "concept"
												? "conceptStudyLabel"
												: "recentProjectLabel",
											{ client: proofCaseStudy.client }
										)}
									</span>
									<span className="inline-flex items-center gap-1.5 font-medium text-foreground">
										{td("proofCta")}
										<ActionArrow />
									</span>
								</div>
							</Link>
						)}
					</div>
				</GridContainer>
			</section>

			<SectionWrapper id="why" surface="alternate">
				{detail.painPoints.length > 0 && (
					<>
						<H2>{td("fitTitle")}</H2>
						<StaggerChildren className="mt-10 grid gap-x-10 gap-y-10 md:mt-14 md:grid-cols-3 lg:gap-x-14">
							{detail.painPoints.map((item) => (
								<div key={item.heading}>
									<H3>{item.heading}</H3>
									<p className="mt-2.5 text-base text-foreground/75 leading-[1.6]">
										{item.description}
									</p>
								</div>
							))}
						</StaggerChildren>
					</>
				)}
				{detail.outcomeItems.length > 0 && (
					<div
						className={cn(
							"grid gap-x-6 gap-y-10 lg:grid-cols-12",
							detail.painPoints.length > 0 && "mt-16 md:mt-24"
						)}
					>
						<H2 className="lg:col-span-4">{td("changeTitle")}</H2>
						<StaggerChildren className="lg:col-span-7 lg:col-start-6">
							<ol className="border-foreground/[0.08] border-t">
								{detail.outcomeItems.map((item, index) => (
									<li
										className="flex gap-5 border-foreground/[0.08] border-b py-4 text-foreground text-lg leading-[1.6]"
										key={item}
									>
										<span
											aria-hidden="true"
											className="w-6 shrink-0 text-muted-foreground text-sm tabular-nums leading-[1.95]"
										>
											{String(index + 1).padStart(2, "0")}
										</span>
										{item}
									</li>
								))}
							</ol>
						</StaggerChildren>
					</div>
				)}
			</SectionWrapper>

			<SectionWrapper id="approach">
				<StaggerChildren className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<H2>{td("approachTitle")}</H2>
						<p className="mt-5 text-foreground text-lg leading-[1.6]">
							{detail.approach}
						</p>
					</div>
					<div className="lg:col-span-5 lg:col-start-7">
						<H2>{td("outcomeTitle")}</H2>
						<p className="mt-5 text-foreground text-lg leading-[1.6]">
							{detail.outcome}
						</p>
					</div>
				</StaggerChildren>
				{/* Two real screens of the project that backs this page */}
				{proofCaseStudy && proofShots.length > 0 && (
					<Link
						className="group/arrow mt-12 block outline-none md:mt-16"
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: proofCaseStudy.slug },
						}}
					>
						<span className="grid gap-5 md:grid-cols-2">
							{proofShots.map((shot) => (
								<span
									className="block rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
									key={shot}
								>
									<span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
										<Image
											alt={`${proofCaseStudy.client}: ${proofCaseStudy.title}`}
											className="object-cover object-left-top"
											fill
											sizes="(min-width: 768px) 50vw, 100vw"
											src={shot}
										/>
									</span>
								</span>
							))}
						</span>
						<span className="mt-4 inline-flex items-center gap-1.5 text-base text-foreground group-focus-visible/arrow:underline group-focus-visible/arrow:underline-offset-4">
							{proofCaseStudy.client}
							<span className="text-muted-foreground">{th("stage.link")}</span>
							<ActionArrow />
						</span>
					</Link>
				)}
			</SectionWrapper>

			<SectionWrapper id="features" surface="alternate">
				<H2>{td("includedTitle")}</H2>
				<StaggerChildren className="mt-10 md:mt-14">
					<div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:gap-x-14">
						<div>
							<H3>{td("featuresTitle")}</H3>
							<ul className="mt-5 border-foreground/[0.08] border-t">
								{detail.featureItems.map((item) => (
									<li
										className="border-foreground/[0.08] border-b py-3.5 text-base text-foreground leading-[1.6]"
										key={item}
									>
										{item}
									</li>
								))}
							</ul>
						</div>
						<div id="deliverables">
							<H3>{td("deliverablesTitle")}</H3>
							<ul className="mt-5 border-foreground/[0.08] border-t">
								{detail.deliverableItems.map((item) => (
									<li
										className="border-foreground/[0.08] border-b py-3.5 text-base text-foreground leading-[1.6]"
										key={item}
									>
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</StaggerChildren>
			</SectionWrapper>

			{deck && (
				<SectionWrapper id="service-deck">
					<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-center">
						<div className="lg:col-span-5">
							<H2>{tg("sectionTitle")}</H2>
							<p className="mt-5 max-w-[48ch] text-foreground text-lg leading-[1.6]">
								{tg("description")}
							</p>
						</div>
						<ReportDownloadForm
							buttonLabel={tg("formButton")}
							className="my-0 lg:col-span-6 lg:col-start-7"
							description={tg("formDescription")}
							reportId={deck.reportId}
							title={tg("formTitle")}
						/>
					</div>
				</SectionWrapper>
			)}

			{detail.faqItems.length > 0 && (
				<SectionWrapper id="faq" surface={deck ? "alternate" : "default"}>
					<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
						<div className="lg:col-span-4">
							<H2 className="lg:sticky lg:top-28">{td("faqTitle")}</H2>
						</div>
						<StaggerChildren className="lg:col-span-7 lg:col-start-6">
							<FaqList items={detail.faqItems} />
						</StaggerChildren>
					</div>
				</SectionWrapper>
			)}

			{relatedWork.length > 0 && (
				<SectionWrapper
					id="related-work"
					surface={deck ? "default" : "alternate"}
				>
					<H2>{td("relatedWorkTitle")}</H2>
					<StaggerChildren className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
						{relatedWork.map((caseStudy) => (
							<CaseStudyCard caseStudy={caseStudy} key={caseStudy.slug} />
						))}
					</StaggerChildren>
				</SectionWrapper>
			)}

			{relatedOfferings.length > 0 && (
				<SectionWrapper
					id="related-offerings"
					surface={deck ? "alternate" : "default"}
				>
					<H2>{td("relatedOfferingsTitle")}</H2>
					<ul className="mt-8 md:mt-12">
						{relatedOfferings.map((related) => (
							<li key={related.slug}>
								<Link
									className="group/arrow -mx-4 grid gap-x-6 gap-y-1 rounded-[10px] px-4 py-5 outline-none transition-colors duration-150 hover:bg-card focus-visible:bg-card md:grid-cols-12 md:items-baseline md:py-6"
									href={{
										pathname: "/services/[slug]",
										params: { slug: related.slug },
									}}
								>
									<h3 className="font-display text-foreground text-lg leading-snug md:col-span-4">
										{offeringTitle(related, t, tc)}
									</h3>
									<span className="text-base text-foreground/75 leading-[1.6] md:col-span-7">
										{offeringTagline(related, t, tc)}
									</span>
									<span className="hidden text-foreground md:col-span-1 md:flex md:justify-end">
										<ActionArrow />
									</span>
								</Link>
							</li>
						))}
					</ul>
				</SectionWrapper>
			)}
		</>
	);
}
