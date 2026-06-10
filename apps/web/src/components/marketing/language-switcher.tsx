"use client";

import { Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mono } from "@/components/ui/typography";
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
		if (nextLocale === locale) {
			return;
		}

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
			<DropdownMenuTrigger
				id={id}
				render={
					<Button
						className="group gap-1.5 border-transparent bg-transparent px-3 text-muted-foreground uppercase hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent"
						variant="outline"
					/>
				}
			>
				<span className="inline-flex [perspective:80px]">
					<Globe className="size-4 transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(360deg)]" />
				</span>
				{locale}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						className={locale === loc ? "font-medium text-foreground" : ""}
						key={loc}
						onClick={() => switchLocale(loc)}
					>
						<Mono className="w-6 uppercase">{loc}</Mono>
						{localeLabels[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
