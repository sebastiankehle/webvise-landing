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
import IconCloud from "@/components/marketing/icon-cloud";
import {
	MarketingMobileMenuControls,
	MarketingNavbarActions,
	MarketingNavbarCalLink,
	MarketingNavbarCta,
} from "@/components/marketing/marketing-chrome";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import { Body, Caption, Label } from "@/components/ui/typography";
import {
	getOfferingBySlug,
	getOfferingTranslationKey,
	offeringGroups,
} from "@/data/offerings";
import { socials } from "@/data/socials";
import { Link, usePathname } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { cn } from "@/lib/utils";

export interface NavbarPost {
	date: string;
	excerpt: string;
	readingTime: number;
	slug: string;
	tags?: string[];
	title: string;
}

export interface NavbarCaseStudy {
	client: string;
	coverImage?: string;
	excerpt: string;
	kind: "client" | "concept";
	services: string[];
	slug: string;
	title: string;
}

type NavHash = "services" | "case-studies" | "blog";
const dropdownHashes = new Set<NavHash>(["services", "case-studies", "blog"]);
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
	title,
}: {
	children: ReactNode;
	description: string;
	eyebrow: string;
	title: string;
}) {
	return (
		<div className="grid h-[26rem] grid-cols-[minmax(300px,0.9fr)_minmax(0,2.1fr)] overflow-hidden">
			<div className="flex min-h-0 flex-col border-border/40 border-r bg-muted/10 p-6">
				<Caption className="text-brand-readable">{eyebrow}</Caption>
				<Body className="mt-4 max-w-[300px] font-display text-xl leading-snug">
					{title}
				</Body>
				<Body className="mt-5 max-w-[310px] text-muted-foreground text-sm leading-6">
					{description}
				</Body>
			</div>
			<div className="min-h-0 min-w-0">{children}</div>
		</div>
	);
}

function DesktopMegaPanel({ children }: { children: ReactNode }) {
	return <div className="grid h-full grid-cols-3">{children}</div>;
}

