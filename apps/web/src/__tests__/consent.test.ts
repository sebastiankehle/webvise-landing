import { describe, expect, it } from "vitest";

import { analyticsCookieNames, parseConsent } from "@/lib/consent";

describe("parseConsent", () => {
	it("reads granted", () => {
		expect(parseConsent('{"choice":"granted","ts":1}')).toBe("granted");
	});
	it("reads denied", () => {
		expect(parseConsent('{"choice":"denied","ts":1}')).toBe("denied");
	});
	it("returns null for missing value", () => {
		expect(parseConsent(null)).toBeNull();
	});
	it("returns null for invalid JSON", () => {
		expect(parseConsent("{nope")).toBeNull();
	});
	it("returns null for wrong shape", () => {
		expect(parseConsent('{"choice":"maybe"}')).toBeNull();
		expect(parseConsent('"granted"')).toBeNull();
		expect(parseConsent("null")).toBeNull();
	});
});

describe("analyticsCookieNames", () => {
	it("picks PostHog and Google Analytics cookies", () => {
		const header =
			"ph_phc_x_posthog=1; _ga=2; _ga_ABC=3; _gid=4; session=5; NEXT_LOCALE=de; webvise-consent-v1=6";
		expect(analyticsCookieNames(header)).toEqual([
			"ph_phc_x_posthog",
			"_ga",
			"_ga_ABC",
			"_gid",
		]);
	});
	it("ignores unrelated cookies and empty headers", () => {
		expect(analyticsCookieNames("session=5; NEXT_LOCALE=de")).toEqual([]);
		expect(analyticsCookieNames("")).toEqual([]);
	});
});
