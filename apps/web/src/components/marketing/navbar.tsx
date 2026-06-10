"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Logo from "@/components/logo";
import CardHoverIcon, {
	type AnimatedIcon,
} from "@/components/marketing/card-hover-icon";
import IconCloud from "@/components/marketing/icon-cloud";
import {
	MarketingMobileMenuControls,
	MarketingNavbarActions,
	MarketingNavbarCalLink,
	MarketingNavbarCta,
} from "@/components/marketing/marketing-chrome";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import { Body, Caption, Label } from "@/components/ui/typography";
import { services } from "@/data/services";
import { socials } from "@/data/socials";
import { customSystems } from "@/data/systems";
import { Link, usePathname } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { cn } from "@/lib/utils";

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

type NavHash = "systems" | "services" | "case-studies" | "blog" | "scope";
const dropdownHashes = new Set<NavHash>([
	"systems",
	"services",
	"case-studies",
	"blog",
	"scope",
]);
const pricingDropdownKeys = ["focused", "system", "support"] as const;
const desktopMegaLinkClass =
	"group border-border/40 outline-none transition-colors hover:bg-muted/40 focus-visible:border-brand/40 focus-visible:ring-1 focus-visible:ring-brand/20";
const mobileMenuFocusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
type LocalizedLinkHref = ComponentProps<typeof Link>["href"];
type LocalizedLinkOnClick = ComponentProps<typeof Link>["onClick"];

function DesktopMegaShell({
	children,
	description,
	eyebrow,
	footer,
	title,
}: {
	children: ReactNode;
	description: string;
	eyebrow: string;
	footer: ReactNode;
	title: string;
}) {
	return (
		<div className="grid grid-cols-[minmax(230px,0.74fr)_minmax(0,1.56fr)] overflow-hidden">
			<div className="flex flex-col border-border/40 border-r bg-muted/10 p-5">
				<Caption className="text-brand-readable">{eyebrow}</Caption>
				<Body className="mt-2 max-w-[280px] leading-snug">{title}</Body>
				<Caption className="mt-3 block max-w-[300px] leading-relaxed">
					{description}
				</Caption>
			</div>
			<div className="min-w-0">{children}</div>
			<div className="col-span-full border-border/40 border-t">{footer}</div>
		</div>
	);
}

function DesktopMegaFooterLink({
	href,
	label,
	nativeHref,
	onClick,
}: {
	href?: LocalizedLinkHref;
	label: string;
	nativeHref?: string;
	onClick?: LocalizedLinkOnClick;
}) {
	const className = cn(
		desktopMegaLinkClass,
		"flex items-center justify-between bg-muted/10 px-5 py-4"
	);
	const content = (
		<>
			<Caption className="text-brand-readable">{label}</Caption>
			<ArrowRight className="h-3 w-3 text-brand-readable transition-transform group-hover:translate-x-0.5" />
		</>
	);

	if (nativeHref) {
		return (
			<a className={className} href={nativeHref} onClick={onClick}>
				{content}
			</a>
		);
	}

	return (
		<Link className={className} href={href ?? "/"} onClick={onClick}>
			{content}
		</Link>
	);
}

function DesktopMegaIconLink({
	className,
	description,
	href,
	icon,
	onClick,
	title,
}: {
	className?: string;
	description: ReactNode;
	href: LocalizedLinkHref;
	icon: AnimatedIcon;
	onClick?: LocalizedLinkOnClick;
	title: ReactNode;
}) {
	return (
		<Link
			className={cn(
				desktopMegaLinkClass,
				"flex items-start gap-3 p-4",
				className
			)}
			href={href}
			onClick={onClick}
		>
			<CardHoverIcon
				className="mt-0.5 shrink-0 text-brand-icon"
				icon={icon}
				size={16}
			/>
			<div className="min-w-0">
				<Body className="text-sm transition-colors group-hover:text-brand-readable">
					{title}
				</Body>
				<Caption className="mt-1 line-clamp-3 block leading-relaxed">
					{description}
				</Caption>
			</div>
		</Link>
	);
}

