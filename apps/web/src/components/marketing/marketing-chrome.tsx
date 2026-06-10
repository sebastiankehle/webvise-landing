"use client";

import type { ComponentProps, ReactNode } from "react";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CAL_URL } from "@/lib/cal";

type MarketingNavbarCtaLocation = "navbar" | "navbar_mobile";
type MarketingNavbarCtaClick = ComponentProps<typeof Button>["onClick"];
type MarketingNavbarCtaSize = ComponentProps<typeof Button>["size"];

interface MarketingNavbarActionsProps {
	bookCallLabel: ReactNode;
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
	bookCallLabel,
	ctaLabel,
}: MarketingNavbarActionsProps) {
	return (
		<div className="hidden items-center gap-3 md:flex">
			<LanguageSwitcher id="lang-desktop" />
			<MarketingNavbarCalLink className="px-4" location="navbar">
				{bookCallLabel}
			</MarketingNavbarCalLink>
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

export function MarketingNavbarCalLink({
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
				variant: "book_call",
			}}
		>
			<Button
				className={className}
				onClick={onClick}
				render={
					<a href={CAL_URL} rel="noopener noreferrer" target="_blank">
						{children}
					</a>
				}
				size={size}
				variant="outline"
			/>
		</TrackClick>
	);
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
				className={className}
				onClick={onClick}
				render={<Link href={{ pathname: "/", hash: "contact" }} />}
				size={size}
				variant="brand"
			>
				{children}
			</Button>
		</TrackClick>
	);
}
