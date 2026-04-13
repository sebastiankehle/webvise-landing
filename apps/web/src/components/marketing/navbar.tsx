"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { Link, usePathname } from "@/i18n/navigation";
import { track } from "@/lib/track";

export interface NavbarPost {
	slug: string;
	title: string;
	date: string;
	readingTime: number;
}

export interface NavbarCaseStudy {
	slug: string;
	client: string;
	title: string;
	excerpt: string;
	coverImage?: string;
}

type NavHash = "services" | "case-studies" | "blog" | "pricing";
const dropdownHashes = new Set<NavHash>(["services", "case-studies", "blog", "pricing"]);

export default function Navbar({
	recentPosts = [],
	featuredCaseStudies = [],
}: { recentPosts?: NavbarPost[]; featuredCaseStudies?: NavbarCaseStudy[] }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<NavHash | null>(null);
	const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
	const closeRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	const t = useTranslations("nav");
	const ts = useTranslations("services");
	const tpr = useTranslations("pricing");
	const tb = useTranslations("blog");
	const tcs = useTranslations("caseStudies");
	const pathname = usePathname();
	const locale = useLocale();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const open = useCallback((id: NavHash) => {
		clearTimeout(closeRef.current);
		setActiveDropdown(id);
	}, []);

	const scheduleClose = useCallback(() => {
		closeRef.current = setTimeout(() => setActiveDropdown(null), 150);
	}, []);

	const close = useCallback(() => {
		clearTimeout(closeRef.current);
		setActiveDropdown(null);
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActiveDropdown(null);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const handleNavClick = useCallback(
		(e: React.MouseEvent, hash: string) => {
			close();
			setMobileOpen(false);
			if (pathname === "/") {
				e.preventDefault();
				const el = document.getElementById(hash);
				if (el) el.scrollIntoView({ behavior: "smooth" });
			}
		},
		[pathname, close],
	);

	const navLinks: { hash: NavHash; label: string }[] = [
		{ hash: "services", label: t("services") },
		{ hash: "case-studies", label: t("caseStudies") },
		{ hash: "pricing", label: t("pricing") },
		{ hash: "blog", label: t("blog") },
	];

	return (
		<>
			<header
				className={`sticky top-0 z-50 transition-all duration-500 ${
					scrolled
						? "border-border/40 border-b bg-background/80 backdrop-blur-xl"
						: "border-transparent border-b bg-transparent"
				}`}
			>
				<div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 md:h-20">
					<Link
						href="/"
						className="flex items-center gap-2.5"
						aria-label="webvise - home"
						onClick={(e) => {
							if (pathname === "/") {
								e.preventDefault();
								window.scrollTo({ top: 0, behavior: "smooth" });
								window.history.replaceState(null, "", `/${locale === "en" ? "" : locale}`);
							}
						}}
					>
						<Logo className="h-7 w-7" animated />
						<span className="font-display text-[22px]">
							webvise
						</span>
					</Link>

					<nav
						aria-label="Main navigation"
						className="hidden h-full items-center gap-1 md:flex"
					>
						{navLinks.map(({ hash, label }) => (
							<Link
								key={hash}
								href={{ pathname: "/", hash }}
								className={`relative inline-flex h-full items-center px-4 text-sm transition-colors hover:text-foreground ${
									activeDropdown === hash
										? "text-foreground"
										: "text-muted-foreground"
								}`}
								onMouseEnter={() => dropdownHashes.has(hash) && open(hash)}
								onMouseLeave={() => dropdownHashes.has(hash) && scheduleClose()}
								onClick={(e) => handleNavClick(e, hash)}
							>
								{label}
								{activeDropdown === hash && (
									<span className="absolute bottom-0 left-4 right-4 h-px bg-brand" />
								)}
							</Link>
						))}
					</nav>

					<div className="hidden items-center gap-4 md:flex">
						<LanguageSwitcher id="lang-desktop" />
						<Button
							className="border-transparent bg-brand px-6 font-mono text-white [&]:hover:bg-brand/80"
							onClick={() => track("cta_clicked", { location: "navbar", variant: "get_started" })}
							render={
								<Link href={{ pathname: "/", hash: "contact" }} />
							}
						>
							{t("getStarted")}
						</Button>
					</div>

					<button
						type="button"
						className="flex h-9 w-9 items-center justify-center transition-colors hover:text-brand md:hidden"
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
			</header>

			{activeDropdown && (
				<button
					type="button"
					className="fixed inset-0 z-30 hidden cursor-default transition-opacity duration-200 md:block"
					onClick={close}
					onMouseEnter={close}
					tabIndex={-1}
					aria-label="Close menu"
				/>
			)}

			<nav
				aria-label="Section preview"
				className={`pointer-events-none fixed top-16 right-0 left-0 z-40 hidden justify-center px-6 md:top-20 md:flex ${
					activeDropdown
						? "*:pointer-events-auto *:translate-y-0 *:opacity-100"
						: "*:pointer-events-none *:-translate-y-2 *:opacity-0"
				}`}
				onMouseEnter={() => activeDropdown && open(activeDropdown)}
				onMouseLeave={scheduleClose}
			>
				<div className="w-full max-w-[720px] border border-border/40 bg-background/95 shadow-xl backdrop-blur-xl transition-all duration-200 ease-out">
					{activeDropdown === "services" && (
						<div>
							<div className="grid grid-cols-3">
								{services.map((service, i) => (
									<Link
										key={service.slug}
										href={{
											pathname: "/services/[slug]",
											params: { slug: service.slug },
										}}
										className={`group flex items-start gap-3 border-border/40 p-5 transition-colors hover:bg-muted/40 ${
											i < 3 ? "border-b" : ""
										} ${i % 3 !== 2 ? "border-r" : ""}`}
										onClick={close}
									>
										<service.icon
											className="mt-0.5 h-4 w-4 shrink-0 text-brand"
											strokeWidth={1.5}
										/>
										<div className="min-w-0">
											<p className="text-sm">
												{ts(
													`${service.translationKey}.title`,
												)}
											</p>
											<p className="mt-1 text-muted-foreground text-xs leading-relaxed">
												{ts(
													`${service.translationKey}.tagline`,
												)}
											</p>
										</div>
									</Link>
								))}
							</div>
							<Link
								href={{ pathname: "/", hash: "services" }}
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								onClick={(e) => handleNavClick(e, "services")}
							>
								<span className="font-mono text-brand text-xs">
									{ts("viewAll")}
								</span>
								<ArrowRight className="h-3 w-3 text-brand transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "case-studies" && (
						<div>
							<div className="grid grid-cols-3">
								{featuredCaseStudies.map((cs, i) => (
									<Link
										key={cs.slug}
										href={{
											pathname: "/case-studies/[slug]",
											params: { slug: cs.slug },
										}}
										className={`group flex flex-col border-border/40 transition-colors hover:bg-muted/40 ${
											i < 2 ? "border-r" : ""
										}`}
										onClick={close}
									>
										{cs.coverImage && (
											<div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
												<img
													src={cs.coverImage}
													alt={cs.title}
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											</div>
										)}
										<div className="flex flex-1 flex-col p-4">
											<span className="font-mono text-muted-foreground text-xs">
												{cs.client}
											</span>
											<p className="mt-1.5 text-sm leading-snug transition-colors group-hover:text-brand">
												{cs.title}
											</p>
										</div>
									</Link>
								))}
							</div>
							<Link
								href="/case-studies"
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								onClick={close}
							>
								<span className="font-mono text-brand text-xs">
									{tcs("viewAll")}
								</span>
								<ArrowRight className="h-3 w-3 text-brand transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "blog" && (
						<div>
							<div className="grid grid-cols-3">
								{recentPosts.map((post, i) => (
									<Link
										key={post.slug}
										href={{
											pathname: "/blog/[slug]",
											params: { slug: post.slug },
										}}
										className={`group flex flex-col border-border/40 p-5 transition-colors hover:bg-muted/40 ${
											i < 2 ? "border-r" : ""
										}`}
										onClick={close}
									>
										<time
											dateTime={post.date}
											className="font-mono text-muted-foreground text-xs"
										>
											{new Date(
												post.date,
											).toLocaleDateString(locale, {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</time>
										<p className="mt-2 text-sm leading-snug transition-colors group-hover:text-brand">
											{post.title}
										</p>
										<span className="mt-auto pt-3 font-mono text-muted-foreground text-xs">
											{post.readingTime}{" "}
											{tb("minRead")}
										</span>
									</Link>
								))}
							</div>
							<Link
								href="/blog"
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								onClick={close}
							>
								<span className="font-mono text-brand text-xs">
									{tb("viewAll")}
								</span>
								<ArrowRight className="h-3 w-3 text-brand transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "pricing" && (
						<div>
							<div className="grid grid-cols-3">
								{(["project", "growth", "enterprise"] as const).map(
									(key, i) => (
										<Link
											key={key}
											href={{ pathname: "/", hash: "pricing" }}
											className={`group flex flex-col border-border/40 p-5 transition-colors hover:bg-muted/40 ${
												i < 2 ? "border-r" : ""
											}`}
											onClick={(e) => handleNavClick(e, "pricing")}
										>
											<div className="flex items-center gap-2">
												<p className="text-sm">
													{tpr(`tiers.${key}.name`)}
												</p>
												{key === "growth" && (
													<span className="border border-brand bg-brand px-1.5 py-0.5 font-mono text-[10px] text-white">
														{tpr(
															`tiers.${key}.badge`,
														)}
													</span>
												)}
											</div>
											<p className="mt-1 text-muted-foreground text-xs leading-relaxed">
												{tpr(`tiers.${key}.description`)}
											</p>
											<p className="mt-auto pt-3 font-display text-xl tracking-[-0.04em]">
												{tpr(`tiers.${key}.price`)}
											</p>
											<span className="font-mono text-muted-foreground text-xs">
												{tpr(`tiers.${key}.basis`)}
											</span>
										</Link>
									),
								)}
							</div>
							<Link
								href={{ pathname: "/", hash: "pricing" }}
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								onClick={(e) => handleNavClick(e, "pricing")}
							>
								<span className="font-mono text-brand text-xs">
									{tpr("cta")}
								</span>
								<ArrowRight className="h-3 w-3 text-brand transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}
				</div>
			</nav>

			{mobileOpen && (
				<div className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-background/95 px-6 pb-6 backdrop-blur-xl md:hidden">
					<nav
						aria-label="Mobile navigation"
						className="flex min-h-full flex-col pt-6"
					>
						<div className="flex flex-col gap-0.5">
							<button
								type="button"
								className="flex items-center justify-between py-4 text-foreground transition-colors hover:text-brand"
								onClick={() =>
									setMobileServicesOpen(!mobileServicesOpen)
								}
							>
								<span className="font-display text-xl">{t("services")}</span>
								<ChevronDown
									className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
								/>
							</button>
							{mobileServicesOpen && (
								<div className="mb-2 ml-1 flex flex-col gap-0.5 border-border/40 border-l pl-4">
									{services.map(
										({ slug, translationKey, icon: Icon }) => (
											<Link
												key={slug}
												href={{
													pathname:
														"/services/[slug]",
													params: { slug },
												}}
												className="flex items-center gap-3 py-2.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
												onClick={() =>
													setMobileOpen(false)
												}
											>
												<Icon
													className="h-4 w-4 text-brand"
													strokeWidth={1.5}
												/>
												{ts(
													`${translationKey}.title`,
												)}
											</Link>
										),
									)}
								</div>
							)}

							<Link
								href={{ pathname: "/", hash: "case-studies" }}
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={(e) => handleNavClick(e, "case-studies")}
							>
								{t("caseStudies")}
							</Link>

							<Link
								href={{ pathname: "/", hash: "blog" }}
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={(e) => handleNavClick(e, "blog")}
							>
								{t("blog")}
							</Link>

							<Link
								href={{ pathname: "/", hash: "pricing" }}
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={(e) => handleNavClick(e, "pricing")}
							>
								{t("pricing")}
							</Link>
						</div>

						<div className="mt-auto space-y-6 border-border/40 border-t pt-6">
							<Button
								className="w-full border-transparent bg-brand font-mono text-white [&]:hover:bg-brand/80"
								size="lg"
								render={
									<Link
										href={{
											pathname: "/",
											hash: "contact",
										}}
									/>
								}
								onClick={() => {
									track("cta_clicked", { location: "navbar_mobile", variant: "get_started" });
									setMobileOpen(false);
								}}
							>
								{t("getStarted")}
							</Button>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{socials.map((social) => (
										<a
											key={social.name}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="flex h-8 w-8 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											aria-label={social.name}
										>
											{social.icon}
										</a>
									))}
								</div>
								<LanguageSwitcher id="lang-mobile" />
							</div>
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
