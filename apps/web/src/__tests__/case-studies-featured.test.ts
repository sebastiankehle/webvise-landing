import { describe, expect, it } from "vitest";
import { getFeaturedCaseStudies } from "../data/case-studies";

const ALLOWED_FEATURED_SLUGS = [
	"rautenberg-pitch-engine",
	"old-world-labs",
	"webvise",
];

describe("getFeaturedCaseStudies", () => {
	it("returns at most the featured-slug count", () => {
		const featured = getFeaturedCaseStudies("en");
		expect(featured.length).toBeLessThanOrEqual(ALLOWED_FEATURED_SLUGS.length);
	});

	it("only returns slugs that are in the featured list", () => {
		const featured = getFeaturedCaseStudies("en");
		for (const cs of featured) {
			expect(ALLOWED_FEATURED_SLUGS).toContain(cs.slug);
		}
	});

	it("returns full CaseStudy objects (with title and slug)", () => {
		const featured = getFeaturedCaseStudies("en");
		if (featured.length > 0) {
			expect(featured[0]).toHaveProperty("title");
			expect(featured[0]).toHaveProperty("slug");
			expect(featured[0]).toHaveProperty("client");
		}
	});

	it("preserves the order defined by FEATURED_CASE_STUDY_SLUGS", () => {
		const featured = getFeaturedCaseStudies("en");
		const slugs = featured.map((cs) => cs.slug);
		const order = ALLOWED_FEATURED_SLUGS.filter((s) => slugs.includes(s));
		expect(slugs).toEqual(order);
	});
});
