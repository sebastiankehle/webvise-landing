/** Screencurve's pictures carry one cache-busting tag: change it whenever a
 * picture is recaptured under the same name. `next/image` serves a local
 * picture only when its search matches a `localPatterns` entry, so
 * `next.config.ts` builds those entries from the same constant. */
export const SCREENCURVE_VERSION = "20261117-english";

/** The paths `next.config.ts` lets through with the tag. */
export const SCREENCURVE_PATTERNS = [
	"/images/case-studies/screencurve/**",
	"/images/home/work/screencurve*.webp",
];

const SCREENCURVE_PREFIXES = [
	"/images/case-studies/screencurve/",
	"/images/home/work/screencurve",
];

/** A picture's path with its cache-busting tag, if it is one of
 * Screencurve's and carries no query yet. */
export function versioned(path: string): string {
	return SCREENCURVE_PREFIXES.some((prefix) => path.startsWith(prefix)) &&
		!path.includes("?")
		? `${path}?v=${SCREENCURVE_VERSION}`
		: path;
}
