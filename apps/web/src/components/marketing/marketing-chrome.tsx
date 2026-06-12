"use client";

import NextLink from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import LanguageSwitcher from "@/components/marketing/language-switcher";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { CAL_URL } from "@/lib/cal";
import { homepageSectionHref } from "@/lib/homepage-section-href";

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
			<LanguageSwitcher className="text-muted-foreground" id="lang-mobile" />
		</div>
	);
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
	const locale = useLocale();
	const ariaLabel = typeof children === "string" ? children : "Get started";

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
				render={
					<NextLink
						aria-label={ariaLabel}
						href={homepageSectionHref("contact", locale)}
					/>
				}
				size={size}
				variant="brand"
			>
				{children}
			</Button>
		</TrackClick>
	);
}
