import { ArrowUpRight, Link as LinkIcon, Plus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import JsonLd from "@/components/json-ld";
import { ActionArrow } from "@/components/marketing/action";
import { OpenAiPartnerBadge } from "@/components/marketing/openai-partner-badge";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import BecomePartner from "@/components/marketing/sections/become-partner";
import { skillIcons } from "@/components/marketing/skill-icons";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import StaggerChildren from "@/components/marketing/stagger-children";
import WorkWall from "@/components/marketing/work-wall";
import { Caption, H1, H2, H3 } from "@/components/ui/typography";
import { getCaseStudies } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { featureFlags } from "@/lib/feature-flags";
import { generateAlternates, localizedUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
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

const bioCount = 6;

// Start and end of each station as year fractions, in the order of
// about.experience.items. A station without an end runs today.
const careerSpans: [start: number, end?: number][] = [
	[2016.58],
	[2025.42],
	[2022.58, 2025.42],
	[2021.75, 2022.58],
	[2017.58, 2021.75],
	[2016.58, 2021.75],
	[2013.75, 2017.58],
];
const careerStart = 2013;

// The approved numbers, worded once in metrics.results.
const facts = ["projects", "weeks", "raised", "users"] as const;

const connectLinks = [
	{ key: "linkedin" as const, href: "https://linkedin.com/in/sebastiankehle" },
	{ key: "github" as const, href: "https://github.com/sebastiankehle" },
	{ key: "twitter" as const, href: "https://x.com/sebastiankehle" },
	{ key: "email" as const, href: "mailto:sebastian.kehle@webvise.io" },
	{ key: "personal" as const, href: "https://sebastiankehle.com" },
];

// Mirrors sebastiankehle.com/skills — names are not translated. The two long
// lists share the first row, the three short ones the second.
const stackSections = [
	{
		key: "frameworks" as const,
		wide: true,
		skills: [
			{ name: "React", icon: "react" },
			{ name: "Next.js", icon: "nextjs" },
			{ name: "Tailwind CSS", icon: "tailwind" },
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
		wide: true,
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

export default async function AboutPage({ params }: { params: LocaleParams }) {
	const locale = await pinLocale(params);
	const t = await getTranslations("about");
	const [tcs, tn, tm] = await Promise.all([
		getTranslations("caseStudies"),
		getTranslations("nav"),
		getTranslations("metrics"),
	]);
	const work = getCaseStudies(locale, { kind: "client" }).slice(0, 6);
	const tschema = await getTranslations("schema");

	// The ruler runs from the first year to the end of this one.
	const now = new Date();
	const today = now.getFullYear() + now.getMonth() / 12;
	const careerYears = now.getFullYear() + 1 - careerStart;
	const share = (year: number) => ((year - careerStart) / careerYears) * 100;
	const ticks = Array.from(
		{ length: Math.floor(careerYears / 2) },
		(_, i) => careerStart + 1 + i * 2
	);

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
				"@id": `${localizedUrl("/about", locale)}#breadcrumb`,
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
						name: t("title"),
						item: localizedUrl("/about", locale),
					},
				],
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible grid gap-x-6 gap-y-10 lg:grid-cols-12">
						<div className="lg:col-span-8">
							<H1>
								<span className="mb-5 block font-sans text-base text-muted-foreground leading-normal tracking-normal">
									<span className="text-foreground">{t("intro.name")}</span>
									{", "}
									{t("intro.role")}
								</span>
								{t("intro.statement")}
							</H1>
							<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
								{t("intro.lead")}
							</p>
							<ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
								{connectLinks.map(({ key, href }) => (
									<li key={key}>
										<a
											className="group/arrow inline-flex items-center gap-1 text-base text-foreground underline decoration-foreground/25 underline-offset-4 outline-none transition-colors duration-150 hover:decoration-foreground focus-visible:decoration-foreground"
											href={href}
											rel="noopener noreferrer"
											target="_blank"
										>
											{t(`connect.${key}`)}
											<ArrowUpRight
												aria-hidden="true"
												className="size-3.5 text-foreground/50 transition-colors duration-150 group-hover/arrow:text-foreground"
											/>
										</a>
									</li>
								))}
							</ul>
						</div>
						<div className="lg:col-span-3 lg:col-start-10">
							<div className="max-w-[300px] rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] lg:ml-auto dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
								<div className="relative aspect-square overflow-hidden rounded-[14px]">
									<Image
										alt={t("intro.name")}
										className="object-cover"
										fill
										priority
										quality={95}
										sizes="284px"
										src="/images/founder.jpeg"
									/>
								</div>
							</div>
							<div className="mt-6 flex max-w-[300px] lg:ml-auto">
								<OpenAiPartnerBadge className="w-[124px]" />
							</div>
						</div>
					</div>

					{/* The work so far, in the four approved numbers */}
					<dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-foreground/[0.08] border-y py-7 md:mt-14 md:grid-cols-4">
						{facts.map((key) => (
							<div className="flex flex-col-reverse justify-end" key={key}>
								<dt className="mt-2.5 text-muted-foreground text-sm leading-5">
									{tm(`results.items.${key}.label`)}
								</dt>
								<dd className="font-display text-3xl text-foreground leading-none md:text-4xl">
									{tm(`results.items.${key}.value`)}
								</dd>
							</div>
						))}
					</dl>
				</GridContainer>
			</section>

			<SectionWrapper id="background" surface="alternate">
				<div className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
					<H2 className="lg:col-span-4">{t("bio.title")}</H2>
					<StaggerChildren className="lg:col-span-8">
						{/* The first paragraph leads; the rest reads in two columns */}
						<p className="max-w-[62ch] text-foreground text-lg leading-[1.6]">
							{t("bio.paragraphs.0")}
						</p>
						<div className="mt-8 gap-x-10 md:columns-2">
							{Array.from({ length: bioCount - 1 }, (_, i) => {
								const paragraph = t(`bio.paragraphs.${i + 1}`);
								return (
									<p
										className="mb-5 break-inside-avoid text-base text-foreground/80 leading-[1.6]"
										key={paragraph}
									>
										{paragraph}
									</p>
								);
							})}
						</div>
					</StaggerChildren>
				</div>
			</SectionWrapper>

			<SectionWrapper id="experience">
				<H2>{t("experience.title")}</H2>
				{/* Each station is a row on one year ruler; its text opens on demand */}
				<StaggerChildren className="career relative isolate mt-10 md:mt-14">
					<div
						aria-hidden="true"
						className="hidden pb-3 lg:grid lg:grid-cols-12 lg:gap-x-6"
					>
						<div className="relative col-span-6 col-start-6 h-4">
							{ticks.map((year) => (
								<span
									className="absolute top-0 -translate-x-1/2 text-muted-foreground text-xs tabular-nums"
									key={year}
									style={{ left: `${share(year)}%` }}
								>
									{year}
								</span>
							))}
						</div>
					</div>
					{careerSpans.map(([start, end], i) => {
						const company = t(`experience.items.${i}.company`);
						const role = t(`experience.items.${i}.role`);
						const period = t(`experience.items.${i}.period`);
						const location = t(`experience.items.${i}.location`);

						return (
							<details
								className="group/q border-foreground/[0.08] border-b first-of-type:border-t"
								key={`${company}-${role}-${period}`}
								open={i === 0 || undefined}
							>
								<summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-6 outline-none focus-visible:bg-foreground/[0.04] lg:grid-cols-12 [&::-webkit-details-marker]:hidden">
									<div className="pt-5 pb-3 lg:col-span-5 lg:py-5">
										<H3>
											{role}, {company}
										</H3>
										<p className="mt-1 text-muted-foreground text-sm tabular-nums">
											{period}, {location}
										</p>
									</div>
									<Plus
										aria-hidden="true"
										className="size-4 flex-none text-foreground/45 transition-transform duration-200 group-open/q:rotate-45 lg:order-last lg:justify-self-end"
									/>
									<div className="relative col-span-2 mb-5 h-2 lg:col-span-6 lg:mb-0 lg:h-auto lg:self-stretch">
										<span className="absolute inset-x-0 inset-y-0 my-auto h-px bg-foreground/[0.08] lg:hidden" />
										<span
											className={cn(
												"career-bar absolute inset-y-0 my-auto h-2 rounded-full",
												end ? "bg-foreground/70" : "bg-brand"
											)}
											style={
												{
													left: `${share(start)}%`,
													width: `${share(end ?? today) - share(start)}%`,
													"--row": i,
												} as CSSProperties
											}
										/>
									</div>
								</summary>
								<p className="max-w-[62ch] pb-6 text-base text-foreground/80 leading-[1.6] lg:w-5/12 lg:pr-6">
									{t(`experience.items.${i}.description`)}
								</p>
							</details>
						);
					})}
					{/* The year lines, drawn once behind all rows */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 top-7 bottom-0 -z-10 hidden lg:grid lg:grid-cols-12 lg:gap-x-6"
					>
						<div
							className="career-track col-span-6 col-start-6"
							style={{ "--career-years": careerYears } as CSSProperties}
						/>
					</div>
				</StaggerChildren>
			</SectionWrapper>

			{featureFlags.marketing.aboutNetworkSection && (
				<SectionWrapper id="network" surface="alternate">
					<div className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
						<H2 className="lg:col-span-4">{t("network.title")}</H2>
						<p className="max-w-[62ch] text-foreground text-lg leading-[1.6] lg:col-span-7 lg:col-start-6">
							{t("network.lead")}
						</p>
					</div>
					<StaggerChildren className="mt-12 grid gap-x-10 gap-y-12 md:mt-16 md:grid-cols-3 lg:gap-x-14">
						{network.map((member) => {
							const role = t(`network.members.${member.id}.role`);
							const article = t(`network.members.${member.id}.article`);
							return (
								<div key={member.id}>
									<div className="flex items-center gap-3">
										<Image
											alt=""
											className="size-12 shrink-0 rounded-full object-cover"
											height={48}
											quality={90}
											src={member.image}
											width={48}
										/>
										<div className="min-w-0 flex-1">
											<H3>{member.name}</H3>
											<p className="text-muted-foreground text-sm">{role}</p>
										</div>
										<div className="flex shrink-0">
											<SocialIconButton
												href={member.linkedin}
												label={`${member.name}, LinkedIn`}
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
													label={`${member.name}, Website`}
												>
													<LinkIcon aria-hidden="true" className="h-4 w-4" />
												</SocialIconButton>
											)}
										</div>
									</div>
									<p className="mt-4 text-base text-foreground/80 leading-[1.6]">
										{article}
									</p>
								</div>
							);
						})}
					</StaggerChildren>
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
				<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
					{stackSections.map(({ key, wide, skills }) => (
						<div
							className={cn(
								"surface-card p-6 last:sm:col-span-2 md:p-7",
								wide ? "lg:col-span-3" : "lg:col-span-2"
							)}
							key={key}
						>
							<Caption className="mb-4 block text-brand-readable">
								{"<"}
								{t(`stack.sections.${key}.label`)}
								{"/>"}
							</Caption>
							<div className="flex flex-wrap gap-2">
								{skills.map(({ name, icon }) => (
									<span
										className="inline-flex h-8 items-center gap-2 rounded-full pr-3 pl-2.5 text-foreground text-sm shadow-[inset_0_0_0_1px_rgba(14,18,23,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
										key={name}
									>
										<span
											aria-hidden="true"
											className="size-4 shrink-0 [&_svg]:h-full [&_svg]:w-full"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time SVG markup
											dangerouslySetInnerHTML={{ __html: skillIcons[icon] }}
										/>
										{name}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</SectionWrapper>

			{/* The page is about a person; the work is the proof. */}
			<SectionWrapper hatch id="work" surface="inverted">
				<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
					<H2>{tcs("title")}</H2>
					<Link
						className="group/arrow inline-flex items-center gap-1.5 text-base text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
						href="/case-studies"
					>
						{tn("menuAllWork")}
						<ActionArrow />
					</Link>
				</div>
				<div className="mt-10 md:mt-14">
					<WorkWall projects={work} />
				</div>
			</SectionWrapper>
		</>
	);
}
