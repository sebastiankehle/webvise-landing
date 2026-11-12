"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
	Fragment,
	type MouseEvent,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

import Logo from "@/components/logo";
import { ActionArrow, ActionLink } from "@/components/marketing/action";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import { SocialIconButton } from "@/components/marketing/social-icon-button";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { socials } from "@/data/socials";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface NavbarIndustry {
	image?: string;
	line: string;
	name: string;
	slug: string;
}

export interface NavbarProject {
	client: string;
	image?: string;
	industry: string;
	slug: string;
}

type MenuKey = "industries" | "services" | "work";

const MENUS = ["work", "services", "industries"] as const;
const MENU_HOME = {
	industries: "/industries",
	services: "/services",
	work: "/case-studies",
} as const;
/** Projects shown with a picture in the menu; the rest follow as a list. */
const FEATURED_PROJECTS = 6;

export interface NavbarServiceGroup {
	image: string;
	items: { slug: string; title: string }[];
	key: string;
	line: string;
	title: string;
}

interface NavbarLabels {
	about: string;
	blog: string;
	bookCall: string;
	closeMenu: string;
	home: string;
	industries: string;
	main: string;
	menuAll: string;
	menuAllIndustries: string;
	menuAllWork: string;
	menuMoreWork: string;
	menuPrompt: string;
	menuPromptCta: string;
	mobile: string;
	openMenu: string;
	services: string;
	work: string;
}

const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const navLinkClassName =
	"inline-flex h-full items-center whitespace-nowrap px-2.5 text-muted-foreground text-sm lg:px-3.5 outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-8 aria-[current=page]:text-foreground";

const panelItemClassName =
	"block rounded-[12px] px-3 py-2.5 outline-none transition-colors duration-150 hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] data-[active=true]:bg-foreground/[0.05]";
const panelPreviewClassName =
	"relative min-h-[17rem] overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]";

const panelLinkClassName =
	"text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:decoration-foreground";

const mobileLinkClassName =
	"block py-3 font-display text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] outline-none focus-visible:underline";

