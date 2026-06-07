"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/logo";
import IconCloud from "@/components/marketing/icon-cloud";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { Button } from "@/components/ui/button";
import { Body, Caption, H3, Label } from "@/components/ui/typography";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { Link, usePathname } from "@/i18n/navigation";
import { track } from "@/lib/track";

export interface NavbarPost {
	date: string;
	readingTime: number;
	slug: string;
	title: string;
}

export interface NavbarCaseStudy {
	client: string;
	coverImage?: string;
	excerpt: string;
	slug: string;
	title: string;
}

type NavHash = "services" | "case-studies" | "blog" | "pricing";
const dropdownHashes = new Set<NavHash>([
	"services",
	"case-studies",
	"blog",
	"pricing",
]);

export default function Navbar({
	recentPosts = [],
	featuredCaseStudies = [],
}: {
	recentPosts?: NavbarPost[];
	featuredCaseStudies?: NavbarCaseStudy[];
}) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [_scrolled, setScrolled] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<NavHash | null>(null);
	const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
	const closeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const dropdownRef = useRef<HTMLElement>(null);
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

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

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
			if (e.key === "Escape") {
				setActiveDropdown(null);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		const node = dropdownRef.current;
		if (!node) {
			return;
		}
		const onEnter = () => {
			if (activeDropdown) {
				open(activeDropdown);
			}
		};
		node.addEventListener("mouseenter", onEnter);
		node.addEventListener("mouseleave", scheduleClose);
		return () => {
			node.removeEventListener("mouseenter", onEnter);
			node.removeEventListener("mouseleave", scheduleClose);
		};
	}, [activeDropdown, open, scheduleClose]);

	const handleNavClick = useCallback(
		(e: React.MouseEvent, hash: string) => {
			close();
			setMobileOpen(false);
			if (pathname === "/") {
				e.preventDefault();
				const el = document.getElementById(hash);
				if (el) {
					el.scrollIntoView({ behavior: "smooth" });
				}
			}
		},
		[pathname, close]
	);

	const navLinks: { hash: NavHash; label: string }[] = [
		{ hash: "services", label: t("services") },
		{ hash: "case-studies", label: t("caseStudies") },
		{ hash: "pricing", label: t("pricing") },
		{ hash: "blog", label: t("blog") },
	];

	return (
		<>
			<header className="sticky top-0 z-50 border-grid-line border-b bg-background">
				<div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 md:h-20">
					<Link
						aria-label="webvise - home"
						className="flex items-center gap-2.5"
						href="/"
						onClick={(e) => {
							if (pathname === "/") {
								e.preventDefault();
								window.scrollTo({ top: 0, behavior: "smooth" });
								window.history.replaceState(
									null,
									"",
									`/${locale === "en" ? "" : locale}`
								);
							}
						}}
					>
						<Logo animated className="h-7 w-7" />
						<Label className="font-display text-foreground text-xl tracking-[-0.02em]">
							webvise
						</Label>
					</Link>

					<nav
						aria-label="Main navigation"
						className="hidden h-full items-center gap-1 md:flex"
					>
						{navLinks.map(({ hash, label }) => (
							<Link
								className={`relative inline-flex h-full items-center px-4 text-[13px] transition-colors hover:text-foreground ${
									activeDropdown === hash
										? "text-foreground"
										: "text-muted-foreground"
								}`}
								href={{ pathname: "/", hash }}
								key={hash}
								onClick={(e) => handleNavClick(e, hash)}
								onMouseEnter={() => dropdownHashes.has(hash) && open(hash)}
								onMouseLeave={() => dropdownHashes.has(hash) && scheduleClose()}
							>
								{label}
								{activeDropdown === hash && (
									<span className="absolute right-4 bottom-0 left-4 h-px bg-brand" />
								)}
							</Link>
						))}
					</nav>

					<div className="hidden items-center gap-4 md:flex">
						<LanguageSwitcher id="lang-desktop" />
						<Button
							className="[&]:hover:!bg-brand-hover border-transparent bg-brand px-6 text-brand-foreground"
							onClick={() =>
								track("cta_clicked", {
									location: "navbar",
									variant: "get_started",
								})
							}
							render={<Link href={{ pathname: "/", hash: "contact" }} />}
						>
							{t("getStarted")}
						</Button>
					</div>

					<button
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						className="flex h-9 w-9 items-center justify-center border-0 md:hidden"
						onClick={() => setMobileOpen(!mobileOpen)}
						type="button"
					>
						<div className="flex w-[18px] flex-col gap-[5px]">
							<span
								className={`block h-[1.5px] w-full origin-center bg-current transition-all duration-300 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
							/>
							<span
								className={`block h-[1.5px] w-full bg-current transition-all duration-300 ${mobileOpen ? "scale-x-0 opacity-0" : ""}`}
							/>
							<span
								className={`block h-[1.5px] w-full origin-center bg-current transition-all duration-300 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
							/>
						</div>
					</button>
				</div>
			</header>

			{activeDropdown && (
				<button
					aria-label="Close menu"
					className="fixed inset-0 z-30 hidden cursor-default transition-opacity duration-200 md:block"
					onClick={close}
					onMouseEnter={close}
					tabIndex={-1}
					type="button"
				/>
			)}

			<nav
				aria-label="Section preview"
				className={`pointer-events-none fixed top-16 right-0 left-0 z-40 hidden justify-center px-6 md:top-20 md:flex ${
					activeDropdown
						? "*:pointer-events-auto *:translate-y-0 *:opacity-100"
						: "*:pointer-events-none *:-translate-y-2 *:opacity-0"
				}`}
				ref={dropdownRef}
			>
				<div className="w-full max-w-[720px] border border-border/40 bg-background shadow-xl transition-all duration-200 ease-out">
					{activeDropdown === "services" && (
						<div>
							<div className="grid grid-cols-3">
								{services.map((service, i) => (
									<Link
										className={`group flex items-start gap-3 border-border/40 p-5 transition-colors hover:bg-muted/40 ${
											i < 3 ? "border-b" : ""
										} ${i % 3 === 2 ? "" : "border-r"}`}
										href={{
											pathname: "/services/[slug]",
											params: { slug: service.slug },
										}}
										key={service.slug}
										onClick={close}
									>
										<service.icon
											className="mt-0.5 h-4 w-4 shrink-0 text-brand-icon"
											strokeWidth={1.5}
										/>
										<div className="min-w-0">
											<Body className="text-sm">
												{ts(`${service.translationKey}.title`)}
											</Body>
											<Caption className="mt-1 block leading-relaxed">
												{ts(`${service.translationKey}.tagline`)}
											</Caption>
										</div>
									</Link>
								))}
							</div>
							<Link
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								href={{ pathname: "/", hash: "services" }}
								onClick={(e) => handleNavClick(e, "services")}
							>
								<Caption className="text-brand-readable">
									{ts("viewAll")}
								</Caption>
								<ArrowRight className="h-3 w-3 text-brand-readable transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "case-studies" && (
						<div>
							<div className="grid grid-cols-3">
								{featuredCaseStudies.map((cs, i) => (
									<Link
										className={`group flex flex-col border-border/40 transition-colors hover:bg-muted/40 ${
											i < 2 ? "border-r" : ""
										} ${cs.coverImage ? "" : "p-5"}`}
										href={{
											pathname: "/case-studies/[slug]",
											params: { slug: cs.slug },
										}}
										key={cs.slug}
										onClick={close}
									>
										{cs.coverImage && (
											<div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
												<Image
													alt={cs.title}
													className="object-cover transition-transform duration-300 group-hover:scale-105"
													fill
													sizes="(max-width: 768px) 100vw, 240px"
													src={cs.coverImage}
												/>
											</div>
										)}
										<div className="flex flex-1 flex-col p-4">
											<Caption>{cs.client}</Caption>
											<Body className="mt-1.5 text-sm leading-snug transition-colors group-hover:text-brand-readable">
												{cs.title}
											</Body>
										</div>
									</Link>
								))}
							</div>
							<Link
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								href="/case-studies"
								onClick={close}
							>
								<Caption className="text-brand-readable">
									{tcs("viewAll")}
								</Caption>
								<ArrowRight className="h-3 w-3 text-brand-readable transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "blog" && (
						<div>
							<div className="grid grid-cols-3">
								{recentPosts.map((post, i) => (
									<Link
										className={`group flex flex-col border-border/40 p-5 transition-colors hover:bg-muted/40 ${
											i < 2 ? "border-r" : ""
										}`}
										href={{
											pathname: "/blog/[slug]",
											params: { slug: post.slug },
										}}
										key={post.slug}
										onClick={close}
									>
										<time
											className="text-muted-foreground text-xs"
											dateTime={post.date}
										>
											{new Date(post.date).toLocaleDateString(locale, {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</time>
										<Body className="mt-2 text-sm leading-snug transition-colors group-hover:text-brand-readable">
											{post.title}
										</Body>
										<Caption className="mt-auto pt-3">
											{post.readingTime} {tb("minRead")}
										</Caption>
									</Link>
								))}
							</div>
							<Link
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								href="/blog"
								onClick={close}
							>
								<Caption className="text-brand-readable">
									{tb("viewAll")}
								</Caption>
								<ArrowRight className="h-3 w-3 text-brand-readable transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}

					{activeDropdown === "pricing" && (
						<div>
							<div className="grid grid-cols-3">
								{(["project", "growth", "enterprise"] as const).map(
									(key, i) => (
										<Link
											className={`group flex flex-col border-border/40 p-5 transition-colors hover:bg-muted/40 ${
												i < 2 ? "border-r" : ""
											}`}
											href={{ pathname: "/", hash: "pricing" }}
											key={key}
											onClick={(e) => handleNavClick(e, "pricing")}
										>
											<div className="flex items-center gap-2">
												<Body className="text-sm">
													{tpr(`tiers.${key}.name`)}
												</Body>
												{key === "growth" && (
													<Label className="border border-brand bg-brand px-1.5 py-0.5 text-[10px] text-brand-foreground">
														{tpr(`tiers.${key}.badge`)}
													</Label>
												)}
											</div>
											<Caption className="mt-1 block leading-relaxed">
												{tpr(`tiers.${key}.description`)}
											</Caption>
											<H3 className="mt-auto pt-3 text-xl tracking-[-0.04em]">
												{tpr(`tiers.${key}.price`)}
											</H3>
											<Caption>{tpr(`tiers.${key}.basis`)}</Caption>
										</Link>
									)
								)}
							</div>
							<Link
								className="group flex items-center justify-between border-border/40 border-t p-4 px-5 transition-colors hover:bg-muted/40"
								href={{ pathname: "/", hash: "pricing" }}
								onClick={(e) => handleNavClick(e, "pricing")}
							>
								<Caption className="text-brand-readable">{tpr("cta")}</Caption>
								<ArrowRight className="h-3 w-3 text-brand-readable transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					)}
				</div>
			</nav>

			<div
				className={`fixed inset-0 top-16 z-50 bg-background transition-opacity duration-300 md:hidden ${
					mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			>
				{/* Decorative icon cloud — mirrors hero placement, non-interactive */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute top-12 right-[-24px]"
				>
					<div className="h-[220px] w-[180px]">
						{mobileOpen && <IconCloud />}
					</div>
				</div>
				<nav
					aria-label="Mobile navigation"
					className="relative mx-auto flex h-full max-w-[1320px] flex-col overflow-y-auto px-6 pt-6 pb-6"
				>
					<div className="flex flex-col gap-0.5">
						<button
							className="flex items-center justify-between py-4 text-foreground transition-colors hover:text-brand-readable"
							onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
							type="button"
						>
							<Label className="font-display text-foreground text-lg">
								{t("services")}
							</Label>
							<span className="flex h-9 w-9 items-center justify-center">
								<ChevronDown
									className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
								/>
							</span>
						</button>
						{mobileServicesOpen && (
							<div className="mb-2 ml-1 flex flex-col gap-0.5 border-border/40 border-l pl-4">
								{services.map(({ slug, translationKey, icon: Icon }) => (
									<Link
										className="flex items-center gap-3 py-2.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
										href={{
											pathname: "/services/[slug]",
											params: { slug },
										}}
										key={slug}
										onClick={() => setMobileOpen(false)}
									>
										<Icon
											className="h-4 w-4 text-brand-icon"
											strokeWidth={1.5}
										/>
										{ts(`${translationKey}.title`)}
									</Link>
								))}
							</div>
						)}

						<Link
							className="py-4 text-left font-display text-foreground text-lg transition-colors hover:text-brand-readable"
							href={{ pathname: "/", hash: "case-studies" }}
							onClick={(e) => handleNavClick(e, "case-studies")}
						>
							{t("caseStudies")}
						</Link>

						<Link
							className="py-4 text-left font-display text-foreground text-lg transition-colors hover:text-brand-readable"
							href={{ pathname: "/", hash: "blog" }}
							onClick={(e) => handleNavClick(e, "blog")}
						>
							{t("blog")}
						</Link>

						<Link
							className="py-4 text-left font-display text-foreground text-lg transition-colors hover:text-brand-readable"
							href={{ pathname: "/", hash: "pricing" }}
							onClick={(e) => handleNavClick(e, "pricing")}
						>
							{t("pricing")}
						</Link>
					</div>

					<div className="mt-auto space-y-6 border-border/40 border-t pt-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{socials.map((social) => (
									<a
										aria-label={social.name}
										className="flex h-8 w-8 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										href={social.href}
										key={social.name}
										rel="noopener noreferrer"
										target="_blank"
									>
										{social.icon}
									</a>
								))}
							</div>
							<LanguageSwitcher id="lang-mobile" />
						</div>
						<ThemeSwitcher className="w-full justify-start" variant="inline" />
						<Button
							className="[&]:hover:!bg-brand-hover w-full border-transparent bg-brand text-brand-foreground"
							onClick={() => {
								track("cta_clicked", {
									location: "navbar_mobile",
									variant: "get_started",
								});
								setMobileOpen(false);
							}}
							render={
								<Link
									href={{
										pathname: "/",
										hash: "contact",
									}}
								/>
							}
							size="lg"
						>
							{t("getStarted")}
						</Button>
					</div>
				</nav>
			</div>
		</>
	);
}
