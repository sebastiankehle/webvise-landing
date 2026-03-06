"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
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
		router.replace(pathname as "/", { locale: nextLocale });
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 text-muted-foreground text-sm uppercase tracking-wider transition-colors hover:text-foreground">
				<Globe className="size-4" />
				{locale}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				{routing.locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						className={locale === loc ? "font-medium text-foreground" : ""}
						onSelect={() => switchLocale(loc)}
					>
						<span className="w-6 uppercase text-muted-foreground">{loc}</span>
						{localeLabels[loc]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
