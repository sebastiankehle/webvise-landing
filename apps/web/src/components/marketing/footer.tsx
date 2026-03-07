import { getTranslations } from "next-intl/server";

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
		<footer className="border-border/40 border-t bg-foreground text-background">
			<div className="mx-auto max-w-[1200px] px-6 py-20">
				<div className="grid gap-10 md:grid-cols-4">
					<div className="md:col-span-1">
						<a href="/" className="font-medium text-xl tracking-tight">
							webvise
						</a>
						<p className="mt-4 text-sm opacity-60">{t("tagline")}</p>
						<p className="mt-2 text-sm opacity-60">{t("location")}</p>
						<div className="mt-4 flex items-center gap-3">
							{socials.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="opacity-40 transition-opacity hover:opacity-100"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					<div>
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

					<div>
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
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-medium text-xs uppercase tracking-wider opacity-40">
							{t("sections.contact")}
						</h3>
						<ul className="space-y-2.5 font-light text-sm opacity-60">
							<li>
								<a
									href={`mailto:${t("address.email")}`}
									className="transition-opacity hover:opacity-100"
								>
									{t("address.email")}
								</a>
							</li>
							<li>{t("address.street")}</li>
							<li>{t("address.city")}</li>
							<li>{t("address.hours")}</li>
						</ul>
					</div>
				</div>

				<div className="mt-16 flex flex-col items-center justify-between gap-4 border-background/10 border-t pt-8 md:flex-row">
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
		</footer>
	);
}
