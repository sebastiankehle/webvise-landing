import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const LOCALES = ["en", "de"] as const;
const MESSAGES_DIR = join(import.meta.dirname, "../messages");
const CONTENT_DIR = join(import.meta.dirname, "../../content");

function getLeafKeys(obj: Record<string, unknown>, prefix = ""): string[] {
	const keys: string[] = [];
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (value !== null && typeof value === "object" && !Array.isArray(value)) {
			keys.push(...getLeafKeys(value as Record<string, unknown>, fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys.sort();
}

function getLeafValue(obj: Record<string, unknown>, key: string): unknown {
	const parts = key.split(".");
	let val: unknown = obj;
	for (const p of parts) {
		val = (val as Record<string, unknown>)[p];
	}
	return val;
}

function loadJson(filePath: string): Record<string, unknown> {
	return JSON.parse(readFileSync(filePath, "utf-8"));
}

// ─── UI message translations (next-intl) ───

describe("UI message translations", () => {
	const enMessages = loadJson(join(MESSAGES_DIR, "en.json"));
	const enKeys = getLeafKeys(enMessages);

	for (const locale of LOCALES) {
		if (locale === "en") {
			continue;
		}

		describe(`${locale}.json`, () => {
			const localeMessages = loadJson(join(MESSAGES_DIR, `${locale}.json`));
			const localeKeys = getLeafKeys(localeMessages);

			it("has no missing keys compared to en.json", () => {
				const missing = enKeys.filter((k) => !localeKeys.includes(k));
				expect(missing, `Missing keys in ${locale}`).toEqual([]);
			});

			it("has no extra keys compared to en.json", () => {
				const extra = localeKeys.filter((k) => !enKeys.includes(k));
				expect(extra, `Extra keys in ${locale}`).toEqual([]);
			});

			it("has no empty string values where en has content", () => {
				const empty = localeKeys.filter((k) => {
					const localeVal = getLeafValue(localeMessages, k);
					const enVal = getLeafValue(enMessages, k);
					return localeVal === "" && enVal !== "";
				});
				expect(empty, `Empty values in ${locale}`).toEqual([]);
			});
		});
	}
});

// ─── Blog content files ───

describe("blog content translations", () => {
	const blogDir = join(CONTENT_DIR, "blog");
	const slugs = readdirSync(blogDir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && !d.name.startsWith("."))
		.map((d) => d.name);

	for (const slug of slugs) {
		describe(`blog/${slug}`, () => {
			it("has all locale files", () => {
				const files = readdirSync(join(blogDir, slug));
				const missing = LOCALES.filter((l) => !files.includes(`${l}.json`));
				expect(missing, `Missing locales for blog/${slug}`).toEqual([]);
			});

			for (const locale of LOCALES) {
				it(`${locale}.json is valid JSON with required fields`, () => {
					const filePath = join(blogDir, slug, `${locale}.json`);
					const content = loadJson(filePath);
					expect(content).toHaveProperty("title");
					expect(content).toHaveProperty("excerpt");
					expect(content).toHaveProperty("blocks");
					expect(Array.isArray(content.blocks)).toBe(true);
				});
			}
		});
	}
});

// ─── Legal content files ───

describe("legal content translations", () => {
	const legalDir = join(CONTENT_DIR, "legal");
	const pages = readdirSync(legalDir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

	for (const page of pages) {
		it(`legal/${page} has all locale files`, () => {
			const files = readdirSync(join(legalDir, page));
			const missing = LOCALES.filter((l) => !files.includes(`${l}.json`));
			expect(missing, `Missing locales for legal/${page}`).toEqual([]);
		});

		for (const locale of LOCALES) {
			it(`legal/${page}/${locale}.json is valid JSON`, () => {
				const filePath = join(legalDir, page, `${locale}.json`);
				expect(() => loadJson(filePath)).not.toThrow();
			});
		}
	}
});

// ─── All JSON files parse without errors ───

describe("all content JSON files are valid", () => {
	function collectJsonFiles(dir: string): string[] {
		const results: string[] = [];
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) {
				results.push(...collectJsonFiles(fullPath));
			} else if (entry.name.endsWith(".json")) {
				results.push(fullPath);
			}
		}
		return results;
	}

	const allJsonFiles = [
		...collectJsonFiles(MESSAGES_DIR),
		...collectJsonFiles(CONTENT_DIR),
	];

	for (const filePath of allJsonFiles) {
		const relativePath = filePath.replace(
			`${join(import.meta.dirname, "../..")}/`,
			""
		);
		it(`${relativePath} parses as valid JSON`, () => {
			expect(() => {
				JSON.parse(readFileSync(filePath, "utf-8"));
			}).not.toThrow();
		});
	}
});
