"use client";

import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { socials } from "@/data/socials";

export default function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const t = useTranslations("nav");
	const ts = useTranslations("services");
	const pathname = usePathname();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navLinks = [
		{ href: "/#services", label: t("services") },
		{ href: "/#process", label: t("process") },
		{ href: "/#pricing", label: t("pricing") },
		{ href: "/#contact", label: t("contact") },
	];

	return (
		<header
			className={`sticky top-0 z-50 h-16 transition-[height,background-color,border-color,backdrop-filter] duration-300 md:h-20 ${
				scrolled
					? "border-border/40 border-b bg-background/80 backdrop-blur-xl"
					: "border-transparent border-b bg-background"
			}`}
		>
			<div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link
					href="/"
					className="flex items-center gap-2.5 font-medium text-xl tracking-tight"
					aria-label="webvise — home"
					onClick={(e) => {
						if (pathname === "/") {
							e.preventDefault();
							window.scrollTo({ top: 0, behavior: "smooth" });
						}
					}}
				>
					<Logo className="h-7 w-7" />
					webvise
				</Link>

				<nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
					{navLinks.map(({ href, label }) => (
						<a
							key={href}
							href={href}
							className="rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
						>
							{label}
						</a>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<LanguageSwitcher />
					{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
					<Button
						size="sm"
						className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
						render={<a href="/#contact" />}
					>
						{t("getStarted")}
					</Button>
				</div>

				<button
					type="button"
					className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
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
				<div className="border-border/40 border-b bg-background/95 px-6 pb-6 backdrop-blur-xl md:hidden">
					<nav aria-label="Mobile navigation" className="flex flex-col gap-1 pt-3">
						{navLinks.map(({ href, label }) => (
							<a
								key={href}
								href={href}
								className="rounded-md px-3 py-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => setMobileOpen(false)}
							>
								{label}
							</a>
						))}
						<div className="mt-3 border-border/40 border-t pt-4">
							<p className="mb-2 px-3 font-medium text-muted-foreground/60 text-xs uppercase tracking-wider">
								{t("services")}
							</p>
							{services.map(({ slug, translationKey }) => (
								<a
									key={slug}
									href={`/services/${slug}`}
									className="block rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
									onClick={() => setMobileOpen(false)}
								>
									{ts(`${translationKey}.title`)}
								</a>
							))}
						</div>
						<div className="mt-3 flex items-center justify-between border-border/40 border-t pt-4">
							<div className="flex items-center gap-3">
								<LanguageSwitcher />
								<div className="flex items-center gap-1">
									{socials.map((social) => (
										<a
											key={social.name}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											aria-label={social.name}
										>
											{social.icon}
										</a>
									))}
								</div>
							</div>
							<Button
								size="sm"
								className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
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
