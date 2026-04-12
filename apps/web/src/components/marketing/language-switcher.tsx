"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

import { usePathname } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
	en: "English",
	de: "Deutsch",
	fr: "Français",
	es: "Español",
	nl: "Nederlands",
	pl: "Polski",
	it: "Italiano",
};

export default function LanguageSwitcher({ id }: { id?: string }) {
	const locale = useLocale();
	const pathname = usePathname();

	function switchLocale(nextLocale: string) {
		if (nextLocale === locale) return;

		// Strip current locale prefix to get the bare path
		const localePrefix = `/${locale}`;
		const barePath = pathname.startsWith(localePrefix)
			? pathname.slice(localePrefix.length) || "/"
			: pathname;

		// Build new path: default locale (en) needs no prefix
		const newPath =
			nextLocale === routing.defaultLocale
				? barePath
				: `/${nextLocale}${barePath}`;
		// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not supported in all browsers yet
		document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax`;
		window.location.href = newPath;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger id={id} className="flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground">
				<Globe className="size-4" />
				{locale}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						className={locale === loc ? "font-medium text-foreground" : ""}
						onClick={() => switchLocale(loc)}
					>
						<span className="w-6 text-muted-foreground">{loc}</span>
						{localeLabels[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
