"use client";

import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

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
		<header className="sticky top-0 z-50 h-20 border-border/40 border-b bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link href="/" className="font-medium text-xl tracking-tight">
					webvise
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
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
					<Button size="sm" variant="outline" render={<a href="/#contact" />}>
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
					<nav className="flex flex-col gap-4 pt-4">
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
						<div className="border-border/40 border-t pt-4">
							<Button
								size="sm"
								variant="outline"
								className="w-full"
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
