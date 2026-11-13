import { buildPartnerHtml } from "@webvise-app/api/routers/partner";
import { describe, expect, it } from "vitest";

const JS_HREF_RE = /href="javascript:/i;
const DATA_HREF_RE = /href="data:/i;

const base = {
	name: "Ada",
	email: "ada@example.com",
	discipline: "Design",
	interest: "network",
	timestamp: "now",
};

describe("buildPartnerHtml links", () => {
	it.each([
		"javascript:alert(1)",
		"data:text/html,x",
	])("renders %s as plain text", (value) => {
		const html = buildPartnerHtml({ ...base, linkedin: value });
		expect(html).not.toMatch(JS_HREF_RE);
		expect(html).not.toMatch(DATA_HREF_RE);
		expect(html).toContain(value);
	});

	it("turns a scheme-less value into an https link", () => {
		const html = buildPartnerHtml({ ...base, linkedin: "linkedin.com/in/x" });
		expect(html).toContain('href="https://linkedin.com/in/x"');
	});
});
