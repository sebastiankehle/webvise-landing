import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("about"),
		getLocale(),
	]);

	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/about", locale),
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
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

			{/* Breadcrumb */}
			<nav
				aria-label="Breadcrumb"
				className="mx-auto max-w-[1320px] px-6 pt-24 md:pt-36"
			>
				<ol className="flex items-center gap-2 text-sm text-muted-foreground">
					<li>
						<Link
							href="/"
							className="transition-colors hover:text-foreground"
						>
							Home
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li className="text-foreground">{t("title")}</li>
				</ol>
			</nav>

			{/* Header */}
			<section className="pb-24 pt-10 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + intro */}
						<div className="md:col-span-2">
							<div className="flex items-center gap-5">
								<Image
									src="/images/founder.jpeg"
									alt={t("intro.name")}
									width={80}
									height={80}
									className="h-20 w-20 shrink-0 object-cover"
									quality={85}
									priority
								/>
								<div>
									<span className="font-[510] text-brand text-xs tracking-[-0.011em]">
										{t("intro.role")}
									</span>
									<h1 className="mt-1 font-display text-[40px] leading-[1.1] md:text-[56px]">
										{t("intro.name")}
									</h1>
								</div>
							</div>
							<p className="mt-6 text-[17px] text-muted-foreground leading-[1.5]">
								{t("intro.tagline")}
							</p>

							{/* Description bar */}
							<div className="mt-10 border-border/40 border-t pt-6">
								<p className="max-w-lg text-sm text-muted-foreground leading-[1.5]">
									{t("intro.description")}
								</p>
							</div>
						</div>

						{/* Connect card */}
						<div className="border border-border/40 p-6 md:p-8">
							<p className="mb-5 text-muted-foreground/50 text-xs tracking-[-0.011em]">
								{t("connect.title")}
							</p>
							<div className="flex flex-wrap gap-2">
								{connectLinks.map(({ key, href }) => (
									<a
										key={key}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex items-center gap-1.5 border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
									>
										{t(`connect.${key}`)}
										<ArrowUpRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-white" />
									</a>
								))}
							</div>
						</div>
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

			{/* Bio */}
			<SectionWrapper id="background" alternate>
				<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
					<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
						{t("bio.title")}
					</h2>
					<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
						{t("bio.subtitle")}
					</p>
				</div>
				<div className="mt-14 max-w-2xl">
					<div className="space-y-5 text-muted-foreground leading-[1.5]">
						{Array.from({ length: bioCount }, (_, i) => (
							<p key={i}>{t(`bio.paragraphs.${i}`)}</p>
						))}
					</div>
				</div>
			</SectionWrapper>

			{/* Experience - vertical timeline like personal site */}
			<SectionWrapper id="experience">
				<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
					<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
						{t("experience.title")}
					</h2>
					<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
						{t("experience.subtitle")}
					</p>
				</div>
				<div className="mt-14 max-w-2xl">
					<div className="space-y-10">
						{Array.from({ length: experienceCount }, (_, i) => (
							<div key={i} className="flex gap-6">
								<div className="flex w-1 shrink-0 flex-col items-center pt-2">
									<div className="h-2 w-2 bg-brand" />
									{i < experienceCount - 1 && (
										<div className="mt-1 w-px flex-1 bg-border/40" />
									)}
								</div>
								<div className="flex-1 pb-2">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="text-sm font-medium">
												{t(`experience.items.${i}.company`)}
											</p>
											<h3 className="mt-0.5 font-display text-[16px] leading-[21px] tracking-[-0.011em]">
												{t(`experience.items.${i}.role`)}
											</h3>
										</div>
										<div className="shrink-0 text-right">
											<p className="text-xs text-muted-foreground tracking-[-0.011em]">
												{t(`experience.items.${i}.period`)}
											</p>
											<p className="text-xs text-muted-foreground/60 tracking-[-0.011em]">
												{t(`experience.items.${i}.location`)}
											</p>
										</div>
									</div>
									<p className="mt-3 text-sm text-muted-foreground leading-[1.5]">
										{t(`experience.items.${i}.description`)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</SectionWrapper>

			{/* Skills */}
			<SectionWrapper id="skills" alternate>
				<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
					<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
						{t("stack.title")}
					</h2>
					<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
						{t("stack.subtitle")}
					</p>
				</div>
				<div className="mt-14 max-w-2xl">
					<div className="space-y-8">
						{(["languages", "frontend", "backend", "data", "ai", "platform"] as const).map((section) => (
							<div key={section}>
								<p className="mb-3 text-xs text-muted-foreground/50 tracking-[-0.011em]">
									{t(`stack.sections.${section}.label`)}
								</p>
								<div className="flex flex-wrap gap-2">
									{t(`stack.sections.${section}.items`)
										.split(", ")
										.map((tool) => (
											<span
												key={tool}
												className="border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
											>
												{tool}
											</span>
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
