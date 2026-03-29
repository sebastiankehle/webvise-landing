"use client";

import { Activity, ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { track } from "@/lib/track";

export interface NavbarPost {
	slug: string;
	title: string;
	date: string;
	readingTime: number;
}

type NavHash = "services" | "case-studies" | "blog" | "pricing";
const dropdownHashes = new Set<NavHash>(["services", "blog", "pricing"]);

export default function Navbar({
	recentPosts = [],
}: { recentPosts?: NavbarPost[] }) {
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
	const pathname = usePathname();
	const router = useRouter();
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

	const scrollToSection = useCallback(
		(hash: string) => {
			close();
			if (pathname === "/") {
				const el = document.getElementById(hash);
				if (el) {
					el.scrollIntoView({ behavior: "smooth" });
					window.history.replaceState(null, "", `/${locale === "en" ? "" : locale}`);
				}
			} else {
				router.push("/");
			}
		},
		[pathname, router, close, locale],
	);

	const navLinks: { hash: NavHash; label: string }[] = [
		{ hash: "services", label: t("services") },
		{ hash: "case-studies", label: t("caseStudies") },
		{ hash: "blog", label: t("blog") },
		{ hash: "pricing", label: t("pricing") },
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
						className="flex items-center gap-2.5 font-medium text-xl tracking-tight"
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
						<span className="font-display text-[22px]">webvise</span>
					</Link>

					<nav
						aria-label="Main navigation"
						className="hidden h-full items-center gap-1 md:flex"
					>
						{navLinks.map(({ hash, label }) => (
							<button
								key={hash}
								type="button"
								className={`relative inline-flex h-full items-center px-4 text-[13px] uppercase tracking-wider transition-colors hover:text-foreground ${
									activeDropdown === hash
										? "text-foreground"
										: "text-muted-foreground"
								}`}
								onMouseEnter={() => dropdownHashes.has(hash) && open(hash)}
								onMouseLeave={() => dropdownHashes.has(hash) && scheduleClose()}
								onClick={() => scrollToSection(hash)}
							>
								{label}
								{activeDropdown === hash && (
									<span className="absolute bottom-0 left-4 right-4 h-px bg-brand" />
								)}
							</button>
						))}
					</nav>

					<div className="hidden items-center gap-4 md:flex">
						<LanguageSwitcher />
						<Button
							className="border-transparent bg-brand px-6 text-white [&]:hover:bg-brand/80"
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
						<div className="grid grid-cols-2">
							{services.map((service, i) => (
								<Link
									key={service.slug}
									href={{
										pathname: "/services/[slug]",
										params: { slug: service.slug },
									}}
									className={`group flex items-start gap-4 border-border/40 p-5 transition-colors hover:bg-muted/40 ${
										i < 4 ? "border-b" : ""
									} ${i % 2 === 0 ? "border-r" : ""}`}
									onClick={close}
								>
									<service.icon
										className="mt-0.5 h-5 w-5 shrink-0 text-brand"
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
											className="text-muted-foreground text-xs"
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
										<span className="mt-3 text-muted-foreground text-xs">
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
								<span className="text-brand text-xs uppercase tracking-wider">
									{tb("viewAll")}
								</span>
								<ArrowRight className="h-3 w-3 text-brand transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "pricing" && (
						<div className="grid grid-cols-3">
							{(["project", "growth", "enterprise"] as const).map(
								(key, i) => (
									<Link
										key={key}
										href={{ pathname: "/", hash: "pricing" }}
										className={`group flex flex-col border-border/40 p-5 transition-colors hover:bg-muted/40 ${
											i < 2 ? "border-r" : ""
										}`}
										onClick={(e) => {
											e.preventDefault();
											scrollToSection("pricing");
										}}
									>
										<div className="flex items-center gap-2">
											<p className="text-sm">
												{tpr(`tiers.${key}.name`)}
											</p>
											{key === "growth" && (
												<span className="border border-brand bg-brand px-1.5 py-0.5 text-[10px] text-white">
													{tpr(
														`tiers.${key}.badge`,
													)}
												</span>
											)}
										</div>
										<p className="mt-1 text-muted-foreground text-xs leading-relaxed">
											{tpr(`tiers.${key}.description`)}
										</p>
										<p className="mt-3 font-display text-xl tracking-tight">
											{tpr(`tiers.${key}.price`)}
										</p>
										<span className="text-muted-foreground text-xs">
											{tpr(`tiers.${key}.basis`)}
										</span>
									</Link>
								),
							)}
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

							<button
								type="button"
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={() => {
									scrollToSection("case-studies");
									setMobileOpen(false);
								}}
							>
								{t("caseStudies")}
							</button>

							<button
								type="button"
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={() => {
									scrollToSection("blog");
									setMobileOpen(false);
								}}
							>
								{t("blog")}
							</button>

							<button
								type="button"
								className="py-4 text-left font-display text-xl text-foreground transition-colors hover:text-brand"
								onClick={() => {
									scrollToSection("pricing");
									setMobileOpen(false);
								}}
							>
								{t("pricing")}
							</button>
						</div>

						<div className="mt-8">
							<Link
								href="/wp-health-report"
								className="group flex items-center gap-3 border border-brand/20 bg-brand/5 px-5 py-4 transition-colors hover:border-brand/40 hover:bg-brand/10"
								onClick={() => {
									track("cta_clicked", { location: "navbar_mobile", variant: "analyzer" });
									setMobileOpen(false);
								}}
							>
								<Activity className="h-4 w-4 text-brand" strokeWidth={1.5} />
								<span className="text-sm text-foreground">
									{t("webAnalyzer")}
								</span>
								<ArrowRight className="ml-auto h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
							</Link>
						</div>

						<div className="mt-auto space-y-6 border-border/40 border-t pt-6">
							<Button
								className="w-full border-transparent bg-brand text-white [&]:hover:bg-brand/80"
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
								<LanguageSwitcher />
							</div>
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
