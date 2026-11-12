import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import Logo from "@/components/logo";
import { assistantMarks } from "@/components/marketing/assistant-marks";
import { CookiePreferencesLink } from "@/components/marketing/cookie-preferences-link";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { OpenAiPartnerBadge } from "@/components/marketing/openai-partner-badge";
import { marketingSurfaceClassName } from "@/components/marketing/section-wrapper";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { industries } from "@/data/industries";
import { offeringGroups } from "@/data/offerings";
import { socials } from "@/data/socials";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";

const linkClassName =
	"inline-block text-foreground/75 text-sm outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4 pointer-coarse:py-2";

/** Assistants that take a question in the link, so a visitor can ask one
 * about webvise in a click. */
const assistants = [
	{ name: "ChatGPT", url: "https://chatgpt.com/?q=" },
	{ name: "Claude", url: "https://claude.ai/new?q=" },
	{ name: "Google AI", url: "https://www.google.com/search?udm=50&q=" },
	{ name: "Perplexity", url: "https://www.perplexity.ai/search?q=" },
];
const factKeys = ["0", "1"];
const chipClassName =
	"inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-sm";

function FooterColumn({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}) {
	return (
		<div>
			<h2 className="text-muted-foreground text-sm">{title}</h2>
			<ul className="mt-4 grid gap-2.5 pointer-coarse:gap-0">{children}</ul>
		</div>
	);
}

export default async function Footer({ ctaBanner }: { ctaBanner?: ReactNode }) {
	const [locale, t, tn, tb, ts, th, ti] = await Promise.all([
		getLocale(),
		getTranslations("footer"),
		getTranslations("nav"),
		getTranslations("blog.newsletter"),
		getTranslations("services"),
		getTranslations("home.hero"),
		getTranslations("industries"),
	]);
	const year = new Date().getFullYear();
	const email = t("address.email");
	const question = encodeURIComponent(t("askAi.prompt"));

	return (
		<footer className={marketingSurfaceClassName("inverted")}>
			{ctaBanner}

			<div className="mx-auto max-w-[1320px] px-6 pt-16 pb-12 md:pt-20">
				<div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Link
							className="inline-flex items-center gap-2 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
							href="/"
						>
							<Logo animated className="size-7" />
							<span className="font-display text-xl leading-none tracking-[-0.035em]">
								webvise
							</span>
						</Link>
						<p className="mt-3 max-w-[34ch] text-foreground/75 text-sm leading-6">
							{t("tagline")}
						</p>
						<p className="mt-1 text-foreground/75 text-sm leading-6">
							{t("locations")}
						</p>
						<div className="mt-6 max-w-[320px]">
							<p className="text-muted-foreground text-sm">{tb("divider")}</p>
							<div className="mt-3">
								<NewsletterForm
									buttonLabel={tb("button")}
									error={tb("error")}
									placeholder={tb("placeholder")}
									success={tb("success")}
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:col-start-5 xl:grid-cols-5">
						<FooterColumn title={t("sections.services")}>
							{offeringGroups.map((group) => (
								<li key={group.key}>
									<a
										className={linkClassName}
										href={homepageSectionHref(`services-${group.key}`, locale)}
									>
										{ts(`groups.${group.key}.title`)}
									</a>
								</li>
							))}
							<li>
								<Link className={linkClassName} href="/services">
									{t("allServices")}
								</Link>
							</li>
						</FooterColumn>
						<FooterColumn title={t("sections.industries")}>
							{industries.map((industry) => (
								<li key={industry.slug}>
									<Link
										className={linkClassName}
										href={{
											pathname: "/industries/[slug]",
											params: { slug: industry.slug },
										}}
									>
										{ti(`items.${industry.slug}.name`)}
									</Link>
								</li>
							))}
						</FooterColumn>
						<FooterColumn title={t("sections.company")}>
							<li>
								<Link className={linkClassName} href="/case-studies">
									{t("links.caseStudies")}
								</Link>
							</li>
							<li>
								<Link className={linkClassName} href="/about">
									{t("links.about")}
								</Link>
							</li>
							<li>
								<Link className={linkClassName} href="/blog">
									{t("links.blog")}
								</Link>
							</li>
							<li>
								<Link className={linkClassName} href="/book">
									{tn("bookCall")}
								</Link>
							</li>
						</FooterColumn>
						<FooterColumn title={t("sections.resources")}>
							<li>
								<Link className={linkClassName} href="/wp-health-report">
									{tn("wpHealthReport")}
								</Link>
							</li>
							<li>
								<Link className={linkClassName} href="/faq">
									{t("links.faq")}
								</Link>
							</li>
							<li>
								<Link className={linkClassName} href="/media">
									{t("links.media")}
								</Link>
							</li>
						</FooterColumn>
						<FooterColumn title={t("sections.contact")}>
							<li>
								<a className={linkClassName} href={`mailto:${email}`}>
									{email}
								</a>
							</li>
							<li className="text-foreground/75 text-sm">
								{t("address.street")}
							</li>
							<li className="text-foreground/75 text-sm">
								{t("address.city")}
							</li>
						</FooterColumn>
					</div>
				</div>

				<div className="mt-16 flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
						<p className="text-foreground/75 text-sm">{t("askAi.label")}</p>
						<ul className="flex flex-wrap gap-2">
							{assistants.map((assistant) => (
								<li key={assistant.name}>
									<a
										className={`${chipClassName} border border-foreground/15 text-foreground outline-none transition-colors duration-150 hover:bg-foreground/[0.08] focus-visible:ring-2 focus-visible:ring-ring/70`}
										href={`${assistant.url}${question}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										<svg
											aria-hidden="true"
											className="size-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d={assistantMarks[assistant.name]} />
										</svg>
										{assistant.name}
									</a>
								</li>
							))}
						</ul>
					</div>
					<ul className="flex flex-wrap gap-2">
						{factKeys.map((key) => (
							<li
								className={`${chipClassName} text-foreground/75 ring-1 ring-foreground/15 ring-inset`}
								key={key}
							>
								{th(`facts.${key}`)}
							</li>
						))}
					</ul>
				</div>

				<div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
					<div className="flex items-center gap-1">
						{socials.map((social) => (
							<SocialIconButton
								href={social.href}
								key={social.name}
								label={social.name}
							>
								{social.icon}
							</SocialIconButton>
						))}
						<ThemeSwitcher variant="compact" />
					</div>
					<OpenAiPartnerBadge className="w-[116px]" />
				</div>

				<div className="mt-8 flex flex-col gap-4 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between md:pr-20 min-[1500px]:pr-0">
					<p>{t("legal.copyright", { year })}</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<Link
							className="pointer-coarse:py-2 outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
							href="/privacy"
						>
							{t("legal.privacy")}
						</Link>
						<Link
							className="pointer-coarse:py-2 outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
							href="/terms"
						>
							{t("legal.terms")}
						</Link>
						<Link
							className="pointer-coarse:py-2 outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
							href="/imprint"
						>
							{t("legal.imprint")}
						</Link>
						<CookiePreferencesLink />
					</div>
				</div>
			</div>
		</footer>
	);
}
