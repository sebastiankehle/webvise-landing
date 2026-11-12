"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { normalizeHomepageSectionHash } from "@/lib/homepage-section-href";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
	en: "English",
	de: "Deutsch",
};

interface LanguageSwitcherProps {
	className?: string;
	id?: string;
}

export default function LanguageSwitcher({
	className,
	id,
}: LanguageSwitcherProps) {
	const locale = useLocale();
	const pathname = usePathname();
	const params = useParams<Record<string, string | string[]>>();

	function switchLocale(nextLocale: string) {
		if (nextLocale === locale) {
			return;
		}

		const { locale: _locale, ...routeParams } = params;
		const href =
			Object.keys(routeParams).length > 0
				? { pathname, params: routeParams }
				: pathname;
		const newPath = getPathname({
			locale: nextLocale,
			href: href as Parameters<typeof getPathname>[0]["href"],
		});
		const sectionHash = normalizeHomepageSectionHash(window.location.hash);
		const hash = sectionHash ? `#${sectionHash}` : "";
		const newUrl = `${newPath}${window.location.search}${hash}`;

		// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not supported in all browsers yet
		document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax`;
		window.location.href = newUrl;
	}

	return (
		// Two languages need no menu: both are in view, the current one is set.
		<div
			className={cn(
				"inline-flex h-9 items-center rounded-full border border-foreground/15 p-0.5 text-sm",
				className
			)}
			id={id}
		>
			{routing.locales.map((loc) => (
				<button
					aria-pressed={locale === loc}
					className={cn(
						"h-[1.875rem] rounded-full px-3 font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/70",
						locale === loc
							? "bg-card text-foreground shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_1px_2px_rgba(14,18,23,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
							: "text-muted-foreground hover:text-foreground"
					)}
					key={loc}
					lang={loc}
					onClick={() => switchLocale(loc)}
					type="button"
				>
					{loc.toUpperCase()}
					<span className="sr-only"> {localeLabels[loc]}</span>
				</button>
			))}
		</div>
	);
}
