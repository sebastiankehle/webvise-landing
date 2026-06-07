"use client";

import type { ComponentProps, ReactNode } from "react";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type MarketingNavbarCtaLocation = "navbar" | "navbar_mobile";
type MarketingNavbarCtaClick = ComponentProps<typeof Button>["onClick"];
type MarketingNavbarCtaSize = ComponentProps<typeof Button>["size"];

interface MarketingNavbarActionsProps {
	ctaLabel: ReactNode;
}

interface MarketingNavbarCtaProps {
	children: ReactNode;
	className?: string;
	location: MarketingNavbarCtaLocation;
	onClick?: MarketingNavbarCtaClick;
	size?: MarketingNavbarCtaSize;
}

export function MarketingNavbarActions({
	ctaLabel,
}: MarketingNavbarActionsProps) {
	return (
		<div className="hidden items-center gap-4 md:flex">
			<LanguageSwitcher id="lang-desktop" />
			<MarketingNavbarCta className="px-6" location="navbar">
				{ctaLabel}
			</MarketingNavbarCta>
		</div>
	);
}

export function MarketingMobileMenuControls() {
	return (
		<div className="flex items-center gap-4">
			<ThemeSwitcher variant="compact" />
			<LanguageSwitcher id="lang-mobile" />
		</div>
	);
}

export function MarketingFooterThemeControl() {
	return <ThemeSwitcher className="md:hidden" variant="compact" />;
}

export function MarketingNavbarCta({
	children,
	className,
	location,
	onClick,
	size,
}: MarketingNavbarCtaProps) {
	return (
		<TrackClick
			event="cta_clicked"
			properties={{
				location,
				variant: "get_started",
			}}
		>
			<Button
				className={cn(
					"[&]:hover:!bg-brand-hover border-transparent bg-brand text-brand-foreground",
					className
				)}
				onClick={onClick}
				render={<Link href={{ pathname: "/", hash: "contact" }} />}
				size={size}
			>
				{children}
			</Button>
		</TrackClick>
	);
}
