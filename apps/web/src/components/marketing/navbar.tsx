"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export interface NavbarPost {
	slug: string;
	title: string;
	date: string;
	readingTime: number;
}

type NavHash = "services" | "blog" | "pricing";

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
		{ hash: "pricing", label: t("pricing") },
		{ hash: "blog", label: t("blog") },
	];

	return (
		<>
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
						webvise
					</Link>

					<nav
						aria-label="Main navigation"
						className="hidden h-full items-center gap-1 md:flex"
					>
						{navLinks.map(({ hash, label }) => (
							<button
								key={hash}
								type="button"
								className={`inline-flex h-full items-center px-3 text-sm transition-colors hover:text-foreground ${
									activeDropdown === hash
										? "text-foreground"
										: "text-muted-foreground"
								}`}
								onMouseEnter={() => open(hash)}
								onMouseLeave={scheduleClose}
								onClick={() => scrollToSection(hash)}
							>
								{label}
							</button>
						))}
					</nav>

					<div className="hidden items-center gap-3 md:flex">
						<LanguageSwitcher />
						<Button
							className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
							render={
								<Link href={{ pathname: "/", hash: "contact" }} />
							}
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
				<div className="w-full max-w-[720px] border border-border/40 bg-background/95 shadow-lg backdrop-blur-xl transition-all duration-200 ease-out">
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
										<p className="font-medium text-sm">
											{ts(
												`${service.translationKey}.title`,
											)}
										</p>
										<p className="mt-1 font-light text-muted-foreground text-xs leading-relaxed">
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
											className="font-light text-muted-foreground text-xs"
										>
											{new Date(
												post.date,
											).toLocaleDateString(locale, {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</time>
										<p className="mt-2 font-medium text-sm leading-snug transition-colors group-hover:text-brand">
											{post.title}
										</p>
										<span className="mt-3 font-light text-muted-foreground text-xs">
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
								<span className="font-light text-brand text-xs">
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
											<p className="font-medium text-sm">
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
										<p className="mt-1 font-light text-muted-foreground text-xs leading-relaxed">
											{tpr(`tiers.${key}.description`)}
										</p>
										<p className="mt-3 font-normal text-lg tracking-tight">
											{tpr(`tiers.${key}.price`)}
										</p>
										<span className="font-light text-muted-foreground text-xs">
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
						className="flex min-h-full flex-col pt-3"
					>
						<div className="flex flex-col">
							<button
								type="button"
								className="flex items-center justify-between rounded-md px-3 py-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
								onClick={() =>
									setMobileServicesOpen(!mobileServicesOpen)
								}
							>
								{t("services")}
								<ChevronDown
									className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
								/>
							</button>
							{mobileServicesOpen && (
								<div className="flex flex-col pb-1 pl-3">
									{services.map(
										({ slug, translationKey, icon: Icon }) => (
											<Link
												key={slug}
												href={{
													pathname:
														"/services/[slug]",
													params: { slug },
												}}
												className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
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
								className="rounded-md px-3 py-2.5 text-left text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => {
									scrollToSection("pricing");
									setMobileOpen(false);
								}}
							>
								{t("pricing")}
							</button>

							<button
								type="button"
								className="rounded-md px-3 py-2.5 text-left text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => {
									scrollToSection("blog");
									setMobileOpen(false);
								}}
							>
								{t("blog")}
							</button>

							<Link
								href="/wp-health-report"
								className="rounded-md px-3 py-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
								onClick={() => setMobileOpen(false)}
							>
								{t("webAnalyzer")}
							</Link>
						</div>

						<div className="mt-auto flex items-center justify-between border-border/40 border-t pt-4">
							<LanguageSwitcher />
							<Button
								className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
								render={
									<Link
										href={{
											pathname: "/",
											hash: "contact",
										}}
									/>
								}
								onClick={() => setMobileOpen(false)}
							>
								{t("getStarted")}
							</Button>
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
