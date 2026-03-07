import { getTranslations } from "next-intl/server";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { socials } from "@/data/socials";

export default async function Footer() {
	const t = await getTranslations("footer");
	const ts = await getTranslations("services");

	const companyLinks = [
		{ href: "/#benefits", label: t("links.benefits") },
		{ href: "/#process", label: t("links.process") },
		{ href: "/#pricing", label: t("links.pricing") },
		{ href: "/#contact", label: t("links.contact") },
	];

	const year = new Date().getFullYear();

	return (
		<footer className="bg-foreground text-background">
			{/* CTA banner */}
			<div className="border-background/10 border-b">
				<div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:py-20">
					<div>
						<p className="font-normal text-2xl tracking-tight md:text-3xl">
							{t("ctaHeadline")}
						</p>
						<p className="mt-2 font-light text-sm opacity-60 md:text-base">
							{t("ctaSubtext")}
						</p>
					</div>
					{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
					<Button
						size="lg"
						className="shrink-0 border-transparent bg-brand text-white [&]:hover:bg-brand/80"
						render={<a href="/#contact" />}
					>
						{t("ctaButton")}
					</Button>
				</div>
			</div>

			{/* Main footer content */}
			<div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
				<div className="grid gap-10 md:grid-cols-12">
					{/* Brand column */}
					<div className="md:col-span-4">
						<a href="/" className="flex items-center gap-2 font-medium text-xl tracking-tight">
							<Logo className="h-7 w-7" />
							webvise
						</a>
						<p className="mt-4 max-w-xs font-light text-sm leading-relaxed opacity-60">
							{t("tagline")}
						</p>
						<p className="mt-1 font-light text-sm opacity-40">{t("location")}</p>
						<div className="mt-6 flex items-center gap-3">
							{socials.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-8 w-8 items-center justify-center rounded-full border border-background/10 opacity-50 transition-all hover:border-background/30 hover:opacity-100"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Services */}
					<div className="md:col-span-3">
						<h3 className="mb-4 font-medium text-xs uppercase tracking-wider opacity-40">
							{t("sections.services")}
						</h3>
						<ul className="space-y-2.5">
							{services.map(({ slug, translationKey }) => (
								<li key={slug}>
									<a
										href={`/services/${slug}`}
										className="font-light text-sm opacity-60 transition-opacity hover:opacity-100"
									>
										{ts(`${translationKey}.title`)}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="md:col-span-2">
						<h3 className="mb-4 font-medium text-xs uppercase tracking-wider opacity-40">
							{t("sections.company")}
						</h3>
						<ul className="space-y-2.5">
							{companyLinks.map(({ href, label }) => (
								<li key={href}>
									<a
										href={href}
										className="font-light text-sm opacity-60 transition-opacity hover:opacity-100"
									>
										{label}
									</a>
								</li>
							))}
							<li className="border-background/10 border-t pt-2.5">
								<a
									href="/media"
									className="font-light text-sm opacity-60 transition-opacity hover:opacity-100"
								>
									{t("links.media")}
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="md:col-span-3">
						<h3 className="mb-4 font-medium text-xs uppercase tracking-wider opacity-40">
							{t("sections.contact")}
						</h3>
						<ul className="space-y-2.5 font-light text-sm">
							<li>
								<a
									href={`mailto:${t("address.email")}`}
									className="text-brand transition-opacity hover:opacity-80"
								>
									{t("address.email")}
								</a>
							</li>
							<li className="opacity-60">{t("address.street")}</li>
							<li className="opacity-60">{t("address.city")}</li>
							<li className="opacity-40">{t("address.hours")}</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-background/10 border-t">
				<div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
					<p className="text-xs opacity-40">{t("legal.copyright", { year })}</p>
					<div className="flex gap-6 text-xs opacity-40">
						<a href="/privacy" className="transition-opacity hover:opacity-100">
							{t("legal.privacy")}
						</a>
						<a href="/terms" className="transition-opacity hover:opacity-100">
							{t("legal.terms")}
						</a>
						<a href="/imprint" className="transition-opacity hover:opacity-100">
							{t("legal.imprint")}
						</a>
					</div>
				</div>
			</div>

			{/* Brand accent stripe */}
			<div className="h-1 bg-brand" />
		</footer>
	);
}
