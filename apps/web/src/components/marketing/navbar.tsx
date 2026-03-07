"use client";

import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { socials } from "@/data/socials";

export default function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const t = useTranslations("nav");
	const ts = useTranslations("services");

	const navLinks = [
		{ href: "/#services", label: t("services") },
		{ href: "/#process", label: t("process") },
		{ href: "/#pricing", label: t("pricing") },
		{ href: "/#contact", label: t("contact") },
	];

	return (
		<header className="sticky top-0 z-50 h-20 border-border/40 border-b bg-background">
			<div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link href="/" className="font-medium text-xl tracking-tight" aria-label="webvise — home">
					webvise
				</Link>

				<nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
					{navLinks.map(({ href, label }) => (
						<a
							key={href}
							href={href}
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							{label}
						</a>
					))}
				</nav>

				<div className="hidden items-center gap-4 md:flex">
					<LanguageSwitcher />
					{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
					<Button size="sm" render={<a href="/#contact" />}>
						{t("getStarted")}
					</Button>
				</div>

				<button
					type="button"
					className="md:hidden"
					onClick={() => setMobileOpen(!mobileOpen)}
					aria-label={mobileOpen ? "Close menu" : "Open menu"}
				>
					{mobileOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</button>
			</div>

			{mobileOpen && (
				<div className="border-border/40 border-b bg-background px-6 pb-6 md:hidden">
					<nav aria-label="Mobile navigation" className="flex flex-col gap-4 pt-4">
						{navLinks.map(({ href, label }) => (
							<a
								key={href}
								href={href}
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
								onClick={() => setMobileOpen(false)}
							>
								{label}
							</a>
						))}
						<div className="border-border/40 border-t pt-4">
							<p className="mb-2 font-medium text-muted-foreground/60 text-xs uppercase tracking-wider">
								{t("services")}
							</p>
							{services.map(({ slug, translationKey }) => (
								<a
									key={slug}
									href={`/services/${slug}`}
									className="block py-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
									onClick={() => setMobileOpen(false)}
								>
									{ts(`${translationKey}.title`)}
								</a>
							))}
						</div>
						<div className="flex items-center justify-between border-border/40 border-t pt-4">
							<div className="flex items-center gap-3">
								<LanguageSwitcher />
								<div className="flex items-center gap-2">
									{socials.map((social) => (
										<a
											key={social.name}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-muted-foreground transition-colors hover:text-foreground"
											aria-label={social.name}
										>
											{social.icon}
										</a>
									))}
								</div>
							</div>
							<Button
								size="sm"
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								render={<a href="/#contact" />}
							>
								{t("getStarted")}
							</Button>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
