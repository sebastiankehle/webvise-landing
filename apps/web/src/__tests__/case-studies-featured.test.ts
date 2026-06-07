import { describe, expect, it } from "vitest";
import {
	CASE_STUDY_COLLECTIONS,
	getCaseStudies,
	getCaseStudyBySlug,
	getConceptCaseStudies,
	getFeaturedCaseStudies,
	getRelatedCaseStudies,
} from "../data/case-studies";

const LOCALES = ["en", "de", "es", "fr", "it", "nl", "pl"] as const;

describe("case study content module", () => {
	it("validates and loads every locale", () => {
		for (const locale of LOCALES) {
			const caseStudies = getCaseStudies(locale);
			expect(caseStudies.length).toBeGreaterThan(0);
			expect(caseStudies.map((caseStudy) => caseStudy.slug)).toContain("relay");

			for (const caseStudy of caseStudies) {
				expect(caseStudy.title).toEqual(expect.any(String));
				expect(caseStudy.client).toEqual(expect.any(String));
				expect(caseStudy.date).toEqual(expect.any(String));
				expect(["client", "concept"]).toContain(caseStudy.kind);
			}
		}
	});

	it("preserves the featured collection order", () => {
		const featured = getFeaturedCaseStudies("en");
		expect(featured.map((caseStudy) => caseStudy.slug)).toEqual([
			...CASE_STUDY_COLLECTIONS.featured,
		]);
	});

	it("returns full featured CaseStudy objects", () => {
		const featured = getFeaturedCaseStudies("en");
		expect(featured[0]).toHaveProperty("title");
		expect(featured[0]).toHaveProperty("slug");
		expect(featured[0]).toHaveProperty("client");
	});

	it("keeps concept studies behind an explicit collection", () => {
		const conceptCaseStudies = getConceptCaseStudies("en");
		expect(conceptCaseStudies.map((caseStudy) => caseStudy.slug)).toEqual([
			...CASE_STUDY_COLLECTIONS.concept,
		]);
		expect(
			conceptCaseStudies.every((caseStudy) => caseStudy.kind === "concept")
		).toBe(true);
	});

	it("filters concept and client studies through the same interface", () => {
		const conceptSlugs = new Set<string>(CASE_STUDY_COLLECTIONS.concept);
		const concepts = getCaseStudies("en", { kind: "concept" });
		const clients = getCaseStudies("en", { kind: "client" });

		expect(concepts.map((caseStudy) => caseStudy.slug)).toEqual([
			...CASE_STUDY_COLLECTIONS.concept,
		]);
		expect(clients.some((caseStudy) => conceptSlugs.has(caseStudy.slug))).toBe(
			false
		);
	});

	it("keeps locale content local while preserving source metadata", () => {
		const relay = getCaseStudyBySlug("relay", "de");
		expect(relay).toMatchObject({
			client: "Relay",
			kind: "concept",
			slug: "relay",
		});
		expect(relay?.industry).toEqual("KI-Agenten / Service Operations");
	});

	it("returns related studies in the same sorted order without the current slug", () => {
		const related = getRelatedCaseStudies("relay", "en", 2);
		const expected = getCaseStudies("en")
			.filter((caseStudy) => caseStudy.slug !== "relay")
			.slice(0, 2);

		expect(related).toEqual(expected);
	});
});