function DesktopMegaTextLink({
	className,
	description,
	eyebrow,
	footer,
	href,
	nativeHref,
	onClick,
	title,
}: {
	className?: string;
	description?: ReactNode;
	eyebrow?: ReactNode;
	footer: ReactNode;
	href?: LocalizedLinkHref;
	nativeHref?: string;
	onClick?: LocalizedLinkOnClick;
	title: ReactNode;
}) {
	const mergedClassName = cn(
		desktopMegaLinkClass,
		"flex min-h-40 flex-col justify-between p-4",
		className
	);
	const content = (
		<>
			<div>
				{eyebrow && <Caption>{eyebrow}</Caption>}
				<Body className="mt-1.5 text-sm leading-snug transition-colors group-hover:text-brand-readable">
					{title}
				</Body>
				{description && (
					<Caption className="mt-2 line-clamp-4 block leading-relaxed">
						{description}
					</Caption>
				)}
			</div>
			<div className="mt-6 flex items-end justify-between gap-4 border-border/40 border-t pt-3">
				<Caption className="block text-brand-readable">{footer}</Caption>
				<ArrowRight className="h-3 w-3 shrink-0 text-brand-readable opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
			</div>
		</>
	);

	if (nativeHref) {
		return (
			<a className={mergedClassName} href={nativeHref} onClick={onClick}>
				{content}
			</a>
		);
	}

	return (
		<Link className={mergedClassName} href={href ?? "/"} onClick={onClick}>
			{content}
		</Link>
	);
}

function DesktopMegaMediaLink({
	className,
	href,
	imageAlt,
	imageSrc,
	meta,
	onClick,
	title,
}: {
	className?: string;
	href: LocalizedLinkHref;
	imageAlt: string;
	imageSrc?: string;
	meta: ReactNode;
	onClick?: LocalizedLinkOnClick;
	title: ReactNode;
}) {
	return (
		<Link
			className={cn(desktopMegaLinkClass, "flex min-h-48 flex-col", className)}
			href={href}
			onClick={onClick}
		>
			<div className="relative aspect-[16/9] w-full overflow-hidden border-border/40 border-b bg-muted/25">
				{imageSrc && (
					<Image
						alt={imageAlt}
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						fill
						sizes="(max-width: 768px) 100vw, 240px"
						src={imageSrc}
					/>
				)}
			</div>
			<div className="flex flex-1 flex-col p-4">
				<Caption>{meta}</Caption>
				<Body className="mt-1.5 text-sm leading-snug transition-colors group-hover:text-brand-readable">
					{title}
				</Body>
			</div>
		</Link>
	);
}

