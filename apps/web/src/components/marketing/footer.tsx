import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import Logo from "@/components/logo";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { Link } from "@/i18n/navigation";

export default async function Footer({ ctaBanner }: { ctaBanner?: ReactNode }) {
	const t = await getTranslations("footer");
	const ts = await getTranslations("services");
	const tw = await getTranslations("wpHealthReport.cta");


	const companyLinks = [
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
					<div className="md:col-span-4">
						<Link
							href="/"
							className="flex items-center gap-2.5"
						>
							<Logo className="h-7 w-7" animated />
							<span className="font-display text-[22px]">webvise</span>
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
							{t("tagline")}
						</p>
						<p className="mt-1 text-sm text-muted-foreground/60">
							{t("location")}
						</p>
						<div className="mt-8 flex items-center gap-3">
							{socials.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-8 w-8 items-center justify-center border border-[--border] text-muted-foreground transition-all hover:border-brand/40 hover:text-brand"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Services */}
					<div className="md:col-span-3">
						<h3 className="mb-5 text-muted-foreground/50 text-xs">
							{t("sections.services")}
						</h3>
						<ul className="space-y-3">
							{services.map(({ slug, translationKey }) => (
								<li key={slug}>
									<Link
										href={{ pathname: "/services/[slug]", params: { slug } }}
										className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
									>
										{ts(`${translationKey}.title`)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="md:col-span-2">
						<h3 className="mb-5 text-muted-foreground/50 text-xs">
							{t("sections.company")}
						</h3>
						<ul className="space-y-3">
							{companyLinks.map(({ hash, label }) => (
								<li key={hash}>
									<Link
										href={{ pathname: "/", hash }}
										className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
									>
										{label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/case-studies"
									className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
								>
									{t("links.caseStudies")}
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
								>
									{t("links.blog")}
								</Link>
							</li>
							<li>
								<Link
									href="/trust"
									className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
								>
									{t("links.trust")}
								</Link>
							</li>
							<li className="border-[--border] border-t pt-3">
								<a
									href="/media"
									className="text-sm text-muted-foreground transition-colors hover:text-[--foreground]"
								>
									{t("links.media")}
								</a>
							</li>
							<li>
								<Link
									href="/wp-health-report"
									className="text-brand text-sm transition-opacity hover:opacity-80"
								>
									{tw("button")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="md:col-span-3">
						<h3 className="mb-5 text-muted-foreground/50 text-xs">
							{t("sections.contact")}
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<a
									href={`mailto:${t("address.email")}`}
									className="text-brand transition-opacity hover:opacity-80"
								>
									{t("address.email")}
								</a>
							</li>
							<li className="text-muted-foreground">{t("address.street")}</li>
							<li className="text-muted-foreground">{t("address.city")}</li>
							<li className="text-muted-foreground/60">{t("address.hours")}</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-[--border] border-t">
				<div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
					<p className="text-xs text-muted-foreground/60">{t("legal.copyright", { year })}</p>
					<div className="flex gap-6 text-xs text-muted-foreground/60">
						<Link
							href="/privacy"
							className="transition-colors hover:text-[--foreground]"
						>
							{t("legal.privacy")}
						</Link>
						<Link
							href="/terms"
							className="transition-colors hover:text-[--foreground]"
						>
							{t("legal.terms")}
						</Link>
						<Link
							href="/imprint"
							className="transition-colors hover:text-[--foreground]"
						>
							{t("legal.imprint")}
						</Link>
					</div>
				</div>
			</div>

			{/* Brand accent stripe */}
			<div className="h-px bg-brand" />
		</footer>
	);
}
