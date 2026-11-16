/** Projects whose card opens with a live scene. */
export const projectSceneSlugs = [
	"finanzierungszertifikat",
	"hyyve",
	"keel",
	"kernspan",
	"maerkische-projekt-bau",
	"morrow",
	"old-world-labs",
	"rautenberg-pitch-engine",
	"relay",
	"screencurve",
	"von-platen-coaching",
] as const;

export type ProjectSceneSlug = (typeof projectSceneSlugs)[number];

export function hasProjectScene(slug: string): slug is ProjectSceneSlug {
	return (projectSceneSlugs as readonly string[]).includes(slug);
}

/** Cards whose picture holds still or moves for 5 s or less: the static
 * sheets and von Platen's scale. The rest carry pause and restart buttons
 * (WCAG 2.2.2). */
const still = new Set<string>(["morrow", "relay", "von-platen-coaching"]);

/** Where a card's pause and restart buttons sit: top right of its picture,
 * where the scenes' windows leave margin, or false for a picture that
 * holds still. `framed` is a picture set 8px inside its card. The film
 * still's credit takes the strip at the top of screencurve's picture, so
 * its buttons sit below it. */
export function projectSceneControls(
	slug: string,
	framed = false
): string | false {
	if (!hasProjectScene(slug) || still.has(slug)) {
		return false;
	}
	if (slug === "screencurve") {
		return framed ? "top-11 right-4" : "top-10 right-3";
	}
	return framed ? "top-4 right-4" : "top-3 right-3";
}
