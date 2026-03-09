"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
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

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	function switchLocale(nextLocale: string) {
		if (nextLocale === locale) return;

		// Strip current locale prefix from pathname
		let path = pathname;
		for (const loc of routing.locales) {
			if (path.startsWith(`/${loc}/`)) {
				path = path.slice(loc.length + 1);
				break;
			}
			if (path === `/${loc}`) {
				path = "/";
				break;
			}
		}

		// Build new path: default locale (en) needs no prefix
		const newPath =
			nextLocale === routing.defaultLocale ? path : `/${nextLocale}${path}`;
		router.replace(newPath as never);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-foreground">
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
						<span className="w-6 uppercase text-muted-foreground">{loc}</span>
						{localeLabels[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
