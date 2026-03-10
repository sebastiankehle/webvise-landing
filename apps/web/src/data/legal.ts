import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface LegalSection {
	heading: string;
	body?: string;
	items?: string[];
}

export interface LegalPage {
	title: string;
	subtitle: string;
	sections: LegalSection[];
}

type LegalSlug = "privacy" | "terms" | "imprint";

const contentDir = join(process.cwd(), "content/legal");
const cache = new Map<string, LegalPage>();

function readFile(slug: LegalSlug, locale: string): LegalPage | null {
	const key = `${slug}:${locale}`;
	const cached = cache.get(key);
	if (cached) return cached;

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) return null;

	const data: LegalPage = JSON.parse(readFileSync(filePath, "utf-8"));
	cache.set(key, data);
	return data;
}

export function getLegalPage(
	slug: LegalSlug,
	locale: string,
): LegalPage | null {
	return readFile(slug, locale) ?? readFile(slug, "en");
}
