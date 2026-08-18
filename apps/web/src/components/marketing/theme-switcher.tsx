"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { migrateLegacyThemeId, removeLegacyThemeClasses } from "@/lib/themes";
import { cn } from "@/lib/utils";

const triggerClassNames = {
	compact:
		"gap-1.5 border-0 bg-transparent px-3 text-muted-foreground hover:border-0 hover:bg-transparent hover:text-foreground",
	floating:
		"fixed bottom-6 left-6 z-40 hidden size-12 shadow-lg md:inline-flex",
	inline: "h-9 gap-2 px-3",
} satisfies Record<NonNullable<ThemeSwitcherProps["variant"]>, string>;

interface ThemeSwitcherProps {
	className?: string;
	variant?: "compact" | "floating" | "inline";
}

export default function ThemeSwitcher({
	className,
	variant = "floating",
}: ThemeSwitcherProps) {
	const t = useTranslations("themeSwitcher");
	const { resolvedTheme, setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

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
		setTheme(isDark ? "light" : "dark");
	}, [isDark, setTheme]);

	const iconClassName = variant === "compact" ? "h-4 w-4" : "h-5 w-5";

	return (
		<Button
			aria-label={t("label")}
			className={cn(triggerClassNames[variant], className)}
			data-marketing-floating={variant === "floating" ? "true" : undefined}
			onClick={toggleTheme}
			size={variant === "floating" ? "icon-lg" : "default"}
			type="button"
			variant={variant === "floating" ? "brand" : "outline"}
		>
			<span
				className={cn(
					"relative flex shrink-0 items-center justify-center",
					variant === "compact" ? "h-4 w-4" : "h-5 w-5"
				)}
			>
				<AnimatePresence initial={false} mode="wait">
					{isDark ? (
						<motion.span
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							initial={{ rotate: -90, opacity: 0 }}
							key="moon"
							transition={{ duration: 0.15 }}
						>
							<Moon className={iconClassName} />
						</motion.span>
					) : (
						<motion.span
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							initial={{ rotate: 90, opacity: 0 }}
							key="sun"
							transition={{ duration: 0.15 }}
						>
							<Sun className={iconClassName} />
						</motion.span>
					)}
				</AnimatePresence>
			</span>
			{variant !== "floating" && (
				<span className="truncate">{isDark ? t("dark") : t("light")}</span>
			)}
		</Button>
	);
}
