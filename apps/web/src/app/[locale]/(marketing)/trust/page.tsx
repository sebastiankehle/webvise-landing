import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Shield, BrainCircuit, ArrowRight } from "lucide-react";

import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("trust"),
		getLocale(),
	]);

	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/trust", locale),
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			siteName: "webvise",
			url: localizedUrl("/trust", locale),
		},
	};
}

export default async function TrustPage() {
	const t = await getTranslations("trust");

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": "https://webvise.io/trust#webpage",
				url: "https://webvise.io/trust",
				name: t("meta.title"),
				description: t("meta.description"),
				isPartOf: { "@id": "https://webvise.io/#website" },
				about: { "@id": "https://webvise.io/#organization" },
			},
			{
				"@type": "BreadcrumbList",
				"@id": "https://webvise.io/trust#breadcrumb",
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
						name: t("hero.title"),
						item: "https://webvise.io/trust",
					},
				],
			},
		],
	};

	const standards = [
		{
			key: "iso27001" as const,
			icon: Shield,
		},
		{
			key: "iso42001" as const,
			icon: BrainCircuit,
		},
	];

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
					<li className="text-foreground">{t("hero.title")}</li>
				</ol>
			</nav>

			{/* Hero */}
			<section className="pb-24 pt-10 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="max-w-2xl">
						<h1 className="font-display text-4xl tracking-tight md:text-5xl">
							{t("hero.title")}
						</h1>
						<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
							{t("hero.subtitle")}
						</p>
					</div>
				</div>
			</section>

			{/* ISO Cards */}
			<SectionWrapper id="standards" alternate>
				<StaggerChildren className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-2">
					{standards.map(({ key, icon: Icon }) => (
						<div
							key={key}
							className="border-border/40 border-t-2 border-t-brand not-last:border-b p-8 md:not-last:border-r md:not-last:border-b-0 md:p-10"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
									<Icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
								</div>
								<div>
									<h2 className="font-display text-lg">
										{t(`${key}.title`)}
									</h2>
									<p className="text-brand text-xs">{t(`${key}.label`)}</p>
								</div>
							</div>
							<ul className="mt-6 space-y-3">
								{Array.from({ length: 4 }, (_, i) => (
									<li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
										<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
										<span>{t(`${key}.items.${i}`)}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</StaggerChildren>

				<p className="mt-10 text-sm text-muted-foreground">
					{t("roadmap")}
				</p>
			</SectionWrapper>

			{/* Article link + CTA */}
			<section className="border-border/40 border-t pb-28 pt-20">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid gap-10 md:grid-cols-2">
						<div>
							<Link
								href={{ pathname: "/blog/[slug]", params: { slug: "ai-regulations-certifications-europe" } }}
								className="group flex items-start gap-4 border border-border/40 p-6 transition-colors hover:border-brand/30"
							>
								<BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} />
								<div>
									<p className="text-sm font-medium transition-colors group-hover:text-brand">
										{t("articleLink")}
									</p>
									<p className="mt-1 flex items-center gap-1 text-brand text-xs">
										<ArrowRight className="h-3 w-3" />
									</p>
								</div>
							</Link>
						</div>
						<div className="border border-border/40 p-6">
							<h2 className="font-display text-lg">{t("cta.title")}</h2>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								{t("cta.description")}
							</p>
							<Button
								size="lg"
								className="mt-6 border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
								render={<Link href={{ pathname: "/", hash: "contact" }} />}
							>
								{t("cta.button")}
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
