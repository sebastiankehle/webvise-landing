import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { getOfferingBySlug } from "@/data/offerings";
import {
	type Answers,
	BAND_LIMITS,
	BANDS,
	bandFor,
	estimate,
	INTEGRATION_EXCLUSIVE,
	INTEGRATIONS,
	isComplete,
	PROJECT_TYPES,
	QUESTION_ORDER,
	questionOptions,
	questionPoints,
	summaryText,
	toggleIntegration,
} from "@/lib/project-scope";

const smallSite: Answers = {
	project: "website",
	size: "small",
	users: "public",
	integrations: ["none"],
	migration: "none",
	ai: "none",
	languages: "one",
	design: "ready",
	deadline: "flexible",
	support: "handover",
};

const relaunch: Answers = {
	project: "relaunch",
	size: "large",
	users: "public",
	integrations: ["crm", "email"],
	migration: "lots",
	ai: "none",
	languages: "two",
	design: "brand",
	deadline: "flexible",
	support: "occasional",
};

const portal: Answers = {
	project: "portal",
	size: "medium",
	users: "fewRoles",
	integrations: ["payments", "crm", "accounting"],
	migration: "some",
	ai: "assist",
	languages: "two",
	design: "brand",
	deadline: "quarter",
	support: "ongoing",
};

describe("bandFor", () => {
	it("reads the sum as compact, medium or extensive", () => {
		expect(bandFor(0)).toBe("compact");
		expect(bandFor(BAND_LIMITS.compact)).toBe("compact");
		expect(bandFor(BAND_LIMITS.compact + 1)).toBe("medium");
		expect(bandFor(BAND_LIMITS.medium)).toBe("medium");
		expect(bandFor(BAND_LIMITS.medium + 1)).toBe("extensive");
	});
});

describe("estimate", () => {
	it("keeps a small brochure site compact, with nothing driving effort", () => {
		const result = estimate(smallSite);
		expect(result).toEqual({
			band: "compact",
			drivers: [],
			openQuestions: [],
			score: 0,
			service: { group: "launch", slug: "landing-pages" },
		});
	});

	it("puts a relaunch with lots of content in the medium band", () => {
		const result = estimate(relaunch);
		expect(result.score).toBe(9);
		expect(result.band).toBe("medium");
		// The two-point answers in the order asked, then the first one-point one.
		expect(result.drivers).toEqual([
			"size",
			"integrations",
			"migration",
			"project",
		]);
		expect(result.service).toEqual({
			group: "launch",
			slug: "wordpress-migration",
		});
	});

	it("puts a portal with roles and several integrations in the extensive band", () => {
		const result = estimate(portal);
		expect(result.score).toBe(13);
		expect(result.band).toBe("extensive");
		expect(result.drivers.slice(0, 3)).toEqual([
			"project",
			"users",
			"integrations",
		]);
		expect(result.service).toEqual({
			group: "operate",
			slug: "client-portals-business-apps",
		});
	});

	it("never lists more than four drivers or open questions", () => {
		const result = estimate({
			project: "booking",
			size: "xlarge",
			users: "manyRoles",
			integrations: ["payments", "crm", "accounting", "calendar", "email"],
			migration: "complex",
			ai: "core",
			languages: "more",
			design: "none",
			deadline: "soon",
			support: "ongoing",
		});
		expect(result.score).toBe(24);
		expect(result.band).toBe("extensive");
		expect(result.drivers).toEqual([
			"project",
			"size",
			"users",
			"integrations",
		]);
		expect(result.openQuestions).toHaveLength(4);
	});

	it("asks about 'not sure' answers first and never calls them drivers", () => {
		const result = estimate({
			...relaunch,
			size: "unsure",
			integrations: ["unsure"],
		});
		expect(result.openQuestions.slice(0, 2)).toEqual(["size", "integrations"]);
		expect(result.drivers).not.toContain("size");
		expect(result.drivers).not.toContain("integrations");
	});

	it("sends 'something else' to the services overview and asks what it is", () => {
		const result = estimate({ ...smallSite, project: "other" });
		expect(result.service).toBeNull();
		expect(result.openQuestions).toEqual(["project"]);
		expect(result.drivers).toEqual([]);
	});
});

