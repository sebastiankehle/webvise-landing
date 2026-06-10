"use client";

import { Palette, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
		"gap-1.5 border-transparent bg-transparent px-3 text-muted-foreground uppercase hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent",
	floating:
		"fixed bottom-6 left-6 z-40 hidden size-12 shadow-lg md:inline-flex",
	inline: "h-9 gap-2 px-3",
} satisfies Record<NonNullable<ThemeSwitcherProps["variant"]>, string>;
const themePreviewingClassName = "theme-previewing";

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
	const guardReleaseFrameRef = useRef<number | undefined>(undefined);
	const previewThemeRef = useRef<SiteThemeId>(THEME_OPTIONS[0].id);
	const restoreTimeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		setMounted(true);
	}, []);

	const cancelGuardRelease = useCallback(() => {
		if (guardReleaseFrameRef.current === undefined) {
			return;
		}
		window.cancelAnimationFrame(guardReleaseFrameRef.current);
		guardReleaseFrameRef.current = undefined;
	}, []);

	const cancelRestoreTimeout = useCallback(() => {
		if (restoreTimeoutRef.current === undefined) {
			return;
		}
		window.clearTimeout(restoreTimeoutRef.current);
		restoreTimeoutRef.current = undefined;
	}, []);

	const startPreviewTransitionGuard = useCallback(() => {
		cancelGuardRelease();
		document.documentElement.classList.add(themePreviewingClassName);
	}, [cancelGuardRelease]);

	const stopPreviewTransitionGuard = useCallback(() => {
		cancelGuardRelease();
		document.documentElement.classList.remove(themePreviewingClassName);
	}, [cancelGuardRelease]);

	// Release the guard only after the swapped theme has painted, so the
	// page never animates a theme change mid-swap.
	const releaseTransitionGuardAfterPaint = useCallback(() => {
		cancelGuardRelease();
		guardReleaseFrameRef.current = window.requestAnimationFrame(() => {
			guardReleaseFrameRef.current = window.requestAnimationFrame(() => {
				guardReleaseFrameRef.current = undefined;
				document.documentElement.classList.remove(themePreviewingClassName);
			});
		});
	}, [cancelGuardRelease]);

	useEffect(
		() => () => {
			cancelRestoreTimeout();
			stopPreviewTransitionGuard();
		},
		[cancelRestoreTimeout, stopPreviewTransitionGuard]
	);

	const restoreCommittedTheme = useCallback(() => {
		if (!mounted) {
			return;
		}
		cancelRestoreTimeout();
		startPreviewTransitionGuard();
		previewThemeRef.current = committedThemeRef.current;
		committedThemeRef.current = applySiteThemeToDom(committedThemeRef.current);
		releaseTransitionGuardAfterPaint();
	}, [
		cancelRestoreTimeout,
		mounted,
		releaseTransitionGuardAfterPaint,
		startPreviewTransitionGuard,
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
			applySiteThemeToDom(nextTheme);
		},
		[
			cancelRestoreTimeout,
			canPreviewOnHover,
			mounted,
			startPreviewTransitionGuard,
		]
	);

	const commitTheme = useCallback(
		(nextTheme: string) => {
			cancelRestoreTimeout();
			startPreviewTransitionGuard();
			const validTheme = applySiteThemeToDom(nextTheme);
			previewThemeRef.current = validTheme;
			committedThemeRef.current = validTheme;
			setTheme(validTheme);
			releaseTransitionGuardAfterPaint();
		},
		[
			cancelRestoreTimeout,
			releaseTransitionGuardAfterPaint,
			setTheme,
			startPreviewTransitionGuard,
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
	const triggerVariant = variant === "floating" ? "brand" : "outline";
	const triggerSize = variant === "floating" ? "icon-lg" : "default";

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={open}>
			<DropdownMenuTrigger
				aria-label={t("label")}
				render={
					<Button
						className={cn(triggerClassName, className)}
						data-marketing-floating={
							variant === "floating" ? "true" : undefined
						}
						size={triggerSize}
						variant={triggerVariant}
					/>
				}
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
