import { setRequestLocale } from "next-intl/server";

export type LocaleParams = Promise<{ locale: string }>;

/** Tells next-intl the locale from the URL. Without it, the first
 * translation call reads the request headers, and the page can no longer be
 * built ahead of time. Every layout, page and metadata function under
 * `[locale]` calls this before anything else. */
export async function pinLocale(params: LocaleParams) {
	const { locale } = await params;
	setRequestLocale(locale);
	return locale;
}
