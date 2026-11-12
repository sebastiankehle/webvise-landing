"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { migrateLegacyThemeId, removeLegacyThemeClasses } from "@/lib/themes";
import { cn } from "@/lib/utils";

const triggerClassNames = {
	compact:
		"gap-1.5 border-0 bg-transparent px-3 text-muted-foreground text-sm hover:border-0 hover:bg-transparent hover:text-foreground pointer-coarse:h-11",
	inline: "h-9 gap-2 px-3",
} satisfies Record<NonNullable<ThemeSwitcherProps["variant"]>, string>;

interface ThemeSwitcherProps {
	className?: string;
	variant?: "compact" | "inline";
}

export default function ThemeSwitcher({
	className,
	variant = "inline",
}: ThemeSwitcherProps) {
	const t = useTranslations("themeSwitcher");
	const { resolvedTheme, setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	// The icons only animate after a click, never on first paint.
	const [turned, setTurned] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// One-time migration away from the retired multi-theme ids that can still
	// sit in localStorage (and land on <html> before hydration).
	useEffect(() => {
		if (!mounted) {
			return;
		}
		const migrated = migrateLegacyThemeId(theme);
		if (migrated) {
			removeLegacyThemeClasses();
			setTheme(migrated);
		}
	}, [mounted, setTheme, theme]);

	const isDark = mounted && resolvedTheme === "dark";

	const toggleTheme = useCallback(() => {
		setTurned(true);
		setTheme(isDark ? "light" : "dark");
	}, [isDark, setTheme]);

	const iconState = (shown: boolean) => {
		if (!turned) {
			return shown ? undefined : "opacity-0";
		}
		return shown ? "theme-icon-in" : "theme-icon-out";
	};

	const iconClassName = variant === "compact" ? "h-4 w-4" : "h-5 w-5";

	return (
		<Button
			aria-label={t("label")}
			className={cn(triggerClassNames[variant], className)}
			onClick={toggleTheme}
			type="button"
			variant="outline"
		>
			<span
				className={cn(
					"relative flex shrink-0 items-center justify-center",
					variant === "compact" ? "h-4 w-4" : "h-5 w-5"
				)}
			>
				{/* Both icons stay mounted: one turns out, then the other turns in. */}
				<Sun
					className={cn("absolute", iconClassName, iconState(isDark))}
					style={
						{ "--turn-in": "-90deg", "--turn-out": "90deg" } as CSSProperties
					}
				/>
				<Moon
					className={cn("absolute", iconClassName, iconState(!isDark))}
					style={
						{ "--turn-in": "90deg", "--turn-out": "-90deg" } as CSSProperties
					}
				/>
			</span>
			<span className="truncate">{isDark ? t("light") : t("dark")}</span>
		</Button>
	);
}