function MobileMenuIcon({ open }: { open: boolean }) {
	return (
		<div className="flex w-[18px] flex-col gap-[5px]">
			<span
				className={`block h-[1.5px] w-full origin-center bg-current transition-all duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
			/>
			<span
				className={`block h-[1.5px] w-full bg-current transition-all duration-300 ${open ? "scale-x-0 opacity-0" : ""}`}
			/>
			<span
				className={`block h-[1.5px] w-full origin-center bg-current transition-all duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
			/>
		</div>
	);
}

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
	const closeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const dropdownRef = useRef<HTMLElement>(null);
	const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const mobileOpenButtonRef = useRef<HTMLButtonElement>(null);
	const pendingMobileScrollHashRef = useRef<string | null>(null);
	const restoreMobileFocusRef = useRef(false);
	const skipScrollRestoreRef = useRef(false);
	const mobileMenuTitleId = "marketing-mobile-menu-title";
	const t = useTranslations("nav");
	const tc = useTranslations("customSystems");
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
		if (!mobileOpen) {
			return;
		}

		const scrollY = window.scrollY;
		const originalRootOverflow = document.documentElement.style.overflow;
		const originalBodyStyles = {
			left: document.body.style.left,
			overflow: document.body.style.overflow,
			position: document.body.style.position,
			right: document.body.style.right,
			top: document.body.style.top,
			width: document.body.style.width,
		};

		document.documentElement.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.left = "0";
		document.body.style.right = "0";
		document.body.style.width = "100%";
		document.body.style.overflow = "hidden";

		return () => {
			const shouldRestoreScroll = !skipScrollRestoreRef.current;
			skipScrollRestoreRef.current = false;

			document.documentElement.style.overflow = originalRootOverflow;
			document.body.style.position = originalBodyStyles.position;
			document.body.style.top = originalBodyStyles.top;
			document.body.style.left = originalBodyStyles.left;
			document.body.style.right = originalBodyStyles.right;
			document.body.style.width = originalBodyStyles.width;
			document.body.style.overflow = originalBodyStyles.overflow;

			if (shouldRestoreScroll) {
				window.scrollTo(0, scrollY);
				window.requestAnimationFrame(() => {
					window.scrollTo(0, scrollY);
					window.requestAnimationFrame(() => {
						window.scrollTo(0, scrollY);
					});
				});
			}
		};
	}, [mobileOpen]);

	const closeMobileMenu = useCallback(
		({ restoreScroll = true }: { restoreScroll?: boolean } = {}) => {
			skipScrollRestoreRef.current = !restoreScroll;
			restoreMobileFocusRef.current = true;
			setMobileOpen(false);
		},
		[]
	);

	useEffect(() => {
		if (mobileOpen) {
			return;
		}

		const hash = pendingMobileScrollHashRef.current;
		if (!hash) {
			return;
		}

		pendingMobileScrollHashRef.current = null;
		const frame = window.requestAnimationFrame(() => {
			document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
		});

		return () => window.cancelAnimationFrame(frame);
	}, [mobileOpen]);

	useEffect(() => {
		const backgroundElements = [
			document.querySelector<HTMLElement>('a[href="#main-content"]'),
			document.getElementById("main-content"),
			document.querySelector<HTMLElement>("footer"),
			...document.querySelectorAll<HTMLElement>("[data-marketing-floating]"),
		];

		for (const element of backgroundElements) {
			if (!element) {
				continue;
			}
			if (mobileOpen) {
				element.setAttribute("aria-hidden", "true");
				element.setAttribute("inert", "");
			} else {
				element.removeAttribute("aria-hidden");
				element.removeAttribute("inert");
			}
		}

		return () => {
			for (const element of backgroundElements) {
				element?.removeAttribute("aria-hidden");
				element?.removeAttribute("inert");
			}
		};
	}, [mobileOpen]);

	useEffect(() => {
		if (!mobileOpen) {
			return;
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") {
				return;
			}

			const menu = mobileMenuRef.current;
			if (!menu) {
				return;
			}

			const focusable = Array.from(
				menu.querySelectorAll<HTMLElement>(mobileMenuFocusableSelector)
			).filter((element) => element.offsetParent !== null);
			const first = focusable.at(0);
			const last = focusable.at(-1);
			if (!(first && last)) {
				return;
			}

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
				return;
			}

			if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [mobileOpen]);

	useEffect(() => {
		if (!mobileOpen) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			mobileCloseButtonRef.current?.focus({ preventScroll: true });
		});

		return () => window.cancelAnimationFrame(frame);
	}, [mobileOpen]);

	useEffect(() => {
		if (mobileOpen || !restoreMobileFocusRef.current) {
			return;
		}

		restoreMobileFocusRef.current = false;
		const frame = window.requestAnimationFrame(() => {
			mobileOpenButtonRef.current?.focus({ preventScroll: true });
		});

		return () => window.cancelAnimationFrame(frame);
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
				closeMobileMenu();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [closeMobileMenu]);

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
			if (pathname === "/") {
				e.preventDefault();
				if (mobileOpen) {
					pendingMobileScrollHashRef.current = hash;
					closeMobileMenu({ restoreScroll: false });
				} else {
					const el = document.getElementById(hash);
					if (el) {
						el.scrollIntoView({ behavior: "smooth" });
					}
				}
			} else {
				closeMobileMenu();
			}
		},
		[pathname, mobileOpen, close, closeMobileMenu]
	);

	const navLinks: { hash: NavHash; label: string }[] = [
		{ hash: "systems", label: t("systems") },
		{ hash: "services", label: t("services") },
		{ hash: "case-studies", label: t("caseStudies") },
		{ hash: "scope", label: t("pricing") },
		{ hash: "blog", label: t("blog") },
	];
	const getSectionHref = (hash: string) => homepageSectionHref(hash, locale);
	const desktopDropdownWidthClass = "max-w-[1040px]";

	return (
		<>
			<header
				aria-hidden={mobileOpen ? true : undefined}
				className="sticky top-0 z-50 border-grid-line border-b bg-background"
				inert={mobileOpen ? true : undefined}
			>
				<div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 md:h-20">
					<div className="flex items-center md:flex-1">
						<Link
							aria-label={t("aria.home")}
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
							<Label className="font-display text-foreground text-xl">
								webvise
							</Label>
						</Link>
					</div>

					<nav
						aria-label={t("aria.main")}
						className="hidden h-full items-center gap-1 md:flex"
					>
						{navLinks.map(({ hash, label }) => (
							<a
								aria-expanded={activeDropdown === hash}
								aria-haspopup={dropdownHashes.has(hash) ? "menu" : undefined}
								className={`relative inline-flex h-full items-center border border-transparent px-4 text-sm outline-none transition-colors hover:text-foreground focus-visible:bg-muted/40 focus-visible:text-foreground ${
									activeDropdown === hash
										? "text-foreground"
										: "text-muted-foreground"
								}`}
								href={getSectionHref(hash)}
								key={hash}
								onClick={(e) => handleNavClick(e, hash)}
								onFocus={() => dropdownHashes.has(hash) && open(hash)}
								onMouseEnter={() => dropdownHashes.has(hash) && open(hash)}
								onMouseLeave={() => dropdownHashes.has(hash) && scheduleClose()}
							>
								{label}
								{activeDropdown === hash && (
									<span className="absolute right-4 bottom-0 left-4 h-px bg-brand" />
								)}
							</a>
						))}
					</nav>

					<div className="hidden md:flex md:flex-1 md:items-center md:justify-end">
						<MarketingNavbarActions
							bookCallLabel={t("bookCall")}
							ctaLabel={t("getStarted")}
						/>
					</div>

					<button
						aria-controls="marketing-mobile-menu"
						aria-expanded={mobileOpen}
						aria-label={mobileOpen ? t("aria.closeMenu") : t("aria.openMenu")}
						className="flex h-9 w-9 items-center justify-center border border-transparent outline-none focus-visible:border-brand/40 focus-visible:ring-1 focus-visible:ring-brand/20 md:hidden"
						onClick={() => setMobileOpen(!mobileOpen)}
						ref={mobileOpenButtonRef}
						type="button"
					>
						<MobileMenuIcon open={mobileOpen} />
					</button>
				</div>
			</header>

			{activeDropdown && (
				<button
					aria-label={t("aria.closeMenu")}
					className="fixed inset-0 z-30 hidden cursor-default transition-opacity duration-200 md:block"
					onClick={close}
					onMouseEnter={close}
					tabIndex={-1}
					type="button"
				/>
			)}

			<nav
				aria-label={t("aria.sectionPreview")}
				className={`pointer-events-none fixed top-16 right-0 left-0 z-40 hidden justify-center px-6 md:top-20 md:flex ${
					activeDropdown
						? "*:pointer-events-auto *:translate-y-0 *:opacity-100"
						: "*:pointer-events-none *:-translate-y-2 *:opacity-0"
				}`}
				ref={dropdownRef}
			>
				<div
					className={cn(
						"w-full overflow-hidden rounded-2xl border border-border/40 bg-popover shadow-xl transition-all duration-200 ease-out",
						desktopDropdownWidthClass
					)}
				>
					{activeDropdown === "systems" && (
						<DesktopMegaShell
							description={tc("subtitle")}
							eyebrow={t("systems")}
							footer={
								<DesktopMegaFooterLink
									label={tc("detailLink")}
									nativeHref={getSectionHref("systems")}
									onClick={(e) => handleNavClick(e, "systems")}
								/>
							}
							title={tc("title")}
						>
							<div className="grid grid-cols-6">
								{customSystems.map((system, i) => (
									<DesktopMegaIconLink
										className={cn(
											i < 2 ? "col-span-3 border-b" : "col-span-2",
											i === 0 && "border-r",
											i >= 2 && i < customSystems.length - 1 && "border-r"
										)}
										description={tc(
											`items.${system.translationKey}.description`
										)}
										href={{
											pathname: "/systems/[slug]",
											params: { slug: system.slug },
										}}
										icon={system.icon}
										key={system.slug}
										onClick={close}
										title={tc(`items.${system.translationKey}.title`)}
									/>
								))}
							</div>
						</DesktopMegaShell>
					)}

					{activeDropdown === "services" && (
						<DesktopMegaShell
							description={ts("subtitle")}
							eyebrow={t("services")}
							footer={
								<DesktopMegaFooterLink
									label={ts("viewAll")}
									nativeHref={getSectionHref("services")}
									onClick={(e) => handleNavClick(e, "services")}
								/>
							}
							title={ts("title")}
						>
							<div className="grid grid-cols-3">
								{services.map((service, i) => (
									<DesktopMegaIconLink
										className={cn(
											i < 3 && "border-b",
											i % 3 !== 2 && "border-r"
										)}
										description={ts(`${service.translationKey}.tagline`)}
										href={{
											pathname: "/services/[slug]",
											params: { slug: service.slug },
										}}
										icon={service.icon}
										key={service.slug}
										onClick={close}
										title={ts(`${service.translationKey}.title`)}
									/>
								))}
							</div>
						</DesktopMegaShell>
					)}

					{activeDropdown === "case-studies" && (
						<DesktopMegaShell
							description={tcs("subtitle")}
							eyebrow={t("caseStudies")}
							footer={
								<DesktopMegaFooterLink
									href="/case-studies"
									label={tcs("viewAll")}
									onClick={close}
								/>
							}
							title={tcs("title")}
						>
							<div className="grid grid-cols-3">
								{featuredCaseStudies.map((cs, i) => (
									<DesktopMegaMediaLink
										className={cn(i < 2 && "border-r")}
										href={{
											pathname: "/case-studies/[slug]",
											params: { slug: cs.slug },
										}}
										imageAlt={cs.title}
										imageSrc={cs.coverImage}
										key={cs.slug}
										meta={cs.client}
										onClick={close}
										title={cs.title}
									/>
								))}
							</div>
						</DesktopMegaShell>
					)}

					{activeDropdown === "blog" && (
						<DesktopMegaShell
							description={tb("subtitle")}
							eyebrow={t("blog")}
							footer={
								<DesktopMegaFooterLink
									href="/blog"
									label={tb("viewAll")}
									onClick={close}
								/>
							}
							title={tb("title")}
						>
							<div className="grid grid-cols-3">
								{recentPosts.map((post, i) => (
									<DesktopMegaTextLink
										className={cn(i < 2 && "border-r")}
										eyebrow={
											<time dateTime={post.date}>
												{new Date(post.date).toLocaleDateString(locale, {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</time>
										}
										footer={`${post.readingTime} ${tb("minRead")}`}
										href={{
											pathname: "/blog/[slug]",
											params: { slug: post.slug },
										}}
										key={post.slug}
										onClick={close}
										title={post.title}
									/>
								))}
							</div>
						</DesktopMegaShell>
					)}

					{activeDropdown === "scope" && (
						<DesktopMegaShell
							description={tpr("subtitle")}
							eyebrow={t("pricing")}
							footer={
								<DesktopMegaFooterLink
									label={tpr("secondaryCta")}
									nativeHref={getSectionHref("scope")}
									onClick={(e) => handleNavClick(e, "scope")}
								/>
							}
							title={tpr("title")}
						>
							<div className="grid grid-cols-3">
								{pricingDropdownKeys.map((key, i) => (
									<DesktopMegaTextLink
										className={cn(
											i < pricingDropdownKeys.length - 1 && "border-r"
										)}
										description={tpr(`tiers.${key}.description`)}
										footer={tpr(`tiers.${key}.scope`)}
										key={key}
										nativeHref={getSectionHref("scope")}
										onClick={(e) => handleNavClick(e, "scope")}
										title={tpr(`tiers.${key}.name`)}
									/>
								))}
							</div>
						</DesktopMegaShell>
					)}
				</div>
			</nav>

			<div
				aria-hidden={mobileOpen ? undefined : true}
				aria-labelledby={mobileMenuTitleId}
				aria-modal={mobileOpen ? true : undefined}
				className={`fixed inset-0 z-[80] overflow-hidden overscroll-contain bg-background text-foreground transition-opacity duration-300 md:hidden ${
					mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				id="marketing-mobile-menu"
				inert={mobileOpen ? undefined : true}
				ref={mobileMenuRef}
				role="dialog"
			>
				<div className="relative flex h-full flex-col">
					<h2 className="sr-only" id={mobileMenuTitleId}>
						{t("aria.mobile")}
					</h2>
					<div className="shrink-0 border-grid-line border-b bg-background">
						<div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
							<Link
								aria-label={t("aria.home")}
								className="flex items-center gap-2.5"
								href="/"
								onClick={(e) => {
									closeMobileMenu();
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
								<Label className="font-display text-foreground text-xl">
									webvise
								</Label>
							</Link>

							<button
								aria-controls="marketing-mobile-menu"
								aria-label={t("aria.closeMenu")}
								className="flex h-9 w-9 items-center justify-center border border-transparent outline-none focus-visible:border-brand/40 focus-visible:ring-1 focus-visible:ring-brand/20 md:hidden"
								onClick={() => closeMobileMenu()}
								ref={mobileCloseButtonRef}
								type="button"
							>
								<MobileMenuIcon open={mobileOpen} />
							</button>
						</div>
					</div>

					{/* Decorative icon cloud mirrors hero placement, non-interactive */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-28 right-[-24px]"
					>
						<div className="h-[220px] w-[180px]">
							{mobileOpen && <IconCloud />}
						</div>
					</div>
					<nav
						aria-label={t("aria.mobile")}
						className="relative mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col overflow-y-auto overscroll-contain px-6 pt-6 pb-6"
					>
						<div className="flex flex-col">
							{navLinks.map(({ hash, label }) => (
								<a
									className="-mx-1 flex items-center border border-transparent px-1 py-4 outline-none transition-colors focus-visible:border-brand/40 focus-visible:ring-1 focus-visible:ring-brand/20"
									href={getSectionHref(hash)}
									key={hash}
									onClick={(e) => handleNavClick(e, hash)}
								>
									<Label className="font-display text-foreground text-lg">
										{label}
									</Label>
								</a>
							))}
						</div>

						<div className="mt-auto space-y-6 border-border/40 border-t pt-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{socials.map((social) => (
										<SocialIconButton
											href={social.href}
											key={social.name}
											label={social.name}
										>
											{social.icon}
										</SocialIconButton>
									))}
								</div>
								<MarketingMobileMenuControls />
							</div>
							<div className="flex flex-col gap-3">
								<MarketingNavbarCalLink
									className="w-full"
									location="navbar_mobile"
									onClick={() => closeMobileMenu()}
									size="lg"
								>
									{t("bookCall")}
								</MarketingNavbarCalLink>
								<MarketingNavbarCta
									className="w-full"
									location="navbar_mobile"
									onClick={() => closeMobileMenu()}
									size="lg"
								>
									{t("getStarted")}
								</MarketingNavbarCta>
							</div>
						</div>
					</nav>
				</div>
			</div>
		</>
	);
}