function DesktopMegaColumnLink({
	children,
	className,
	description,
	eyebrow,
	href,
	nativeHref,
	onClick,
	titleHoverColor = true,
	title,
}: {
	className?: string;
	children?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	href?: LocalizedLinkHref;
	nativeHref?: string;
	onClick?: LocalizedLinkOnClick;
	titleHoverColor?: boolean;
	title: ReactNode;
}) {
	const mergedClassName = cn(
		desktopMegaLinkClass,
		"flex h-full min-h-0 flex-col p-5",
		className
	);
	const content = (
		<>
			<div className="flex items-start justify-between gap-5">
				{eyebrow && (
					<Caption className="line-clamp-1 text-brand-readable">
						{eyebrow}
					</Caption>
				)}
				<ArrowRight className="size-4 shrink-0 text-brand-icon transition-transform group-hover:translate-x-1" />
			</div>
			<div className="mt-5">
				<Body
					className={cn(
						"line-clamp-2 text-base leading-snug",
						titleHoverColor &&
							"transition-colors group-hover:text-brand-readable"
					)}
				>
					{title}
				</Body>
				{description && (
					<Caption className="mt-3 line-clamp-3 leading-5">
						{description}
					</Caption>
				)}
			</div>
			{children && <div className="mt-auto pt-5">{children}</div>}
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

function DesktopMegaServiceList({
	getOfferingTitle,
	group,
}: {
	getOfferingTitle: (slug: string) => string;
	group: (typeof offeringGroups)[number];
}) {
	return (
		<div className="grid gap-2.5 border-border/40 border-t pt-4">
			{group.items.map((item) => (
				<Caption
					className="flex min-w-0 items-center gap-2.5 text-foreground"
					key={item.slug}
				>
					<span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-brand" />
					<span className="min-w-0 truncate">
						{getOfferingTitle(item.slug)}
					</span>
				</Caption>
			))}
		</div>
	);
}

function DesktopMegaImage({ alt, src }: { alt: string; src?: string }) {
	if (!src) {
		return null;
	}

	return (
		<div className="media-frame relative h-32 bg-muted">
			<Image
				alt={alt}
				className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.02]"
				fill
				quality={95}
				sizes="320px"
				src={src}
			/>
		</div>
	);
}

function DesktopMegaPostMeta({
	minRead,
	post,
}: {
	minRead: string;
	post: NavbarPost;
}) {
	const tags = post.tags?.slice(0, 2).join(" / ");

	return (
		<div className="border-border/40 border-t pt-4">
			{tags && (
				<Caption className="line-clamp-1 text-muted-foreground">{tags}</Caption>
			)}
			<Caption className="mt-2 block text-brand-readable tabular-nums">
				{post.readingTime} {minRead}
			</Caption>
		</div>
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
		{ hash: "services", label: t("services") },
		{ hash: "case-studies", label: t("caseStudies") },
		{ hash: "blog", label: t("blog") },
	];
	const getSectionHref = (hash: string) => homepageSectionHref(hash, locale);
	const desktopDropdownWidthClass = "max-w-[1040px]";
	const getOfferingTitle = (slug: string) => {
		const offering = getOfferingBySlug(slug);

		if (!offering) {
			return slug;
		}

		return offering.kind === "service"
			? ts(`${getOfferingTranslationKey(offering)}.title`)
			: tc(`items.${getOfferingTranslationKey(offering)}.title`);
	};

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
					{activeDropdown === "services" && (
						<DesktopMegaShell
							description={ts("subtitle")}
							eyebrow={t("services")}
							title={ts("title")}
						>
							<DesktopMegaPanel>
								{offeringGroups.map((group, index) => (
									<DesktopMegaColumnLink
										className={cn(
											index < offeringGroups.length - 1 && "border-r"
										)}
										description={ts(`groups.${group.key}.description`)}
										eyebrow={ts(`groups.${group.key}.eyebrow`)}
										key={group.key}
										nativeHref={getSectionHref(`services-${group.key}`)}
										onClick={(e) => handleNavClick(e, `services-${group.key}`)}
										title={ts(`groups.${group.key}.title`)}
									>
										<DesktopMegaServiceList
											getOfferingTitle={getOfferingTitle}
											group={group}
										/>
									</DesktopMegaColumnLink>
								))}
							</DesktopMegaPanel>
						</DesktopMegaShell>
					)}

					{activeDropdown === "case-studies" && (
						<DesktopMegaShell
							description={tcs("subtitle")}
							eyebrow={t("caseStudies")}
							title={tcs("title")}
						>
							<DesktopMegaPanel>
								{featuredCaseStudies.map((cs, i) => (
									<DesktopMegaColumnLink
										className={cn(
											i < featuredCaseStudies.length - 1 && "border-r"
										)}
										description={cs.excerpt}
										eyebrow={
											cs.kind === "concept"
												? tcs("conceptStudyLabel", { client: cs.client })
												: cs.client
										}
										href={{
											pathname: "/case-studies/[slug]",
											params: { slug: cs.slug },
										}}
										key={cs.slug}
										onClick={close}
										title={cs.title}
									>
										<DesktopMegaImage
											alt={`${cs.client} - ${cs.title}`}
											src={cs.coverImage}
										/>
									</DesktopMegaColumnLink>
								))}
							</DesktopMegaPanel>
						</DesktopMegaShell>
					)}

					{activeDropdown === "blog" && (
						<DesktopMegaShell
							description={tb("subtitle")}
							eyebrow={t("blog")}
							title={tb("title")}
						>
							<DesktopMegaPanel>
								{recentPosts.map((post, i) => (
									<DesktopMegaColumnLink
										className={cn(i < recentPosts.length - 1 && "border-r")}
										description={post.excerpt}
										eyebrow={
											<time dateTime={post.date}>
												{new Date(post.date).toLocaleDateString(locale, {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</time>
										}
										href={{
											pathname: "/blog/[slug]",
											params: { slug: post.slug },
										}}
										key={post.slug}
										onClick={close}
										title={post.title}
										titleHoverColor={false}
									>
										<DesktopMegaPostMeta minRead={tb("minRead")} post={post} />
									</DesktopMegaColumnLink>
								))}
							</DesktopMegaPanel>
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
