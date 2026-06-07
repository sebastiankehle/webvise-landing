import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import {
	Body,
	Caption,
	H1,
	H2,
	H3,
	Label,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { featureFlags } from "@/lib/feature-flags";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("about"),
		getLocale(),
	]);

	return {
		title: t("meta.title"),
		description: t(
			featureFlags.marketing.aboutNetworkSection
				? "meta.networkDescription"
				: "meta.description"
		),
		alternates: generateAlternates("/about", locale),
		openGraph: {
			title: t("meta.title"),
			description: t(
				featureFlags.marketing.aboutNetworkSection
					? "meta.networkDescription"
					: "meta.description"
			),
			siteName: "webvise",
			url: localizedUrl("/about", locale),
		},
	};
}

const experienceCount = 7;
const bioCount = 6;

const connectLinks = [
	{ key: "linkedin" as const, href: "https://linkedin.com/in/sebastiankehle" },
	{ key: "github" as const, href: "https://github.com/sebastiankehle" },
	{ key: "twitter" as const, href: "https://x.com/sebastiankehle_" },
	{ key: "email" as const, href: "mailto:sebastian.kehle@webvise.io" },
	{ key: "personal" as const, href: "https://sebastiankehle.com" },
];

// Independent specialists in Sebastian's network.
// `role` and `discipline` are translated; names are not.
const network = [
	{ id: "lisa", name: "Lisa Kehle", initials: "LK" },
	{ id: "felix", name: "Felix von Rautenberg", initials: "FR" },
	{ id: "alexander", name: "Alexander Friebe", initials: "AF" },
	{ id: "haidar", name: "Haidar Hammoud", initials: "HH" },
	{ id: "lennart", name: "Lennart Brauer", initials: "LB" },
	{ id: "jen", name: "Jen Krause", initials: "JK" },
	{ id: "thomas", name: "Thomas Hottewitzsch", initials: "TH" },
	{ id: "tim", name: "Tim Kehle", initials: "TK" },
	{ id: "sandra", name: "Sandra Voß", initials: "SV" },
] as const;

