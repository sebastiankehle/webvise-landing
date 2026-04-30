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
			className="cursor-pointer bg-transparent p-0 text-muted-foreground/60 text-xs transition-colors hover:text-[--foreground]"
			onClick={handleClick}
			type="button"
		>
			{t("preferencesLink")}
		</button>
	);
}
