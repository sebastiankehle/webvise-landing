const SITE_THEMES = ["light", "dark"] as const;

export type SiteThemeId = (typeof SITE_THEMES)[number];
export const SITE_THEME_IDS: SiteThemeId[] = [...SITE_THEMES];

// Theme ids that shipped before the light/dark consolidation. next-themes can
// still find one of them in localStorage (and apply it as a class before
// hydration), so they get mapped to the theme that replaced them and the
// stale classes get cleaned off the root element.
export const LEGACY_SITE_THEME_IDS = [
	"graphite-light",
	"graphite-dark",
	"mono-light",
	"mono-dark",
	"paper",
	"ember",
	"graphite",
] as const;

export function isSiteThemeId(
	themeId: string | null | undefined
): themeId is SiteThemeId {
	return themeId === "light" || themeId === "dark";
}

export function migrateLegacyThemeId(
	themeId: string | null | undefined
): SiteThemeId | undefined {
	const isLegacy = Boolean(
		themeId &&
			LEGACY_SITE_THEME_IDS.includes(
				themeId as (typeof LEGACY_SITE_THEME_IDS)[number]
			)
	);
	if (!isLegacy) {
		return;
	}

	return themeId?.includes("dark") ? "dark" : "light";
}

export function removeLegacyThemeClasses() {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.classList.remove(...LEGACY_SITE_THEME_IDS);
}
