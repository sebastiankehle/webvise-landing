import {
	analyzeAnswer,
	findCitations,
	isBrandMentioned,
	isDeclined,
	makeSnippet,
	siteHost,
	summarize,
} from "@webvise-app/api/services/ai-visibility/detect";
import { describe, expect, it } from "vitest";

describe("siteHost", () => {
	it("lowercases the host and drops www", () => {
		expect(siteHost("https://www.WebVise.io/en/tools")).toBe("webvise.io");
		expect(siteHost("http://shop.example.de")).toBe("shop.example.de");
	});
});

describe("isBrandMentioned", () => {
	it("matches the brand as a whole word, in any case", () => {
		expect(isBrandMentioned("**Webvise** is a studio.", "webvise")).toBe(true);
		expect(isBrandMentioned("Try webvise’s free tools.", "Webvise")).toBe(true);
		expect(isBrandMentioned("See webvise.io for more.", "webvise")).toBe(true);
	});

	it("does not match the brand inside another word", () => {
		expect(isBrandMentioned("Supervise your team.", "vise")).toBe(false);
		expect(isBrandMentioned("webviseful tips", "webvise")).toBe(false);
	});

	it("ignores the legal form and separators", () => {
		expect(
			isBrandMentioned("Ask Muster Bau about it.", "Muster Bau GmbH")
		).toBe(true);
		expect(isBrandMentioned("Muster-Bau builds homes.", "Muster Bau")).toBe(
			true
		);
		expect(isBrandMentioned("MusterBau builds homes.", "Muster Bau")).toBe(
			true
		);
	});

	it("handles umlauts and other letters", () => {
		expect(
			isBrandMentioned(
				"Die Märkische Projektbau baut in Potsdam.",
				"märkische projektbau"
			)
		).toBe(true);
		expect(isBrandMentioned("Märkischer Verlag", "Märkische")).toBe(false);
	});

	it("returns false for a blank brand", () => {
		expect(isBrandMentioned("anything", "  ")).toBe(false);
	});
});

describe("isDeclined", () => {
	it("spots answers that say they do not know the subject", () => {
		expect(
			isDeclined("I don't have specific information about Acme Studio.")
		).toBe(true);
		expect(isDeclined("I'm not familiar with a company called Acme.")).toBe(
			true
		);
		expect(
			isDeclined("Zu Acme liegen mir keine verlässlichen Informationen vor.")
		).toBe(true);
		expect(isDeclined("Acme ist mir nicht bekannt.")).toBe(true);
	});

	it("spots answers that treat the brand as a common name", () => {
		expect(
			isDeclined(
				"„Webvise“ ist ein Name, den verschiedene Unternehmen und digitale Dienste verwenden."
			)
		).toBe(true);
		expect(
			isDeclined(
				"Webvise (oft als Eigenname für Digital- und Webagenturen verwendet) bezeichnet meist Dienstleister."
			)
		).toBe(true);
		expect(
			isDeclined(
				"Webvise bezieht sich meist auf ein dänisches IT-Beratungsunternehmen."
			)
		).toBe(true);
		expect(isDeclined("Acme could refer to several things.")).toBe(true);
		expect(
			isDeclined("There are several companies called Acme in Germany.")
		).toBe(true);
	});

	it("accepts a description that mentions many clients", () => {
		expect(
			isDeclined(
				"Acme is a studio in Potsdam that builds websites for various businesses."
			)
		).toBe(false);
		expect(
			isDeclined(
				"Acme ist eine Agentur aus Potsdam, die für verschiedene Unternehmen Websites baut."
			)
		).toBe(false);
	});

	it("only looks at the start of the answer", () => {
		const answer = `Acme is a design studio in Potsdam that builds websites. ${"It works with small firms. ".repeat(10)}I don't know their prices.`;
		expect(isDeclined(answer)).toBe(false);
	});

	it("accepts a normal description", () => {
		expect(isDeclined("Acme is a web agency in Potsdam.")).toBe(false);
	});
});

describe("findCitations", () => {
	it("marks the brand's own URLs from sources and puts them first", () => {
		const citations = findCitations(
			"",
			[
				"https://feedbax.ai/web-design/potsdam",
				"https://www.webvise.io/en/services",
				"https://blog.webvise.io/post",
			],
			"webvise.io"
		);
		expect(citations).toEqual([
			{ url: "https://www.webvise.io/en/services", own: true },
			{ url: "https://blog.webvise.io/post", own: true },
			{ url: "https://feedbax.ai/web-design/potsdam", own: false },
		]);
	});

	it("reads URLs from the text and trims trailing punctuation", () => {
		expect(
			findCitations(
				"See [the site](https://webvise.io/en). Or https://other.com/x.",
				[],
				"webvise.io"
			)
		).toEqual([
			{ url: "https://webvise.io/en", own: true },
			{ url: "https://other.com/x", own: false },
		]);
	});

	it("counts a bare domain in the text as citing the site", () => {
		expect(
			findCitations("Their website is www.webvise.io.", [], "webvise.io")
		).toEqual([{ url: "https://webvise.io", own: true }]);
	});

	it("does not treat a lookalike domain as the brand's site", () => {
		expect(
			findCitations(
				"Visit notwebvise.io or https://webvise.io.evil.com/",
				[],
				"webvise.io"
			)
		).toEqual([{ url: "https://webvise.io.evil.com/", own: false }]);
	});

	it("drops duplicates and ignores invalid or non-web source URLs", () => {
		expect(
			findCitations(
				"https://webvise.io/",
				[
					"https://webvise.io",
					"not a url",
					"javascript:alert(1)",
					"ftp://webvise.io/file",
				],
				"webvise.io"
			)
		).toEqual([{ url: "https://webvise.io", own: true }]);
	});
});

