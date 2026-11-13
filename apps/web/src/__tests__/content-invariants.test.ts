import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { serviceDecks } from "@/data/decks";
import { services } from "@/data/services";
import { customSystems } from "@/data/systems";

vi.mock("@webvise-app/env/server", () => ({
	env: { NODE_ENV: "test" },
}));
vi.mock("@webvise-app/db", () => ({ db: {} }));

const { REPORTS } = await import("@webvise-app/api/routers/report-download");

const LOCALES = ["en", "de"] as const;
const WEB_DIR = join(import.meta.dirname, "../..");
const BLOG_DIR = join(WEB_DIR, "content/blog");

type Messages = Record<string, unknown>;

const messages: Record<(typeof LOCALES)[number], Messages> = {
	en: JSON.parse(readFileSync(join(WEB_DIR, "src/messages/en.json"), "utf-8")),
	de: JSON.parse(readFileSync(join(WEB_DIR, "src/messages/de.json"), "utf-8")),
};

function entryCount(root: Messages, path: string): number {
	let node: unknown = root;
	for (const part of path.split(".")) {
		node = (node as Messages | undefined)?.[part];
	}
	return node && typeof node === "object" ? Object.keys(node).length : -1;
}

const blockSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("p"), text: z.string() }),
	z.object({ type: z.literal("callout"), text: z.string() }),
	z.object({ type: z.literal("h2"), text: z.string() }),
	z.object({ type: z.literal("h3"), text: z.string() }),
	z.object({ type: z.literal("ul"), items: z.array(z.string()) }),
	z.object({ type: z.literal("ol"), items: z.array(z.string()) }),
	z.object({
		type: z.literal("table"),
		headers: z.array(z.string()),
		rows: z.array(z.array(z.string())),
	}),
	z.object({
		type: z.literal("download"),
		title: z.string(),
		description: z.string(),
		reportId: z.string(),
	}),
]);

const postSchema = z.object({
	blocks: z.array(blockSchema),
	excerpt: z.string(),
	title: z.string(),
	metaDescription: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const postFiles = readdirSync(BLOG_DIR).flatMap((slug) =>
	LOCALES.filter((locale) =>
		existsSync(join(BLOG_DIR, slug, `${locale}.json`))
	).map((locale) => ({ locale, slug }))
);

describe("service copy matches its counts", () => {
	for (const locale of LOCALES) {
		for (const service of services) {
			it(`${locale}: ${service.slug}`, () => {
				const base = `services.${service.translationKey}`;
				const m = messages[locale];
				expect(entryCount(m, `${base}.features`)).toBe(service.featureCount);
				expect(entryCount(m, `${base}.deliverables`)).toBe(
					service.deliverableCount
				);
				expect(entryCount(m, `${base}.faq`)).toBe(service.faqCount);
				expect(entryCount(m, `${base}.painPoints`)).toBe(
					service.painPointCount
				);
			});
		}
	}
});

describe("system copy matches its counts", () => {
	for (const locale of LOCALES) {
		for (const system of customSystems) {
			it(`${locale}: ${system.slug}`, () => {
				const base = `customSystems.items.${system.translationKey}.detail`;
				const m = messages[locale];
				expect(entryCount(m, `${base}.capabilities`)).toBe(
					system.capabilityCount
				);
				expect(entryCount(m, `${base}.modules`)).toBe(system.moduleCount);
				expect(entryCount(m, `${base}.outcomes`)).toBe(system.outcomeCount);
				expect(entryCount(m, `${base}.faq`)).toBe(system.faqCount);
				expect(entryCount(m, `${base}.painPoints`)).toBe(3);
			});
		}
	}
});

describe("decks and report ids", () => {
	it("lists the 13 service decks", () => {
		expect(serviceDecks.map((deck) => deck.slug)).toEqual([
			"leistungsuebersicht",
			"landing-pages",
			"mvp-development",
			"website-to-app-upgrades",
			"wordpress-migration",
			"internal-tools-dashboards",
			"client-portals-business-apps",
			"booking-event-platforms",
			"full-stack-applications",
			"ai-consulting",
			"company-brain-memory-systems",
			"ai-automation",
			"agentic-workflow-automation",
		]);
	});

	for (const deck of serviceDecks) {
		it(`deck ${deck.slug} has a report`, () => {
			expect(Object.hasOwn(REPORTS, deck.reportId)).toBe(true);
		});
	}

	for (const { locale, slug } of postFiles) {
		it(`blog ${slug}/${locale} download blocks name a report`, () => {
			const post = JSON.parse(
				readFileSync(join(BLOG_DIR, slug, `${locale}.json`), "utf-8")
			) as { blocks: { type: string; reportId?: string }[] };
			for (const block of post.blocks) {
				if (block.type === "download") {
					expect(Object.hasOwn(REPORTS, block.reportId ?? "")).toBe(true);
				}
			}
		});
	}
});

describe("report files exist", () => {
	for (const [id, report] of Object.entries(REPORTS)) {
		for (const locale of LOCALES) {
			it(`${id} (${locale})`, () => {
				expect(existsSync(join(WEB_DIR, "public", report[locale]))).toBe(true);
			});
		}
	}
});

describe("blog posts match the block schema", () => {
	for (const { locale, slug } of postFiles) {
		it(`${slug}/${locale}`, () => {
			const data = JSON.parse(
				readFileSync(join(BLOG_DIR, slug, `${locale}.json`), "utf-8")
			);
			const result = postSchema.safeParse(data);
			expect(result.error?.issues ?? []).toEqual([]);
		});
	}
});
