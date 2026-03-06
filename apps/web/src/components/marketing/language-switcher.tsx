"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const nextLocale = locale === "en" ? "de" : "en";

	function switchLocale() {
		// Strip current locale prefix if present
		const strippedPath = locale !== routing.defaultLocale
			? pathname.replace(`/${locale}`, "") || "/"
			: pathname;

		// Add new locale prefix if not default
		const newPath = nextLocale !== routing.defaultLocale
			? `/${nextLocale}${strippedPath}`
			: strippedPath;

		router.push(newPath as never);
	}

	return (
		<button
			type="button"
			onClick={switchLocale}
			className="text-muted-foreground text-sm uppercase tracking-wider transition-colors hover:text-foreground"
		>
			{nextLocale}
		</button>
	);
}
