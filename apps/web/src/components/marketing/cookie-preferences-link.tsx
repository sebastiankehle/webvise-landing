"use client";

import { useTranslations } from "next-intl";

const STORAGE_KEY = "webvise-consent-v1";

export function CookiePreferencesLink() {
	const t = useTranslations("consent");

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
		window.location.reload();
	}

	return (
		<button
			className="cursor-pointer border border-transparent bg-transparent p-0 text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
			onClick={handleClick}
			type="button"
		>
			{t("preferencesLink")}
		</button>
	);
}