function Wordmark({
	label,
	onClick,
}: {
	label: string;
	onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
	return (
		<Link
			aria-label={label}
			className="flex items-center gap-2 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background lg:justify-self-start"
			href="/"
			onClick={onClick}
		>
			<Logo animated className="size-7" />
			<span className="font-display text-xl leading-none tracking-[-0.035em]">
				webvise
			</span>
		</Link>
	);
}

/** The large picture beside a menu's list. It shows the page's top-left
 * corner at a size where the screen can be read, and fades when it changes. */
function MenuPreview({ image }: { image?: string }) {
	return (
		<div className={panelPreviewClassName}>
			{image && (
				<Image
					alt=""
					className="fade-in animate-in object-cover object-left-top duration-200 ease-out motion-reduce:animate-none"
					fill
					key={image}
					sizes="420px"
					src={image}
				/>
			)}
		</div>
	);
}

function MenuIcon({ open }: { open: boolean }) {
	return (
		<span aria-hidden="true" className="flex w-[18px] flex-col gap-[5px]">
			<span
				className={cn(
					"block h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ease-out",
					open && "translate-y-[6.5px] rotate-45"
				)}
			/>
			<span
				className={cn(
					"block h-[1.5px] w-full bg-current transition-opacity duration-200 ease-out",
					open && "opacity-0"
				)}
			/>
			<span
				className={cn(
					"block h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ease-out",
					open && "-translate-y-[6.5px] -rotate-45"
				)}
			/>
		</span>
	);
}

export default function NavbarShell({
	groups,
	industries,
	labels,
	projects,
}: {
	groups: NavbarServiceGroup[];
	industries: NavbarIndustry[];
	labels: NavbarLabels;
	projects: NavbarProject[];
}) {
	const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	// The row under the pointer or the focus decides the large picture beside the list.
	const [previewIndustry, setPreviewIndustry] = useState(industries[0]?.slug);
	const [previewProject, setPreviewProject] = useState(projects[0]?.slug);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);
	const buttonRefs = useRef<Record<MenuKey, HTMLButtonElement | null>>({
		industries: null,
		services: null,
		work: null,
	});
	const panelRefs = useRef<Record<MenuKey, HTMLDivElement | null>>({
		industries: null,
		services: null,
		work: null,
	});
	// A hover has already opened the panel when the click of the same gesture
	// arrives (always on touch), so that click must not close it again.
	const openedByHover = useRef(false);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const mobileToggleRef = useRef<HTMLButtonElement>(null);
	const panelId = useId();
	const mobileMenuId = useId();
	const pathname = usePathname();

	const openPanel = useCallback((key: MenuKey) => {
		clearTimeout(closeTimer.current);
		setOpenMenu(key);
	}, []);

	const keepOpen = useCallback(() => clearTimeout(closeTimer.current), []);

	const scheduleClose = useCallback(() => {
		clearTimeout(closeTimer.current);
		closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
	}, []);

	const closeMenus = useCallback(() => {
		clearTimeout(closeTimer.current);
		openedByHover.current = false;
		setOpenMenu(null);
	}, []);

	const toggleMenu = (key: MenuKey) => {
		if (openMenu === key && !openedByHover.current) {
			closeMenus();
			return;
		}
		openedByHover.current = false;
		openPanel(key);
	};

	// The pointer may travel from a trigger into its panel without closing it.
	useEffect(() => {
		const panels = Object.values(panelRefs.current).filter(
			(panel) => panel !== null
		);
		for (const panel of panels) {
			panel.addEventListener("mouseenter", keepOpen);
			panel.addEventListener("mouseleave", scheduleClose);
		}
		return () => {
			for (const panel of panels) {
				panel.removeEventListener("mouseenter", keepOpen);
				panel.removeEventListener("mouseleave", scheduleClose);
			}
		};
	}, [keepOpen, scheduleClose]);

	// The panel closes once focus moves on to anything outside it.
	useEffect(() => {
		if (!openMenu) {
			return;
		}
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target as Node | null;
			if (
				target &&
				!panelRefs.current[openMenu]?.contains(target) &&
				!buttonRefs.current[openMenu]?.contains(target)
			) {
				closeMenus();
			}
		};
		document.addEventListener("focusin", onFocusIn);
		return () => document.removeEventListener("focusin", onFocusIn);
	}, [openMenu, closeMenus]);

	// Any navigation closes both menus.
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
	useEffect(() => {
		closeMenus();
		setMobileOpen(false);
	}, [pathname, closeMenus]);

	useEffect(() => {
		if (!(openMenu || mobileOpen)) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") {
				return;
			}
			if (openMenu) {
				buttonRefs.current[openMenu]?.focus();
				closeMenus();
			}
			if (mobileOpen) {
				setMobileOpen(false);
				mobileToggleRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [openMenu, mobileOpen, closeMenus]);

	// The mobile menu only exists below the desktop breakpoint. Crossing it
	// (rotation, resize) must release the page lock.
	useEffect(() => {
		if (!mobileOpen) {
			return;
		}
		const desktop = window.matchMedia("(min-width: 1024px)");
		const onChange = () => {
			if (desktop.matches) {
				setMobileOpen(false);
			}
		};
		onChange();
		desktop.addEventListener("change", onChange);
		return () => desktop.removeEventListener("change", onChange);
	}, [mobileOpen]);

	// The logo leads home. On the homepage itself a link to the same address
	// does not move the page, so it scrolls back to the top instead.
	const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
		setMobileOpen(false);
		const newTab =
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey;
		if (pathname !== "/" || newTab) {
			return;
		}
		event.preventDefault();
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		// One frame later, once the menu has let go of the page
		requestAnimationFrame(() =>
			window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
		);
	};

	// Mobile menu: lock the page behind it and keep focus inside.
	useEffect(() => {
		if (!mobileOpen) {
			return;
		}

		const root = document.documentElement;
		const { overflow, paddingRight } = root.style;
		// Hiding a classic scrollbar widens the page. Padding by its width keeps
		// the header, and the menu button in it, where they were.
		root.style.paddingRight = `${window.innerWidth - root.clientWidth}px`;
		root.style.overflow = "hidden";
		const background = [
			document.getElementById("main-content"),
			document.querySelector<HTMLElement>("footer"),
			...document.querySelectorAll<HTMLElement>("[data-marketing-floating]"),
		];
		for (const element of background) {
			element?.setAttribute("inert", "");
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Tab") {
				return;
			}
			const scope = mobileMenuRef.current?.closest("header");
			if (!scope) {
				return;
			}
			const focusable = Array.from(
				scope.querySelectorAll<HTMLElement>(focusableSelector)
			).filter((element) => element.offsetParent !== null);
			const first = focusable.at(0);
			const last = focusable.at(-1);
			if (!(first && last)) {
				return;
			}
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);

		return () => {
			root.style.overflow = overflow;
			root.style.paddingRight = paddingRight;
			for (const element of background) {
				element?.removeAttribute("inert");
			}
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [mobileOpen]);

	const menuLabels: Record<MenuKey, string> = {
		industries: labels.industries,
		services: labels.services,
		work: labels.work,
	};
	const menuAllLabels: Record<MenuKey, string> = {
		industries: labels.menuAllIndustries,
		services: labels.menuAll,
		work: labels.menuAllWork,
	};

	const isCurrent = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header className="sticky top-0 z-50 bg-background">
			<div className="relative border-grid-line border-b">
				<div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-6 lg:grid lg:h-[72px] lg:grid-cols-[1fr_auto_1fr]">
					<Wordmark label={labels.home} onClick={goHome} />

					<nav
						aria-label={labels.main}
						className="hidden h-full items-center lg:flex"
					>
						{MENUS.map((key) => (
							<Fragment key={key}>
								<button
									aria-controls={`${panelId}-${key}`}
									aria-expanded={openMenu === key}
									className={cn(
										navLinkClassName,
										"gap-1",
										(openMenu === key || isCurrent(MENU_HOME[key])) &&
											"text-foreground"
									)}
									onClick={() => toggleMenu(key)}
									onMouseEnter={() => {
										if (openMenu !== key) {
											openedByHover.current = true;
										}
										openPanel(key);
									}}
									onMouseLeave={scheduleClose}
									ref={(node) => {
										buttonRefs.current[key] = node;
									}}
									type="button"
								>
									{menuLabels[key]}
									<ChevronDown
										aria-hidden="true"
										className={cn(
											"size-3.5 transition-transform duration-200 ease-out",
											openMenu === key && "rotate-180"
										)}
									/>
								</button>
								{/* The panel: a card hung under the bar, placed after its button
								    so Tab reaches it next. All three share one build: pictures
								    first, then the same foot. The strip around the card lets
								    clicks through to the page. */}
								<div
									className={cn(
										"pointer-events-none absolute inset-x-0 top-full hidden px-6 pt-2",
										openMenu === key &&
											"fade-in slide-in-from-top-1 animate-in duration-200 ease-out motion-reduce:animate-none lg:block"
									)}
									id={`${panelId}-${key}`}
								>
									<div
										className="pointer-events-auto mx-auto max-w-[1040px] overflow-hidden rounded-[20px] bg-card shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_32px_64px_-24px_rgba(14,18,23,0.35),0_12px_24px_-16px_rgba(14,18,23,0.2)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
										ref={(node) => {
											panelRefs.current[key] = node;
										}}
									>
										{key === "services" && (
											<div className="grid grid-cols-3 gap-x-3 p-3">
												{groups.map((group) => (
													<div key={group.key}>
														<div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)]">
															<Image
																alt=""
																className="object-cover"
																fill
																sizes="340px"
																src={group.image}
															/>
														</div>
														<div className="px-2 pt-4 pb-1">
															<p className="font-medium text-base text-foreground">
																{group.title}
															</p>
															<p className="mt-0.5 text-muted-foreground text-sm leading-6">
																{group.line}
															</p>
															<ul className="mt-3">
																{group.items.map((item) => (
																	<li key={item.slug}>
																		<Link
																			className="-mx-2 block rounded-sm px-2 py-1.5 text-base text-foreground outline-none transition-colors duration-150 hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05]"
																			href={{
																				pathname: "/services/[slug]",
																				params: { slug: item.slug },
																			}}
																			onClick={closeMenus}
																		>
																			{item.title}
																		</Link>
																	</li>
																))}
															</ul>
														</div>
													</div>
												))}
											</div>
										)}
										{key === "industries" && (
											<div className="grid grid-cols-[1fr_20rem] gap-x-3 p-3 lg:grid-cols-[1fr_26rem]">
												<div className="grid grid-cols-2 content-start gap-1">
													{industries.map((industry) => (
														<Link
															className={panelItemClassName}
															data-active={industry.slug === previewIndustry}
															href={{
																pathname: "/industries/[slug]",
																params: { slug: industry.slug },
															}}
															key={industry.slug}
															onClick={closeMenus}
															onFocus={() => setPreviewIndustry(industry.slug)}
															onMouseEnter={() =>
																setPreviewIndustry(industry.slug)
															}
														>
															<span className="block font-medium text-base text-foreground">
																{industry.name}
															</span>
															<span className="mt-0.5 line-clamp-2 block text-muted-foreground text-sm leading-5">
																{industry.line}
															</span>
														</Link>
													))}
												</div>
												<MenuPreview
													image={
														industries.find(
															(industry) => industry.slug === previewIndustry
														)?.image
													}
												/>
											</div>
										)}
										{key === "work" && (
											<div className="grid grid-cols-[1fr_20rem] gap-x-3 p-3 lg:grid-cols-[1fr_10rem_22rem]">
												<div className="grid grid-cols-2 content-start gap-1">
													{projects
														.slice(0, FEATURED_PROJECTS)
														.map((project) => (
															<Link
																className={panelItemClassName}
																data-active={project.slug === previewProject}
																href={{
																	pathname: "/case-studies/[slug]",
																	params: { slug: project.slug },
																}}
																key={project.slug}
																onClick={closeMenus}
																onFocus={() => setPreviewProject(project.slug)}
																onMouseEnter={() =>
																	setPreviewProject(project.slug)
																}
															>
																<span className="block truncate font-medium text-base text-foreground">
																	{project.client}
																</span>
																<span className="mt-0.5 block truncate text-muted-foreground text-sm">
																	{project.industry}
																</span>
															</Link>
														))}
												</div>
												<div className="hidden border-foreground/[0.07] border-l py-2 pr-1 pl-4 lg:block">
													<p className="px-2 text-muted-foreground text-sm">
														{labels.menuMoreWork}
													</p>
													<ul className="mt-1.5">
														{projects
															.slice(FEATURED_PROJECTS)
															.map((project) => (
																<li key={project.slug}>
																	<Link
																		className="block rounded-sm px-2 py-1.5 text-base text-foreground outline-none transition-colors duration-150 hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] data-[active=true]:bg-foreground/[0.05]"
																		data-active={
																			project.slug === previewProject
																		}
																		href={{
																			pathname: "/case-studies/[slug]",
																			params: { slug: project.slug },
																		}}
																		onClick={closeMenus}
																		onFocus={() =>
																			setPreviewProject(project.slug)
																		}
																		onMouseEnter={() =>
																			setPreviewProject(project.slug)
																		}
																	>
																		{project.client}
																	</Link>
																</li>
															))}
													</ul>
												</div>
												<MenuPreview
													image={
														projects.find(
															(project) => project.slug === previewProject
														)?.image
													}
												/>
											</div>
										)}
										{/* The card's foot: a way out for the undecided, and the overview */}
										<div className="flex items-center justify-between gap-6 border-foreground/[0.07] border-t bg-foreground/[0.025] px-5 py-3.5 text-sm">
											<p className="text-muted-foreground">
												{labels.menuPrompt}{" "}
												<Link
													className={panelLinkClassName}
													href="/book"
													onClick={closeMenus}
												>
													{labels.menuPromptCta}
												</Link>
											</p>
											<Link
												className="group/arrow inline-flex items-center gap-1.5 font-medium text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
												href={MENU_HOME[key]}
												onClick={closeMenus}
											>
												{menuAllLabels[key]}
												<ActionArrow />
											</Link>
										</div>
									</div>
								</div>
							</Fragment>
						))}
						<Link
							aria-current={isCurrent("/about") ? "page" : undefined}
							className={navLinkClassName}
							href="/about"
						>
							{labels.about}
						</Link>
						<Link
							aria-current={isCurrent("/blog") ? "page" : undefined}
							className={navLinkClassName}
							href="/blog"
						>
							{labels.blog}
						</Link>
					</nav>

					<div className="hidden items-center gap-2 lg:flex lg:justify-self-end">
						<LanguageSwitcher id="lang-desktop" />
						<ActionLink href="/book" location="navbar" size="md">
							{labels.bookCall}
						</ActionLink>
					</div>

					<button
						aria-controls={mobileMenuId}
						aria-expanded={mobileOpen}
						aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
						className="-mr-2 flex size-11 items-center justify-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 lg:hidden"
						onClick={() => setMobileOpen((open) => !open)}
						ref={mobileToggleRef}
						type="button"
					>
						<MenuIcon open={mobileOpen} />
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={cn(
					"fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain bg-background lg:hidden",
					mobileOpen
						? "fade-in animate-in duration-200 ease-out motion-reduce:animate-none"
						: "hidden"
				)}
				id={mobileMenuId}
				ref={mobileMenuRef}
			>
				<nav
					aria-label={labels.mobile}
					className="flex min-h-full flex-col px-6 pt-4 pb-8"
				>
					<ul>
						<li>
							<Link
								aria-current={isCurrent("/case-studies") ? "page" : undefined}
								className={mobileLinkClassName}
								href="/case-studies"
								onClick={() => setMobileOpen(false)}
							>
								{labels.work}
							</Link>
						</li>
						<li>
							<Link
								aria-current={isCurrent("/services") ? "page" : undefined}
								className={mobileLinkClassName}
								href="/services"
								onClick={() => setMobileOpen(false)}
							>
								{labels.services}
							</Link>
						</li>
						<li>
							<Link
								aria-current={isCurrent("/industries") ? "page" : undefined}
								className={mobileLinkClassName}
								href="/industries"
								onClick={() => setMobileOpen(false)}
							>
								{labels.industries}
							</Link>
						</li>
						<li>
							<Link
								aria-current={isCurrent("/about") ? "page" : undefined}
								className={mobileLinkClassName}
								href="/about"
								onClick={() => setMobileOpen(false)}
							>
								{labels.about}
							</Link>
						</li>
						<li>
							<Link
								aria-current={isCurrent("/blog") ? "page" : undefined}
								className={mobileLinkClassName}
								href="/blog"
								onClick={() => setMobileOpen(false)}
							>
								{labels.blog}
							</Link>
						</li>
					</ul>

					<div className="mt-auto pt-10">
						<ActionLink
							className="w-full"
							href="/book"
							location="navbar_mobile"
							onClick={() => setMobileOpen(false)}
						>
							{labels.bookCall}
						</ActionLink>
						<div className="mt-6 flex items-center justify-between">
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
							<div className="flex items-center gap-2">
								<ThemeSwitcher variant="compact" />
								<LanguageSwitcher
									className="text-muted-foreground"
									id="lang-mobile"
								/>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
