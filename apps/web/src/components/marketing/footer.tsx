import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import Logo from "@/components/logo";
import { CookiePreferencesLink } from "@/components/marketing/cookie-preferences-link";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { marketingSurfaceClassName } from "@/components/marketing/section-wrapper";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import { Caption, Label, Muted, Small } from "@/components/ui/typography";
import { socials } from "@/data/socials";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";

export default async function Footer({ ctaBanner }: { ctaBanner?: ReactNode }) {
	const [locale, t, tb, ts, tw] = await Promise.all([
		getLocale(),
		getTranslations("footer"),
		getTranslations("blog.newsletter"),
		getTranslations("services"),
		getTranslations("wpHealthReport.cta"),
	]);

	// `hideOnMobile` links point to sections that are hidden on mobile and have no
	// dedicated page, so we drop them from the mobile footer to avoid dead links.
	const companyLinks: {
		hash: string;
		label: string;
		hideOnMobile?: boolean;
	}[] = [
		{ hash: "services", label: t("links.services") },
		{ hash: "engineer-led", label: t("links.benefits"), hideOnMobile: true },
		{ hash: "process", label: t("links.process"), hideOnMobile: true },
		{ hash: "contact", label: t("links.contact") },
	];
	const serviceLinks = [
		{ hash: "services-launch", label: ts("groups.launch.title") },
		{ hash: "services-operate", label: ts("groups.operate.title") },
		{ hash: "services-automate", label: ts("groups.automate.title") },
	];

	const year = new Date().getFullYear();

	return (
		<footer className={marketingSurfaceClassName("inverted")}>
			{ctaBanner}

			{/* Main footer content */}
			<div className="mx-auto max-w-[1320px] px-6 py-20 md:py-24">
				<div className="grid gap-12 md:grid-cols-12">
					{/* Brand column */}
					<div className="md:col-span-3">
						<Link className="flex items-center gap-2.5" href="/">
							<Logo animated className="h-7 w-7" />
							<Label className="font-display text-foreground text-xl">
								webvise
							</Label>
						</Link>
						<Muted className="mt-5 max-w-[260px] leading-relaxed">
							{t("tagline")}
						</Muted>
						<Small className="mt-1 block text-muted-foreground">
							{t("location")}
						</Small>
						<div className="mt-8 flex items-center gap-3">
							{socials.map((social) => (
								<SocialIconButton
									href={social.href}
									key={social.name}
									label={social.name}
								>
									{social.icon}
								</SocialIconButton>
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
								{companyLinks.map(({ hash, label, hideOnMobile }) => (
									<li
										className={hideOnMobile ? "hidden md:list-item" : undefined}
										key={hash}
									>
										<a
											className="text-muted-foreground text-sm transition-colors hover:text-foreground"
											href={homepageSectionHref(hash, locale)}
										>
											{label}
										</a>
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
								{serviceLinks.map(({ hash, label }) => (
									<li key={hash}>
										<a
											className="text-muted-foreground text-sm transition-colors hover:text-foreground"
											href={homepageSectionHref(hash, locale)}
										>
											{label}
										</a>
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
										className="text-muted-foreground transition-colors hover:text-foreground"
										href={`mailto:${t("address.email")}`}
									>
										{t("address.email")}
									</a>
								</li>
								<li className="text-muted-foreground">{t("address.street")}</li>
								<li className="text-muted-foreground">{t("address.city")}</li>
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
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										href="/about"
									>
										{t("links.about")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										href="/blog"
									>
										{t("links.blog")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
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
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										href="/media"
									>
										{t("links.media")}
									</Link>
								</li>
								<li>
									<Link
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
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
			<div className="relative border-border border-t">
				<div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
					<Caption className="text-muted-foreground">
						{t("legal.copyright", { year })}
					</Caption>
					<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
						<div className="flex gap-6 text-muted-foreground text-xs">
							<Link
								className="transition-colors hover:text-foreground"
								href="/privacy"
							>
								{t("legal.privacy")}
							</Link>
							<Link
								className="transition-colors hover:text-foreground"
								href="/terms"
							>
								{t("legal.terms")}
							</Link>
							<Link
								className="transition-colors hover:text-foreground"
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
