import type { Route } from "next";
import { routing } from "@/i18n/routing";

const LEADING_HASHES_RE = /^#+/;

export function normalizeHomepageSectionHash(hash: string) {
	return hash.replace(LEADING_HASHES_RE, "").split("#")[0] ?? "";
}

export function homepageSectionHref(hash: string, locale: string): Route {
	const sectionHash = normalizeHomepageSectionHash(hash);
	const pathname = locale === routing.defaultLocale ? "/" : `/${locale}`;

	return (sectionHash ? `${pathname}#${sectionHash}` : pathname) as Route;
}
