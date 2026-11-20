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

const NAME_IN_TITLE = /webvise/i;

/** A page's tab title. The layout adds " - webvise" to it, unless the title
 * already names webvise, so no title says the name twice. */
export function tabTitle(title: string) {
	return NAME_IN_TITLE.test(title) ? { absolute: title } : title;
}

/** The same title for Open Graph and X, with the site name after a pipe
 * unless the title already names webvise. */
export function shareTitle(title: string) {
	return NAME_IN_TITLE.test(title) ? title : `${title} | webvise`;
}

/** The site's share image: the English home page's first screen, 2400 ×
 * 1260, for both locales. `pnpm --filter web share-image` captures it again
 * after the hero changes. */
export function shareImage(alt: string | undefined) {
	return { url: "/images/home/share.jpg", width: 2400, height: 1260, alt };
}

/** The countries webvise works in, named in the page's language, for the
 * `areaServed` of the organization and its services. */
export function areaServed(locale: string) {
	const names = new Intl.DisplayNames([locale], { type: "region" });
	return ["DE", "AT", "CH"].map((code) => ({
		"@type": "Country",
		name: names.of(code),
	}));
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