describe("integrations", () => {
	it("scores the number of systems in steps", () => {
		const points = (integrations: Answers["integrations"]) =>
			questionPoints({ integrations }, "integrations");
		expect(points(["none"])).toBe(0);
		expect(points(["crm"])).toBe(1);
		expect(points(["crm", "email"])).toBe(2);
		expect(points(["crm", "email", "payments"])).toBe(2);
		expect(points(["crm", "email", "payments", "calendar"])).toBe(3);
		expect(points(["unsure"])).toBe(1);
	});

	it("keeps 'none' and 'not sure' apart from real systems", () => {
		expect(toggleIntegration(["crm"], "email")).toEqual(["crm", "email"]);
		expect(toggleIntegration(["crm", "email"], "crm")).toEqual(["email"]);
		expect(toggleIntegration(["crm", "email"], "none")).toEqual(["none"]);
		expect(toggleIntegration(["none"], "crm")).toEqual(["crm"]);
		expect(toggleIntegration(["unsure"], "none")).toEqual(["none"]);
		expect(toggleIntegration(["none"], "none")).toEqual([]);
	});
});

describe("isComplete", () => {
	it("needs an answer to every question", () => {
		expect(isComplete(smallSite)).toBe(true);
		expect(isComplete({ ...smallSite, integrations: [] })).toBe(false);
		expect(isComplete({ ...smallSite, deadline: undefined })).toBe(false);
	});
});

describe("project types", () => {
	it("point at a real service page in the same group", () => {
		for (const [id, type] of Object.entries(PROJECT_TYPES)) {
			if (type.slug === null) {
				continue;
			}
			expect(getOfferingBySlug(type.slug)?.group, id).toBe(type.group);
		}
	});
});

describe("summaryText", () => {
	it("lists every answer, the band, drivers, open questions and the service", () => {
		const t = (key: string, values?: Record<string, string | number>) =>
			values ? `${key}${JSON.stringify(values)}` : key;
		const text = summaryText({
			answers: relaunch,
			result: estimate(relaunch),
			service: { title: "Migrations", url: "https://example.test/s" },
			t,
			toolUrl: "https://example.test/tool",
		});
		const lines = text.split("\n");
		expect(lines[0]).toBe("summary.heading (https://example.test/tool)");
		for (const question of QUESTION_ORDER) {
			expect(text).toContain(`questions.${question}.short: `);
		}
		expect(text).toContain(
			"questions.integrations.short: questions.integrations.options.crm.label, questions.integrations.options.email.label"
		);
		expect(text).toContain("summary.band: bands.medium.title");
		expect(text).toContain("- drivers.migration.lots");
		expect(text).toContain("- clarify.goals");
		expect(lines.at(-1)).toBe(
			"summary.service: Migrations (https://example.test/s)"
		);
	});
});

describe("copy", () => {
	const messagesDir = join(import.meta.dirname, "../messages");

	for (const locale of ["en", "de"]) {
		it(`${locale} has words for every question, answer, driver and band`, () => {
			const messages = JSON.parse(
				readFileSync(join(messagesDir, `${locale}.json`), "utf-8")
			) as { projectScope: Record<string, unknown> };
			const has = (key: string) => {
				let node: unknown = messages.projectScope;
				for (const part of key.split(".")) {
					node = (node as Record<string, unknown> | undefined)?.[part];
				}
				return typeof node === "string" && node.length > 0;
			};
			const missing: string[] = [];
			const need = (key: string) => {
				if (!has(key)) {
					missing.push(key);
				}
			};

			for (const question of QUESTION_ORDER) {
				need(`questions.${question}.title`);
				need(`questions.${question}.short`);
				need(`clarify.${question}`);
				if (question === "integrations") {
					continue;
				}
				for (const option of questionOptions(question)) {
					need(`questions.${question}.options.${option}.label`);
					const answer = { [question]: option } as Answers;
					if (
						option !== "unsure" &&
						option !== "other" &&
						questionPoints(answer, question) > 0
					) {
						need(`drivers.${question}.${option}`);
					}
				}
			}
			for (const option of [...INTEGRATIONS, ...INTEGRATION_EXCLUSIVE]) {
				need(`questions.integrations.options.${option}.label`);
			}
			for (const band of BANDS) {
				need(`bands.${band}.title`);
				need(`bands.${band}.description`);
			}
			need("drivers.integrations");
			need("drivers.none");
			need("clarify.goals");

			expect(missing).toEqual([]);
		});
	}
});
