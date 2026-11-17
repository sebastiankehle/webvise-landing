import { SITE_URL } from "@webvise-app/api/site";

import { routing } from "@/i18n/routing";

export { SITE_URL } from "@webvise-app/api/site";

const BASE_URL = SITE_URL;

/** Resolve per-locale pathnames (e.g. /imprint → /impressum for de) so
 * canonicals and hreflang never point at URLs that 307-redirect. */
function localizedPath(path: string, locale: string): string {
	const pathnames = routing.pathnames[path as keyof typeof routing.pathnames];
	if (typeof pathnames === "object" && pathnames !== null) {
		return (pathnames as Record<string, string>)[locale] ?? path;
	}
	return path;
}

/**
 * Build a locale-aware full URL.
 * Path should not include locale prefix (e.g., "/blog/my-post").
 */
export function localizedUrl(path: string, locale: string): string {
	const resolved = localizedPath(path, locale);
	return locale === routing.defaultLocale
		? `${BASE_URL}${resolved}`
		: `${BASE_URL}/${locale}${resolved === "/" ? "" : resolved}`;
}

/** The site's share image: the English home page's first screen, 2400 ×
 * 1260, for both locales. `pnpm --filter web share-image` captures it again
 * after the hero changes. */
export function shareImage(alt: string | undefined) {
	return { url: "/images/home/share.jpg", width: 2400, height: 1260, alt };
}

/**
 * Generate alternates metadata (canonical + hreflang) for a given path and locale.
 */
export function generateAlternates(path: string, locale: string) {
	const languages: Record<string, string> = {};
	for (const loc of routing.locales) {
		languages[loc] = localizedUrl(path, loc);
	}
	languages["x-default"] = localizedUrl(path, routing.defaultLocale);

	return {
		canonical: localizedUrl(path, locale),
		languages,
	};
}
