import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
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
import BecomePartner from "@/components/marketing/sections/become-partner";
import { skillIcons } from "@/components/marketing/skill-icons";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
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

// Independent partners in Sebastian's network.
// `role` and `article` are translated; names are not.
const network: {
	id: "alexander" | "felix" | "lennart";
	name: string;
	image: string;
	linkedin: string;
	website?: string;
}[] = [
	{
		id: "alexander",
		name: "Alexander Friebe",
		image: "/images/network/alexander.jpeg",
		linkedin: "https://www.linkedin.com/in/alexander-friebe-35a197184/",
	},
	{
		id: "felix",
		name: "Felix von Rautenberg",
		image: "/images/network/felix.jpeg",
		linkedin: "https://www.linkedin.com/in/felix-von-rautenberg-259a05246/",
	},
	{
		id: "lennart",
		name: "Lennart Brauer",
		image: "/images/network/lennart.jpeg",
		linkedin: "https://www.linkedin.com/in/lennart-brauer0427/",
		website: "https://www.lennartbrauer.com/",
	},
];

export default async function AboutPage() {
	const t = await getTranslations("about");
	const tschema = await getTranslations("schema");

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Person",
				"@id": "https://www.webvise.io/about#person",
				name: t("intro.name"),
				jobTitle: t("intro.role"),
				description: t("intro.description"),
				url: "https://sebastiankehle.com",
				image: "https://www.webvise.io/images/founder.jpeg",
				sameAs: [
					"https://linkedin.com/in/sebastiankehle",
					"https://github.com/sebastiankehle",
					"https://x.com/sebastiankehle",
				],
				worksFor: [
					{
						"@type": "Organization",
						name: "webvise",
						url: "https://www.webvise.io",
					},
				],
			},
			{
				"@type": "BreadcrumbList",
				"@id": "https://www.webvise.io/about#breadcrumb",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: tschema("home"),
						item: "https://www.webvise.io",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("title"),
						item: "https://www.webvise.io/about",
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

			{/* Experience - vertical timeline like personal site */}
			<SectionWrapper id="experience">
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

			{featureFlags.marketing.aboutNetworkSection && (
				<SectionWrapper id="network" surface="alternate">
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
							const article = t(`network.members.${member.id}.article`);
							return (
								<div
									className="surface-card flex flex-col p-6 md:p-7"
									key={member.id}
								>
									<div className="flex items-start gap-4">
										<Image
											alt={member.name}
											className="h-12 w-12 shrink-0 rounded-lg object-cover"
											height={48}
											quality={85}
											src={member.image}
											width={48}
										/>
										<div className="min-w-0 flex-1">
											<Body className="font-medium text-sm">{member.name}</Body>
											<Caption className="mt-0.5 block text-muted-foreground">
												{role}
											</Caption>
										</div>
										<div className="flex shrink-0 gap-1">
											<SocialIconButton
												href={member.linkedin}
												label={`${member.name} — LinkedIn`}
											>
												<svg
													aria-hidden="true"
													className="h-4 w-4"
													fill="currentColor"
													focusable="false"
													viewBox="0 0 24 24"
												>
													<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
												</svg>
											</SocialIconButton>
											{member.website && (
												<SocialIconButton
													href={member.website}
													label={`${member.name} — Website`}
												>
													<LinkIcon aria-hidden="true" className="h-4 w-4" />
												</SocialIconButton>
											)}
										</div>
									</div>
									<Muted className="mt-5 leading-relaxed">{article}</Muted>
								</div>
							);
						})}
					</div>
				</SectionWrapper>
			)}

			{featureFlags.marketing.aboutNetworkSection &&
				featureFlags.marketing.aboutPartnerForm && (
					<BecomePartner surface="inverted" />
				)}

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
