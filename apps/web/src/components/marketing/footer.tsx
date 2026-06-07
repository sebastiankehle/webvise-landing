import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import Logo from "@/components/logo";
import { CookiePreferencesLink } from "@/components/marketing/cookie-preferences-link";
import { MarketingFooterThemeControl } from "@/components/marketing/marketing-chrome";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Caption, Label, Muted, Small } from "@/components/ui/typography";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { Link } from "@/i18n/navigation";

export default async function Footer({ ctaBanner }: { ctaBanner?: ReactNode }) {
	const t = await getTranslations("footer");
	const tb = await getTranslations("blog.newsletter");
	const ts = await getTranslations("services");
	const tw = await getTranslations("wpHealthReport.cta");

	const companyLinks = [
		{ hash: "services", label: t("links.services") },
		{ hash: "benefits", label: t("links.benefits") },
		{ hash: "process", label: t("links.process") },
		{ hash: "pricing", label: t("links.pricing") },
		{ hash: "contact", label: t("links.contact") },
	];

	const year = new Date().getFullYear();

	return (
		<footer className="section-dark">
			{ctaBanner}

			{/* Main footer content */}
			<div className="mx-auto max-w-[1320px] px-6 py-20 md:py-24">
				<div className="grid gap-12 md:grid-cols-12">
					{/* Brand column */}
					<div className="md:col-span-3">
						<Link className="flex items-center gap-2.5" href="/">
							<Logo animated className="h-7 w-7" />
							<Label className="font-display text-foreground text-xl tracking-[-0.02em]">
								webvise
							</Label>
						</Link>
						<Muted className="mt-5 max-w-[260px] leading-[1.6]">
							{t("tagline")}
						</Muted>
						<Small className="mt-1 block text-muted-foreground">
							{t("location")}
						</Small>
						<div className="mt-8 flex items-center gap-3">
							{socials.map((social) => (
								<a
									aria-label={social.name}
									className="flex h-8 w-8 items-center justify-center border border-[--border] text-muted-foreground transition-all hover:border-brand-border hover:text-brand-readable"
									href={social.href}
									key={social.name}
									rel="noopener noreferrer"
									target="_blank"
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Navigation grid */}
					<div className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-9 md:grid-cols-3">
						{/* Company */}
						<div>
							<Caption className="mb-5 block text-muted-foreground">
								{t("sections.company")}
							</Caption>
							<ul className="space-y-3">
								{companyLinks.map(({ hash, label }) => (
									<li key={hash}>
										<Link
											className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
											href={{ pathname: "/", hash }}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Services */}
						<div>
							<Caption className="mb-5 block text-muted-foreground">
								{t("sections.services")}
							</Caption>
							<ul className="space-y-3">
								{services.map(({ slug, translationKey }) => (
									<li key={slug}>
										<Link
											className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
											href={{ pathname: "/services/[slug]", params: { slug } }}
										>
											{ts(`${translationKey}.title`)}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Contact */}
						<div>
							<Caption className="mb-5 block text-muted-foreground">
								{t("sections.contact")}
							</Caption>
							<ul className="space-y-3 text-sm">
								<li>
									<a
										className="text-muted-foreground transition-colors hover:text-[--foreground]"
										href={`mailto:${t("address.email")}`}
									>
										{t("address.email")}
									</a>
								</li>
								<li className="text-muted-foreground">{t("address.street")}</li>
								<li className="text-muted-foreground">{t("address.city")}</li>
								<li className="text-muted-foreground">{t("address.hours")}</li>
							</ul>
						</div>

						{/* Explore */}
						<div>
							<Caption className="mb-5 block text-muted-foreground">
								{t("sections.explore")}
							</Caption>
							<ul className="space-y-3">
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
										href="/about"
									>
										{t("links.about")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
										href="/blog"
									>
										{t("links.blog")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
										href="/case-studies"
									>
										{t("links.caseStudies")}
									</Link>
								</li>
							</ul>
						</div>

						{/* Resources */}
						<div>
							<Caption className="mb-5 block text-muted-foreground">
								{t("sections.resources")}
							</Caption>
							<ul className="space-y-3">
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
										href="/media"
									>
										{t("links.media")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-[--foreground]"
										href="/wp-health-report"
									>
										{tw("button")}
									</Link>
								</li>
							</ul>
						</div>

						{/* Newsletter */}
						<div>
							<Caption className="mb-5 block text-brand-readable">
								{tb("divider")}
							</Caption>
							<NewsletterForm
								buttonLabel={tb("button")}
								error={tb("error")}
								placeholder={tb("placeholder")}
								success={tb("success")}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="relative border-[--border] border-t">
				<div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
					<Caption className="text-muted-foreground">
						{t("legal.copyright", { year })}
					</Caption>
					<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
						<MarketingFooterThemeControl />
						<div className="flex gap-6 text-muted-foreground text-xs">
							<Link
								className="transition-colors hover:text-[--foreground]"
								href="/privacy"
							>
								{t("legal.privacy")}
							</Link>
							<Link
								className="transition-colors hover:text-[--foreground]"
								href="/terms"
							>
								{t("legal.terms")}
							</Link>
							<Link
								className="transition-colors hover:text-[--foreground]"
								href="/imprint"
							>
								{t("legal.imprint")}
							</Link>
							<CookiePreferencesLink />
						</div>
					</div>
				</div>
			</div>

			{/* Brand accent stripe */}
			<div className="h-px bg-brand" />
		</footer>
	);
}