describe("makeSnippet", () => {
	it("starts at the sentence that names the brand", () => {
		const text =
			"There are several agencies in Potsdam. **webvise** builds websites and software[2]. It was founded in 2016.";
		expect(makeSnippet(text, "webvise")).toBe(
			"…webvise builds websites and software. It was founded in 2016."
		);
	});

	it("falls back to the start of the answer and shortens long text", () => {
		const text = `Here are some options. ${"Agency A is good. ".repeat(30)}`;
		const snippet = makeSnippet(text, "webvise");
		expect(snippet.startsWith("Here are some options.")).toBe(true);
		expect(snippet.endsWith("…")).toBe(true);
		expect(snippet.length).toBeLessThanOrEqual(241);
	});
});

describe("analyzeAnswer", () => {
	const base = { brand: "webvise", host: "webvise.io" };

	it("reports a named and cited answer", () => {
		const result = analyzeAnswer({
			...base,
			text: "webvise is a studio in Potsdam[1].",
			sources: ["https://www.webvise.io/en"],
		});
		expect(result.mentioned).toBe(true);
		expect(result.cited).toBe(true);
		expect(result.citations).toEqual([
			{ url: "https://www.webvise.io/en", own: true },
		]);
		expect(result.snippet).toBe("webvise is a studio in Potsdam.");
	});

	it("does not count a refusal that repeats the name", () => {
		const result = analyzeAnswer({
			...base,
			text: "I'm not familiar with webvise. Could you share more details?",
			sources: [],
		});
		expect(result.mentioned).toBe(false);
		expect(result.cited).toBe(false);
	});

	it("counts the domain alone as naming the brand", () => {
		const result = analyzeAnswer({
			...base,
			brand: "Studio Kehle",
			text: "Try the team behind webvise.io.",
			sources: [],
		});
		expect(result.mentioned).toBe(true);
		expect(result.cited).toBe(true);
	});

	it("reports a cited source without a named brand", () => {
		const result = analyzeAnswer({
			...base,
			text: "Agency A and Agency B are well rated[1].",
			sources: ["https://webvise.io/en/case-studies"],
		});
		expect(result.mentioned).toBe(false);
		expect(result.cited).toBe(true);
	});
});

describe("summarize", () => {
	it("gives each assistant a verdict per question and counts the yeses", () => {
		const summary = summarize([
			{
				model: "chatgpt",
				prompt: "brand",
				ok: true,
				mentioned: false,
				cited: false,
				citations: [],
			},
			{
				model: "chatgpt",
				prompt: "recommend",
				ok: false,
				mentioned: false,
				cited: false,
				citations: [],
			},
			{
				model: "chatgpt",
				prompt: "website",
				ok: true,
				mentioned: true,
				cited: false,
				citations: [],
			},
			{
				model: "perplexity",
				prompt: "brand",
				ok: true,
				mentioned: true,
				cited: true,
				citations: [],
			},
			{
				model: "perplexity",
				prompt: "recommend",
				ok: true,
				mentioned: true,
				cited: false,
				citations: [],
			},
			{
				model: "perplexity",
				prompt: "website",
				ok: true,
				mentioned: true,
				cited: true,
				citations: [],
			},
		]);
		expect(summary).toEqual({
			knows: { yes: 1, of: 2 },
			recommends: { yes: 1, of: 1 },
			citesSite: { yes: 1, of: 2 },
			models: [
				{ model: "chatgpt", knows: false, recommends: null, citesSite: false },
				{ model: "perplexity", knows: true, recommends: true, citesSite: true },
			],
		});
	});

	it("does not count a description when the assistant gives another website", () => {
		const other = [{ url: "https://webvise.de", own: false }];
		const summary = summarize([
			{
				model: "chatgpt",
				prompt: "brand",
				ok: true,
				mentioned: true,
				cited: false,
				citations: [],
			},
			{
				model: "chatgpt",
				prompt: "website",
				ok: true,
				mentioned: true,
				cited: false,
				citations: other,
			},
			{
				model: "gemini",
				prompt: "brand",
				ok: true,
				mentioned: true,
				cited: false,
				citations: [],
			},
			{
				model: "gemini",
				prompt: "website",
				ok: true,
				mentioned: false,
				cited: false,
				citations: [],
			},
		]);
		expect(summary.models.map((m) => m.knows)).toEqual([false, true]);
	});

	it("reports null for an assistant that never answered", () => {
		const summary = summarize([
			{
				model: "gemini",
				prompt: "brand",
				ok: false,
				mentioned: false,
				cited: false,
				citations: [],
			},
		]);
		expect(summary.models).toEqual([
			{ model: "gemini", knows: null, recommends: null, citesSite: null },
		]);
		expect(summary.knows).toEqual({ yes: 0, of: 0 });
	});
});
