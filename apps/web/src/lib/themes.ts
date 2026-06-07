export const SITE_THEMES = [
	{
		id: "light",
		label: "Generic Light",
		swatch: "oklch(0.75 0.18 55)",
	},
	{
		id: "graphite-light",
		label: "Graphite Light",
		swatch:
			"linear-gradient(135deg, oklch(0.996 0.002 245) 0 50%, oklch(0.75 0.18 55) 50% 100%)",
	},
	{
		id: "mono-light",
		label: "Mono Light",
		swatch:
			"linear-gradient(135deg, oklch(0.98 0 0) 0 50%, oklch(0.1 0 0) 50% 100%)",
	},
	{
		id: "dark",
		label: "Generic Dark",
		swatch: "oklch(0.75 0.18 55)",
	},
	{
		id: "graphite-dark",
		label: "Graphite Dark",
		swatch:
			"linear-gradient(135deg, oklch(0.17 0.006 250) 0 50%, oklch(0.75 0.18 55) 50% 100%)",
	},
	{
		id: "mono-dark",
		label: "Mono Dark",
		swatch:
			"linear-gradient(135deg, oklch(0.08 0 0) 0 50%, oklch(0.96 0 0) 50% 100%)",
	},
] as const;

export const DARK_THEME_IDS = ["dark", "graphite-dark", "mono-dark"] as const;
export const THEME_OPTIONS = SITE_THEMES;
export const SITE_THEME_IDS = SITE_THEMES.map((theme) => theme.id);
export type SiteThemeId = (typeof SITE_THEMES)[number]["id"];

export const SITE_THEME_DOM_EVENT = "webvise:site-theme-dom-change";

const SITE_THEME_ID_SET = new Set<string>(SITE_THEME_IDS);
const DARK_THEME_ID_SET = new Set<string>(DARK_THEME_IDS);

export function isSiteThemeId(
	themeId: string | null | undefined
): themeId is SiteThemeId {
	return Boolean(themeId && SITE_THEME_ID_SET.has(themeId));
}

export function getSiteThemeId(
	themeId: string | null | undefined
): SiteThemeId {
	return isSiteThemeId(themeId) ? (themeId as SiteThemeId) : SITE_THEMES[0].id;
}

export function isDarkSiteTheme(themeId: string | null | undefined) {
	return Boolean(themeId && DARK_THEME_ID_SET.has(themeId));
}

export function getSiteThemeIdFromClassList(classList: DOMTokenList) {
	return SITE_THEME_IDS.find((themeId) => classList.contains(themeId));
}
