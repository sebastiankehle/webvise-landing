"use client";

import { useTranslations } from "next-intl";

import { clearAnalyticsStorage, clearConsent } from "@/lib/consent";
import { loadedPostHog } from "@/lib/posthog-client";

export function CookiePreferencesLink() {
	const t = useTranslations("consent");

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		loadedPostHog()?.reset();
		clearConsent();
		clearAnalyticsStorage();
		window.location.reload();
	}

	return (
		<button
			className="cursor-pointer bg-transparent p-0 text-muted-foreground text-sm outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
			onClick={handleClick}
			type="button"
		>
			{t("preferencesLink")}
		</button>
	);
}
