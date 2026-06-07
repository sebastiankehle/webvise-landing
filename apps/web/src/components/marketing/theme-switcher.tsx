"use client";

import { Palette, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	applySiteThemeToDom,
	DARK_THEME_IDS,
	type SiteThemeId,
	THEME_OPTIONS,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

const lightThemeOptions = THEME_OPTIONS.filter(
	(option) =>
		!DARK_THEME_IDS.includes(option.id as (typeof DARK_THEME_IDS)[number])
);
const darkThemeOptions = THEME_OPTIONS.filter((option) =>
	DARK_THEME_IDS.includes(option.id as (typeof DARK_THEME_IDS)[number])
);
const triggerClassNames = {
	compact:
		"group inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs uppercase transition-colors hover:text-foreground",
	floating:
		"fixed bottom-6 left-6 z-40 hidden h-12 w-12 items-center justify-center bg-brand text-brand-foreground shadow-lg transition-colors hover:!bg-brand-hover md:flex",
	inline:
		"inline-flex h-9 items-center gap-2 border border-border/70 bg-card px-3 text-foreground text-xs transition-colors hover:border-brand-border hover:bg-brand-surface hover:text-foreground dark:bg-card/35",
} satisfies Record<NonNullable<ThemeSwitcherProps["variant"]>, string>;
const themePreviewingClassName = "theme-previewing";
const previewFontFamilyProperty = "--theme-preview-font-family";
const previewDisplayFontFamilyProperty = "--theme-preview-display-font-family";
const previewDisplayFontWeightProperty = "--theme-preview-display-font-weight";

interface ThemeSwitcherProps {
	className?: string;
	variant?: "compact" | "floating" | "inline";
}

export default function ThemeSwitcher({
	className,
	variant = "floating",
}: ThemeSwitcherProps) {
	const t = useTranslations("themeSwitcher");
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(false);
	const committedThemeRef = useRef<SiteThemeId>(THEME_OPTIONS[0].id);
	const previewFrameRef = useRef<number | undefined>(undefined);
	const previewThemeRef = useRef<SiteThemeId>(THEME_OPTIONS[0].id);
	const restoreTimeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		setMounted(true);
	}, []);

	const cancelPreviewFrame = useCallback(() => {
		if (previewFrameRef.current === undefined) {
			return;
		}
		window.cancelAnimationFrame(previewFrameRef.current);
		previewFrameRef.current = undefined;
	}, []);

	const cancelRestoreTimeout = useCallback(() => {
		if (restoreTimeoutRef.current === undefined) {
			return;
		}
		window.clearTimeout(restoreTimeoutRef.current);
		restoreTimeoutRef.current = undefined;
	}, []);

	const startPreviewTransitionGuard = useCallback(() => {
		const root = document.documentElement;
		const body = document.body;
		const display = document.querySelector<HTMLElement>(".font-display");

		if (body) {
			root.style.setProperty(
				previewFontFamilyProperty,
				window.getComputedStyle(body).fontFamily
			);
		}
		if (display) {
			const displayStyle = window.getComputedStyle(display);
			root.style.setProperty(
				previewDisplayFontFamilyProperty,
				displayStyle.fontFamily
			);
			root.style.setProperty(
				previewDisplayFontWeightProperty,
				displayStyle.fontWeight
			);
		}
		root.classList.add(themePreviewingClassName);
	}, []);

	const stopPreviewTransitionGuard = useCallback(() => {
		const root = document.documentElement;
		root.classList.remove(themePreviewingClassName);
		root.style.removeProperty(previewFontFamilyProperty);
		root.style.removeProperty(previewDisplayFontFamilyProperty);
		root.style.removeProperty(previewDisplayFontWeightProperty);
	}, []);

	useEffect(
		() => () => {
			cancelPreviewFrame();
			cancelRestoreTimeout();
			stopPreviewTransitionGuard();
		},
		[cancelPreviewFrame, cancelRestoreTimeout, stopPreviewTransitionGuard]
	);

	const restoreCommittedTheme = useCallback(() => {
		if (!mounted) {
			return;
		}
		cancelRestoreTimeout();
		cancelPreviewFrame();
		previewThemeRef.current = committedThemeRef.current;
		committedThemeRef.current = applySiteThemeToDom(committedThemeRef.current);
		window.requestAnimationFrame(stopPreviewTransitionGuard);
	}, [
		cancelPreviewFrame,
		cancelRestoreTimeout,
		mounted,
		stopPreviewTransitionGuard,
	]);

	const scheduleCommittedThemeRestore = useCallback(() => {
		if (!mounted) {
			return;
		}
		cancelRestoreTimeout();
		restoreTimeoutRef.current = window.setTimeout(() => {
			restoreTimeoutRef.current = undefined;
			restoreCommittedTheme();
		}, 90);
	}, [cancelRestoreTimeout, mounted, restoreCommittedTheme]);

	const canPreviewOnHover = useCallback(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(hover: hover) and (pointer: fine)").matches,
		[]
	);

	const previewTheme = useCallback(
		(nextTheme: SiteThemeId) => {
			if (!(mounted && canPreviewOnHover())) {
				return;
			}
			cancelRestoreTimeout();
			if (previewThemeRef.current === nextTheme) {
				return;
			}
			previewThemeRef.current = nextTheme;
			startPreviewTransitionGuard();
			cancelPreviewFrame();
			previewFrameRef.current = window.requestAnimationFrame(() => {
				previewFrameRef.current = undefined;
				applySiteThemeToDom(previewThemeRef.current);
			});
		},
		[
			cancelPreviewFrame,
			cancelRestoreTimeout,
			canPreviewOnHover,
			mounted,
			startPreviewTransitionGuard,
		]
	);

	const commitTheme = useCallback(
		(nextTheme: string) => {
			cancelRestoreTimeout();
			cancelPreviewFrame();
			const validTheme = applySiteThemeToDom(nextTheme);
			previewThemeRef.current = validTheme;
			committedThemeRef.current = validTheme;
			stopPreviewTransitionGuard();
			setTheme(validTheme);
		},
		[
			cancelPreviewFrame,
			cancelRestoreTimeout,
			setTheme,
			stopPreviewTransitionGuard,
		]
	);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			if (!nextOpen) {
				restoreCommittedTheme();
			}
		},
		[restoreCommittedTheme]
	);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		if (theme && !THEME_OPTIONS.some((option) => option.id === theme)) {
			setTheme("light");
			committedThemeRef.current = "light";
			previewThemeRef.current = "light";
			return;
		}
		committedThemeRef.current = applySiteThemeToDom(theme);
		previewThemeRef.current = committedThemeRef.current;
	}, [mounted, setTheme, theme]);

	const value = THEME_OPTIONS.some((option) => option.id === theme)
		? theme
		: THEME_OPTIONS[0].id;
	const lightGroupLabel = t.has("lightGroup") ? t("lightGroup") : "Light";
	const darkGroupLabel = t.has("darkGroup") ? t("darkGroup") : "Dark";
	const currentTheme =
		mounted && THEME_OPTIONS.some((option) => option.id === theme)
			? THEME_OPTIONS.find((option) => option.id === theme)
			: THEME_OPTIONS[0];
	const triggerClassName = triggerClassNames[variant];
	const iconClassName = variant === "compact" ? "h-4 w-4" : "h-5 w-5";
	const contentAlign = variant === "floating" ? "start" : "end";

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={open}>
			<DropdownMenuTrigger
				aria-label={t("label")}
				className={cn(triggerClassName, className)}
			>
				<span
					className={cn(
						"relative flex shrink-0 items-center justify-center",
						variant === "compact" ? "h-4 w-4" : "h-5 w-5"
					)}
				>
					<AnimatePresence mode="wait">
						{open ? (
							<motion.span
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: 90, opacity: 0 }}
								initial={{ rotate: -90, opacity: 0 }}
								key="close"
								transition={{ duration: 0.15 }}
							>
								<X className={iconClassName} />
							</motion.span>
						) : (
							<motion.span
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: -90, opacity: 0 }}
								initial={{ rotate: 90, opacity: 0 }}
								key="open"
								transition={{ duration: 0.15 }}
							>
								<Palette className={iconClassName} />
							</motion.span>
						)}
					</AnimatePresence>
				</span>
				{variant !== "floating" && currentTheme && (
					<>
						{variant === "inline" && (
							<span
								aria-hidden="true"
								className="size-2 shrink-0 border border-foreground/20"
								style={{ background: currentTheme.swatch }}
							/>
						)}
						<span className="truncate">{currentTheme.label}</span>
					</>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={contentAlign}
				className="w-52 p-1"
				onPointerEnter={cancelRestoreTimeout}
				onPointerLeave={scheduleCommittedThemeRestore}
				side="top"
				sideOffset={8}
			>
				<div className="flex flex-col">
					<div className="px-2 pt-2 pb-1 font-medium text-muted-foreground text-xs uppercase">
						{lightGroupLabel}
					</div>
					{lightThemeOptions.map((option) => (
						<DropdownMenuItem
							aria-current={value === option.id ? "true" : undefined}
							className="justify-between pr-2 data-[current=true]:bg-accent data-[current=true]:text-accent-foreground"
							data-current={value === option.id}
							key={option.id}
							onClick={() => commitTheme(option.id)}
							onPointerEnter={() => previewTheme(option.id)}
						>
							<span className="truncate">{option.label}</span>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<div className="px-2 pt-2 pb-1 font-medium text-muted-foreground text-xs uppercase">
						{darkGroupLabel}
					</div>
					{darkThemeOptions.map((option) => (
						<DropdownMenuItem
							aria-current={value === option.id ? "true" : undefined}
							className="justify-between pr-2 data-[current=true]:bg-accent data-[current=true]:text-accent-foreground"
							data-current={value === option.id}
							key={option.id}
							onClick={() => commitTheme(option.id)}
							onPointerEnter={() => previewTheme(option.id)}
						>
							<span className="truncate">{option.label}</span>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
