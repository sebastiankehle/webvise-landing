import { gateway } from "@ai-sdk/gateway";
import { env } from "@webvise-app/env/server";
import { generateText } from "ai";
import { sendEmail } from "../../email/resend";
import { emailLayout, escapeHtml, s, tableRow } from "../../email/template";
import { safeFetchText } from "../../safe-fetch";
import { UrlValidationError, validateUrl } from "../../url-validation";
import { recordLead } from "../leads";
import { type GeoResult, runGeoChecks } from "../wp-health/geo-checks";
import { PAGE_FETCH_OPTIONS } from "../wp-health/tech-detect";
import {
	analyzeAnswer,
	type Citation,
	type PromptId,
	siteHost,
	summarize,
	type VisibilitySummary,
} from "./detect";

export type Assistant = "chatgpt" | "gemini" | "perplexity";
export type CheckLocale = "de" | "en";

/**
 * One model per assistant, as listed on AI Gateway (checked November 2026).
 * Reasoning stays off or low: these are short factual answers, and reasoning
 * tokens would count against the output cap.
 */
export const ASSISTANT_MODELS = [
	{
		assistant: "chatgpt",
		model: "openai/gpt-6.1-terra",
		providerOptions: { openai: { reasoningEffort: "none" } },
	},
	{
		assistant: "gemini",
		model: "google/gemini-3.8-flash",
		providerOptions: { google: { thinkingConfig: { thinkingLevel: "low" } } },
	},
	{
		assistant: "perplexity",
		model: "perplexity/sonar",
		providerOptions: {},
	},
] as const satisfies readonly {
	assistant: Assistant;
	model: string;
	providerOptions: Record<string, Record<string, unknown>>;
}[];

const SYSTEM_PROMPT =
	"Answer briefly, in at most 120 words, in the language of the question.";
const MAX_OUTPUT_TOKENS = 400;
const MODEL_TIMEOUT_MS = 30_000;

export interface CheckInput {
	brand: string;
	category?: string;
	city?: string;
	email?: string;
	firstName?: string;
	locale: CheckLocale;
	url: string;
}

/**
 * The fixed questions, asked as a visitor would type them. The recommendation
 * question needs a category; without one only two questions run.
 */
export function buildPrompts(
	input: Pick<CheckInput, "brand" | "category" | "city" | "locale">
): { id: PromptId; question: string }[] {
	const { brand, category, city, locale } = input;
	const de = locale === "de";
	const where = city ? ` in ${city}` : "";
	const prompts: { id: PromptId; question: string }[] = [
		{ id: "brand", question: de ? `Was ist ${brand}?` : `What is ${brand}?` },
	];
	if (category) {
		prompts.push({
			id: "recommend",
			// "Wen … als" avoids guessing the German article of the category.
			question: de
				? `Wen würden Sie als ${category}${where} empfehlen?`
				: `Which ${category}${where} would you recommend?`,
		});
	}
	prompts.push({
		id: "website",
		question: de
			? `Wie lautet die Website von ${brand}?`
			: `What is the website of ${brand}?`,
	});
	return prompts;
}

export interface VisibilityAnswer {
	assistant: Assistant;
	citations: Citation[];
	cited: boolean;
	mentioned: boolean;
	ok: boolean;
	prompt: PromptId;
	snippet: string;
}

export interface VisibilityResult {
	answers: VisibilityAnswer[];
	brand: string;
	geo: GeoResult;
	host: string;
	models: { assistant: Assistant; model: string }[];
	prompts: { id: PromptId; question: string }[];
	summary: VisibilitySummary<Assistant>;
	url: string;
}

export type CheckOutcome =
	| { ok: true; result: VisibilityResult }
	| { ok: false; error: { kind: "invalid_url"; message: string } }
	| { ok: false; error: { kind: "models_failed" } };

async function ask(
	entry: (typeof ASSISTANT_MODELS)[number],
	question: string
): Promise<{ text: string; sources: string[] }> {
	const result = await generateText({
		model: gateway(entry.model),
		system: SYSTEM_PROMPT,
		prompt: question,
		maxOutputTokens: MAX_OUTPUT_TOKENS,
		maxRetries: 1,
		abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
		providerOptions: entry.providerOptions,
	});
	return {
		text: result.text,
		sources: result.sources.flatMap((source) =>
			source.sourceType === "url" ? [source.url] : []
		),
	};
}

/** Fetch the homepage once; a failed fetch still runs the robots.txt and llms.txt checks. */
async function checkSite(url: string): Promise<GeoResult> {
	let html: string | null = null;
	try {
		html = (await safeFetchText(url, PAGE_FETCH_OPTIONS)).text;
	} catch {
		html = null;
	}
	return runGeoChecks(url, html);
}

function verdictText(verdict: boolean | null): string {
	if (verdict === null) {
		return "n/a";
	}
	return verdict ? "yes" : "no";
}

