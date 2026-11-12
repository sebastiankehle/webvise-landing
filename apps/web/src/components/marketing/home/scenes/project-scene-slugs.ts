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
