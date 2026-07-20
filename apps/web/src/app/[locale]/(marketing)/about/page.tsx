import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import { OpenAiPartnerBadge } from "@/components/marketing/openai-partner-badge";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { skillIcons } from "@/components/marketing/skill-icons";
import { Button } from "@/components/ui/button";
import {
	Body,
	Caption,
	H1,
	H2,
	H3,
	Lead,
	Muted,
	QuoteMark,
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
// Paragraph rendered as a pull-quote inside the bio column.
const bioPullQuoteIndex = 2;

const connectLinks = [
	{ key: "linkedin" as const, href: "https://linkedin.com/in/sebastiankehle" },
	{ key: "github" as const, href: "https://github.com/sebastiankehle" },
	{ key: "twitter" as const, href: "https://x.com/sebastiankehle" },
	{ key: "email" as const, href: "mailto:sebastian.kehle@webvise.io" },
	{ key: "personal" as const, href: "https://sebastiankehle.com" },
];

// Mirrors sebastiankehle.com/skills — names are not translated.
const stackSections = [
	{
		key: "languages" as const,
		skills: [
			{ name: "JavaScript", icon: "javascript" },
			{ name: "TypeScript", icon: "typescript" },
			{ name: "HTML", icon: "html" },
			{ name: "CSS", icon: "css" },
			{ name: "SQL", icon: "sql" },
		],
	},
	{
		key: "frameworks" as const,
		skills: [
			{ name: "React", icon: "react" },
			{ name: "Next.js", icon: "nextjs" },
			{ name: "TailwindCSS", icon: "tailwind" },
			{ name: "TanStack Query", icon: "tanstack" },
			{ name: "Express.js", icon: "express" },
			{ name: "Hono", icon: "hono" },
			{ name: "shadcn/ui", icon: "shadcn" },
			{ name: "GSAP", icon: "gsap" },
			{ name: "Motion", icon: "motion" },
			{ name: "Mastra", icon: "mastra" },
		],
	},
	{
		key: "backendData" as const,
		skills: [
			{ name: "PostgreSQL", icon: "postgres" },
			{ name: "Drizzle", icon: "drizzle" },
			{ name: "Prisma", icon: "prisma" },
			{ name: "Neon", icon: "neon" },
			{ name: "Redis", icon: "redis" },
			{ name: "tRPC", icon: "trpc" },
			{ name: "Node.js", icon: "nodejs" },
			{ name: "Supabase", icon: "supabase" },
			{ name: "Better Auth", icon: "betterauth" },
			{ name: "Convex", icon: "convex" },
		],
	},
	{
		key: "infrastructure" as const,
		skills: [
			{ name: "Docker", icon: "docker" },
			{ name: "Vercel", icon: "vercel" },
			{ name: "Cloudflare", icon: "cloudflare" },
			{ name: "GitHub", icon: "github" },
			{ name: "Turborepo", icon: "turborepo" },
			{ name: "Sentry", icon: "sentry" },
			{ name: "PostHog", icon: "posthog" },
			{ name: "Inngest", icon: "inngest" },
			{ name: "Grafana", icon: "grafana" },
		],
	},
	{
		key: "tools" as const,
		skills: [
			{ name: "Cursor", icon: "cursor" },
			{ name: "Figma", icon: "figma" },
			{ name: "Claude", icon: "claude" },
			{ name: "Codex", icon: "codex" },
		],
	},
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
	const tschema = await getTranslations("schema");

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
					"https://x.com/sebastiankehle",
				],
				worksFor: [
					{
						"@type": "Organization",
						name: "webvise",
						url: "https://webvise.io",
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
						name: tschema("home"),
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
									className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
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
							<OpenAiPartnerBadge className="mt-8 w-[93px]" />
						</div>

						{/* Connect card */}
						<div className="surface-card p-6 md:p-7">
							<Caption className="mb-5 block">{t("connect.title")}</Caption>
							<div className="flex flex-wrap gap-2">
								{connectLinks.map(({ key, href }) => (
									<Button
										key={key}
										render={
											<a href={href} rel="noopener noreferrer" target="_blank">
												{t(`connect.${key}`)}
												<ArrowUpRight className="h-3 w-3" />
											</a>
										}
										size="sm"
										variant="outline"
									/>
								))}
							</div>
						</div>
					</div>
				</GridContainer>
			</section>

			{/* Bio */}
			<SectionWrapper id="background" surface="alternate">
				<div className="grid items-start gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
					<div className="max-w-2xl">
						<H2>{t("bio.title")}</H2>
						<div className="mt-8 space-y-5">
							{Array.from({ length: bioCount }, (_, i) => {
								if (i === bioPullQuoteIndex) {
									return null;
								}
								const paragraph = t(`bio.paragraphs.${i}`);
								return (
									<Body className="text-muted-foreground" key={paragraph}>
										{paragraph}
									</Body>
								);
							})}
						</div>
					</div>
					<div className="surface-card w-full max-w-sm self-start p-6 md:justify-self-end md:p-7">
						<QuoteMark className="block" />
						<Muted className="mt-3 text-foreground/85 leading-relaxed">
							{t(`bio.paragraphs.${bioPullQuoteIndex}`)}
						</Muted>
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
					<div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{network.map((member) => {
							const role = t(`network.members.${member.id}.role`);
							const discipline = t(`network.members.${member.id}.discipline`);
							return (
								<div
									className="surface-card group flex gap-4 p-6 md:p-7"
									key={member.id}
								>
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border/60 font-medium text-muted-foreground text-sm">
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
				id="experience"
				surface={
					featureFlags.marketing.aboutNetworkSection ? "alternate" : "default"
				}
			>
				<div className="max-w-3xl">
					<H2>{t("experience.title")}</H2>
					<ol className="surface-card mt-10 divide-y divide-border/60 overflow-hidden">
						{Array.from({ length: experienceCount }, (_, i) => {
							const company = t(`experience.items.${i}.company`);
							const role = t(`experience.items.${i}.role`);
							const period = t(`experience.items.${i}.period`);
							const location = t(`experience.items.${i}.location`);
							const description = t(`experience.items.${i}.description`);

							return (
								<li
									className="grid gap-3 px-6 py-5 md:grid-cols-[180px_1fr] md:gap-8 md:px-7 md:py-6"
									key={`${company}-${role}-${period}`}
								>
									<div className="md:pt-1">
										<Caption className="block tabular-nums">{period}</Caption>
										<Caption className="mt-1 block text-muted-foreground">
											{location}
										</Caption>
									</div>
									<div>
										<Caption className="block text-brand-readable">
											{company}
										</Caption>
										<H3 className="mt-1">{role}</H3>
										<Muted className="mt-2 leading-relaxed">
											{description}
										</Muted>
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</SectionWrapper>

			{/* Skills */}
			<SectionWrapper
				id="skills"
				surface={
					featureFlags.marketing.aboutNetworkSection ? "default" : "alternate"
				}
			>
				<H2>{t("stack.title")}</H2>
				<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{stackSections.map(({ key, skills }) => (
						<div className="surface-card p-6 md:p-7" key={key}>
							<Caption className="mb-4 block text-brand-readable">
								{"<"}
								{t(`stack.sections.${key}.label`)}
								{"/>"}
							</Caption>
							<div className="flex flex-wrap gap-2">
								{skills.map(({ name, icon }) => (
									<MarketingTag
										className="gap-1.5"
										key={name}
										variant="neutral"
									>
										<span
											aria-hidden="true"
											className="h-3.5 w-3.5 shrink-0 [&_svg]:h-full [&_svg]:w-full [.mono-dark_&]:grayscale [.mono-light_&]:grayscale"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time SVG markup
											dangerouslySetInnerHTML={{ __html: skillIcons[icon] }}
										/>
										{name}
									</MarketingTag>
								))}
							</div>
						</div>
					))}
				</div>
			</SectionWrapper>
		</>
	);
}