function leadLines(result: VisibilityResult, input: CheckInput): string[] {
	const { summary } = result;
	const count = (tally: { of: number; yes: number }) =>
		`${tally.yes}/${tally.of}`;
	return [
		`URL: ${result.url}`,
		`Brand: ${result.brand}`,
		input.category ? `Category: ${input.category}` : null,
		input.city ? `City: ${input.city}` : null,
		`Knows the brand: ${count(summary.knows)}, recommends it: ${count(summary.recommends)}, cites the site: ${count(summary.citesSite)}`,
		...summary.models.map(
			(m) =>
				`${m.model}: knows ${verdictText(m.knows)}, recommends ${verdictText(m.recommends)}, cites site ${verdictText(m.citesSite)}`
		),
		`llms.txt: ${result.geo.llmsTxt ? "yes" : "no"}`,
		`AI crawlers: ${result.geo.aiCrawlers}`,
		`Structured data: ${result.geo.jsonLdTypes.join(", ") || "none"}`,
	].filter((line): line is string => line !== null);
}

async function captureLead(
	email: string,
	input: CheckInput,
	result: VisibilityResult
): Promise<void> {
	const lines = leadLines(result, input);
	await Promise.allSettled([
		recordLead({
			type: "ai_visibility_check",
			email,
			name: input.firstName,
			placement: "ai_visibility_check",
			path: "/tools/ai-visibility-check",
			topic: result.host,
			note: { title: "AI visibility check", content: lines.join("\n") },
		}),
		sendEmail({
			label: "ai-visibility-admin",
			from: "webvise <noreply@webvise.io>",
			to: env.CONTACT_EMAIL_TO,
			replyTo: email,
			subject: `AI visibility lead: ${result.brand} (${result.host})`,
			html: emailLayout({
				label: "AI visibility check",
				content: `
      <h1 style="${s.h1}">${escapeHtml(result.brand)}</h1>
      <table style="border-collapse:collapse;width:100%">${[
				tableRow("Email", escapeHtml(email)),
				input.firstName ? tableRow("Name", escapeHtml(input.firstName)) : "",
				tableRow("Language", input.locale),
			].join("")}</table>
      <hr style="${s.hr}">
      <p style="margin:0;font-size:14px;color:#0e1217;line-height:1.6;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</p>`,
			}),
			text: [
				"AI visibility check lead",
				"",
				`Email: ${email}`,
				input.firstName ? `Name: ${input.firstName}` : null,
				`Language: ${input.locale}`,
				"",
				...lines,
			]
				.filter((line) => line !== null)
				.join("\n"),
		}),
	]);
}

/**
 * Asks each assistant the fixed questions (at most 9 calls, all in parallel),
 * checks the answers for the brand and its site, and runs the technical GEO
 * checks alongside. A failed model call marks that answer as failed instead
 * of failing the whole check.
 */
export async function runAiVisibilityCheck(
	input: CheckInput
): Promise<CheckOutcome> {
	try {
		await validateUrl(input.url);
	} catch (e) {
		const message =
			e instanceof UrlValidationError
				? e.message
				: "Could not validate the URL.";
		return { ok: false, error: { kind: "invalid_url", message } };
	}

	const host = siteHost(input.url);
	const prompts = buildPrompts(input);
	const answerOne = async (
		entry: (typeof ASSISTANT_MODELS)[number],
		prompt: PromptId,
		question: string
	): Promise<VisibilityAnswer> => {
		const base = { assistant: entry.assistant, prompt };
		try {
			const reply = await ask(entry, question);
			return {
				...base,
				ok: true,
				...analyzeAnswer({ brand: input.brand, host, ...reply }),
			};
		} catch (e) {
			console.error(
				`[ai-visibility] ${entry.model} failed:`,
				e instanceof Error ? e.message : e
			);
			return {
				...base,
				ok: false,
				mentioned: false,
				cited: false,
				snippet: "",
				citations: [],
			};
		}
	};

	const [answers, geo] = await Promise.all([
		Promise.all(
			ASSISTANT_MODELS.flatMap((entry) =>
				prompts.map((prompt) => answerOne(entry, prompt.id, prompt.question))
			)
		),
		checkSite(input.url),
	]);

	if (!answers.some((a) => a.ok)) {
		return { ok: false, error: { kind: "models_failed" } };
	}

	const result: VisibilityResult = {
		url: input.url,
		brand: input.brand,
		host,
		models: ASSISTANT_MODELS.map(({ assistant, model }) => ({
			assistant,
			model,
		})),
		prompts,
		answers,
		summary: summarize(answers.map((a) => ({ ...a, model: a.assistant }))),
		geo,
	};

	if (input.email) {
		await captureLead(input.email.trim().toLowerCase(), input, result);
	}

	return { ok: true, result };
}