export default async function AboutPage() {
	const t = await getTranslations("about");

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Person",
				"@id": "https://webvise.io/about#person",
				name: t("intro.name"),
				jobTitle: t("intro.role"),
				description: t("intro.description"),
				url: "https://sebastiankehle.com",
				image: "https://webvise.io/images/founder.jpeg",
				sameAs: [
					"https://linkedin.com/in/sebastiankehle",
					"https://github.com/sebastiankehle",
					"https://x.com/sebastiankehle_",
				],
				worksFor: [
					{
						"@type": "Organization",
						name: "webvise",
						url: "https://webvise.io",
					},
					{
						"@type": "Organization",
						name: "luca",
						url: "https://luca-app.de",
					},
				],
			},
			{
				"@type": "BreadcrumbList",
				"@id": "https://webvise.io/about#breadcrumb",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: "https://webvise.io",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("title"),
						item: "https://webvise.io/about",
					},
				],
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			{/* Header */}
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + intro */}
						<div className="md:col-span-2">
							<div className="flex items-center gap-5">
								<Image
									alt={t("intro.name")}
									className="h-[72px] w-[72px] shrink-0 object-cover"
									height={72}
									priority
									quality={85}
									src="/images/founder.jpeg"
									width={72}
								/>
								<div>
									<Caption>{t("intro.role")}</Caption>
									<H1 className="mt-1">{t("intro.name")}</H1>
								</div>
							</div>
							<Lead className="mt-6">{t("intro.tagline")}</Lead>
							<Lead className="mt-3">{t("intro.description")}</Lead>
						</div>

						{/* Connect card */}
						<div className="border border-border/40 p-6 md:p-8">
							<Caption className="mb-5 block">{t("connect.title")}</Caption>
							<div className="flex flex-wrap gap-2">
								{connectLinks.map(({ key, href }) => (
									<a
										className="group flex items-center gap-1.5 border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-brand-foreground"
										href={href}
										key={key}
										rel="noopener noreferrer"
										target="_blank"
									>
										{t(`connect.${key}`)}
										<ArrowUpRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-brand-foreground" />
									</a>
								))}
							</div>
						</div>
					</div>
				</GridContainer>
			</section>

			{/* Bio */}
			<SectionWrapper alternate id="background">
				<div className="max-w-2xl">
					<H2>{t("bio.title")}</H2>
					<div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
						{Array.from({ length: bioCount }, (_, i) => {
							const paragraph = t(`bio.paragraphs.${i}`);
							return (
								<Body className="text-muted-foreground" key={paragraph}>
									{paragraph}
								</Body>
							);
						})}
					</div>
				</div>
			</SectionWrapper>

			{featureFlags.marketing.aboutNetworkSection && (
				<SectionWrapper id="network">
					<div className="grid gap-8 md:grid-cols-3 md:gap-16">
						<div className="md:col-span-1">
							<H2>{t("network.title")}</H2>
						</div>
						<div className="md:col-span-2">
							<Lead>{t("network.lead")}</Lead>
						</div>
					</div>
					<div className="mt-14 grid gap-px overflow-hidden border border-grid-line bg-grid-line sm:grid-cols-2 lg:grid-cols-3">
						{network.map((member) => {
							const role = t(`network.members.${member.id}.role`);
							const discipline = t(`network.members.${member.id}.discipline`);
							return (
								<div
									className="group flex gap-4 bg-background p-6 transition-colors duration-300 hover:bg-muted/40 sm:p-8"
									key={member.id}
								>
									<div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border font-medium text-muted-foreground text-sm transition-colors duration-300 group-hover:border-brand group-hover:text-brand">
										{member.initials}
									</div>
									<div className="min-w-0">
										<Body className="font-medium text-sm">{member.name}</Body>
										<Caption className="mt-0.5 block text-muted-foreground">
											{role}
										</Caption>
										<Muted className="mt-3 text-sm">{discipline}</Muted>
									</div>
								</div>
							);
						})}
					</div>
				</SectionWrapper>
			)}

			{/* Experience - vertical timeline like personal site */}
			<SectionWrapper
				alternate={featureFlags.marketing.aboutNetworkSection}
				id="experience"
			>
				<div className="max-w-2xl">
					<H2>{t("experience.title")}</H2>
					<div className="mt-10 space-y-10">
						{Array.from({ length: experienceCount }, (_, i) => {
							const company = t(`experience.items.${i}.company`);
							const role = t(`experience.items.${i}.role`);
							const period = t(`experience.items.${i}.period`);
							const location = t(`experience.items.${i}.location`);
							const description = t(`experience.items.${i}.description`);

							return (
								<div
									className="flex gap-6"
									key={`${company}-${role}-${period}`}
								>
									<div className="flex w-1 shrink-0 flex-col items-center pt-2">
										<div className="h-2 w-2 bg-brand" />
										{i < experienceCount - 1 && (
											<div className="mt-1 w-px flex-1 bg-border/40" />
										)}
									</div>
									<div className="flex-1 pb-2">
										<div className="flex items-start justify-between gap-4">
											<div>
												<Body className="font-medium text-sm">{company}</Body>
												<H3 className="mt-0.5">{role}</H3>
											</div>
											<div className="shrink-0 text-right">
												<Caption className="block">{period}</Caption>
												<Caption className="mt-1 block text-muted-foreground">
													{location}
												</Caption>
											</div>
										</div>
										<Muted className="mt-3 leading-relaxed">
											{description}
										</Muted>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</SectionWrapper>

			{/* Skills */}
			<SectionWrapper
				alternate={!featureFlags.marketing.aboutNetworkSection}
				id="skills"
			>
				<div className="max-w-2xl">
					<H2>{t("stack.title")}</H2>
					<div className="mt-10 space-y-8">
						{(
							[
								"languages",
								"frontend",
								"backend",
								"data",
								"ai",
								"platform",
							] as const
						).map((section) => (
							<div key={section}>
								<Caption className="mb-3 block">
									{t(`stack.sections.${section}.label`)}
								</Caption>
								<div className="flex flex-wrap gap-2">
									{t(`stack.sections.${section}.items`)
										.split(", ")
										.map((tool) => (
											<Label
												className="border border-border/40 px-3 py-1.5 text-foreground text-sm transition-all hover:border-brand hover:bg-brand hover:text-brand-foreground"
												key={tool}
											>
												{tool}
											</Label>
										))}
								</div>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
