/**
 * Pure checks on one AI answer: is the brand named, is the brand's own site
 * cited, and what short snippet to show. No network, no model calls.
 */

export interface Citation {
	own: boolean;
	url: string;
}

export interface AnswerAnalysis {
	citations: Citation[];
	cited: boolean;
	mentioned: boolean;
	snippet: string;
}

const LEGAL_SUFFIX_RE =
	/[\s,]+(gmbh(\s*&\s*co\.?\s*kg)?|ug(\s*\(haftungsbeschränkt\))?|ag|kg|ohg|gbr|e\.\s?k\.|ltd\.?|limited|inc\.?|llc|corp\.?)$/i;
const BRAND_SEPARATOR_RE = /[\s\-_.]+/;
const REGEX_SPECIAL_RE = /[.*+?^${}()|[\]\\]/g;
const WWW_RE = /^www\./;
const URL_RE = /https?:\/\/[^\s<>()[\]{}"'`|]+/gi;
const URL_TRAILING_RE = /[.,;:!?*_'"]+$/;
const TRAILING_SLASH_RE = /\/+$/;
const CITATION_MARKER_RE = /\[\d+(?:\s*,\s*\d+)*\]/g;
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_MARK_RE = /[*#`>]+/g;
const WHITESPACE_RE = /\s+/g;
const SENTENCE_END_RE = /[.!?]\s/g;

/**
 * Opening phrases of an answer that says it does not know the subject, in
 * English and German. Only the start of an answer is checked, so a later
 * "I don't know their prices" does not hide a real description.
 */
const DECLINE_RE =
	/(i (do not|don't|don’t) (have|know|find)|i('m|’m| am) not (familiar|aware|sure)|i (could|can)( not|not|n't|n’t) find|no (reliable |specific |verified |public |detailed )?information|keine (verlässlichen |konkreten |genauen |gesicherten |spezifischen |näheren |weiteren )?(informationen|angaben)|(ist )?mir nicht bekannt|kenne ich (leider )?nicht|konnte (ich )?keine|nicht eindeutig zuordnen)/i;
/**
 * Openings that treat the brand as a common name rather than one business:
 * "a name used by various companies", "could refer to", "bezeichnet meist".
 */
const AMBIGUOUS_RE =
	/((could|may|might|can) refer to|(usually|generally|often|mostly|most commonly) refers to|there are (several|multiple|many|various) (companies|businesses|firms)|\b(name|term)\b[^.]{0,40}\b(used by|shared by) (various|several|many|multiple|different)|(kann|könnte) sich [^.]{0,40}beziehen|bezeichnet (meist|oft|häufig|in der regel)|bezieht sich (meist|meistens|oft|häufig|in der regel|vor allem) auf|es gibt (mehrere|verschiedene|viele) (unternehmen|firmen|anbieter)|\b(name|eigenname|begriff|bezeichnung)\b[^.]{0,40}(verschiedene|mehrere|unterschiedliche|viele)|eigenname für)/i;
const DECLINE_WINDOW = 240;

const SNIPPET_LENGTH = 240;
const MAX_CITATIONS = 8;

function escapeRegExp(value: string): string {
	return value.replace(REGEX_SPECIAL_RE, "\\$&");
}

/** The site's host without "www.", lowercased: `https://www.Foo.de/x` → `foo.de`. */
export function siteHost(url: string): string {
	return new URL(url).hostname.toLowerCase().replace(WWW_RE, "");
}

/** Matches the brand as a whole word, ignoring case, legal form and separators. */
function brandPattern(brand: string): RegExp | null {
	const core = brand.normalize("NFC").trim().replace(LEGAL_SUFFIX_RE, "");
	const tokens = core
		.toLowerCase()
		.split(BRAND_SEPARATOR_RE)
		.filter(Boolean)
		.map(escapeRegExp);
	if (tokens.length === 0) {
		return null;
	}
	return new RegExp(
		`(?<![\\p{L}\\p{N}])${tokens.join("[\\s\\-_.]*")}(?![\\p{L}\\p{N}])`,
		"iu"
	);
}

export function isBrandMentioned(text: string, brand: string): boolean {
	return brandPattern(brand)?.test(text.normalize("NFC")) ?? false;
}

/** True when the answer opens by saying it does not know the brand, or that the name is ambiguous. */
export function isDeclined(text: string): boolean {
	const opening = text.slice(0, DECLINE_WINDOW);
	return DECLINE_RE.test(opening) || AMBIGUOUS_RE.test(opening);
}

/** The host of an http(s) URL; null for anything else, so only web links reach the page. */
function hostOf(url: string): string | null {
	try {
		const { protocol } = new URL(url);
		return protocol === "http:" || protocol === "https:" ? siteHost(url) : null;
	} catch {
		return null;
	}
}

function isOwnHost(candidate: string | null, host: string): boolean {
	return !!candidate && (candidate === host || candidate.endsWith(`.${host}`));
}

function bareDomainPattern(host: string): RegExp {
	return new RegExp(
		`(?<![\\p{L}\\p{N}.\\-/])(?:www\\.)?${escapeRegExp(host)}(?![\\p{L}\\p{N}\\-])`,
		"iu"
	);
}

/**
 * Every URL the answer cites, from the model's returned sources and from the
 * text itself, with the brand's own site first. A bare mention of the domain
 * ("webvise.io") counts as citing the site.
 */
export function findCitations(
	text: string,
	sourceUrls: string[],
	host: string
): Citation[] {
	const fromText = [...text.matchAll(URL_RE)].map((m) =>
		m[0].replace(URL_TRAILING_RE, "")
	);
	const seen = new Set<string>();
	const citations: Citation[] = [];
	for (const url of [...sourceUrls, ...fromText]) {
		const urlHost = hostOf(url);
		if (!urlHost) {
			continue;
		}
		const key = `${urlHost}${new URL(url).pathname.replace(TRAILING_SLASH_RE, "")}`;
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		citations.push({ url, own: isOwnHost(urlHost, host) });
	}
	if (
		!citations.some((c) => c.own) &&
		bareDomainPattern(host).test(text.normalize("NFC"))
	) {
		citations.push({ url: `https://${host}`, own: true });
	}
	return [
		...citations.filter((c) => c.own),
		...citations.filter((c) => !c.own),
	].slice(0, MAX_CITATIONS);
}

/** Strips Markdown and citation markers so the snippet reads as plain text. */
function plainText(text: string): string {
	return text
		.replace(MARKDOWN_LINK_RE, "$1")
		.replace(CITATION_MARKER_RE, "")
		.replace(MARKDOWN_MARK_RE, "")
		.replace(WHITESPACE_RE, " ")
		.trim();
}

/**
 * A short excerpt: the sentence that names the brand if there is one,
 * otherwise the start of the answer.
 */
export function makeSnippet(text: string, brand: string): string {
	const plain = plainText(text);
	const match = brandPattern(brand)?.exec(plain);
	let start = 0;
	if (match) {
		for (const end of plain.slice(0, match.index).matchAll(SENTENCE_END_RE)) {
			start = end.index + end[0].length;
		}
		// A long lead-in sentence: start a little before the name instead.
		if (match.index - start > SNIPPET_LENGTH / 2) {
			start = match.index - SNIPPET_LENGTH / 4;
		}
	}
	const excerpt = plain.slice(start, start + SNIPPET_LENGTH).trim();
	const prefix = start > 0 ? "…" : "";
	const suffix = start + SNIPPET_LENGTH < plain.length ? "…" : "";
	return `${prefix}${excerpt}${suffix}`;
}

export function analyzeAnswer(answer: {
	brand: string;
	host: string;
	sources: string[];
	text: string;
}): AnswerAnalysis {
	const citations = findCitations(answer.text, answer.sources, answer.host);
	const domainInText = bareDomainPattern(answer.host).test(
		answer.text.normalize("NFC")
	);
	const named = isBrandMentioned(answer.text, answer.brand) || domainInText;
	return {
		mentioned: named && !isDeclined(answer.text),
		cited: citations.some((c) => c.own),
		snippet: makeSnippet(answer.text, answer.brand),
		citations,
	};
}

export type PromptId = "brand" | "recommend" | "website";

/** true or false; null when the question was not asked or got no answer. */
export type Verdict = boolean | null;

export interface AssistantSummary<M extends string> {
	/** Any answer cites the brand's own site. */
	citesSite: Verdict;
	/**
	 * The answer to "What is <brand>?" describes the brand, and the assistant
	 * does not give some other website for it (then it means another business).
	 */
	knows: Verdict;
	model: M;
	/** The answer to the category question names the brand. */
	recommends: Verdict;
}

export interface VisibilitySummary<M extends string> {
	citesSite: { of: number; yes: number };
	knows: { of: number; yes: number };
	models: AssistantSummary<M>[];
	recommends: { of: number; yes: number };
}

/** One verdict per assistant and question, and how many assistants said yes. */
export function summarize<M extends string>(
	answers: {
		citations: Citation[];
		cited: boolean;
		mentioned: boolean;
		model: M;
		ok: boolean;
		prompt: PromptId;
	}[]
): VisibilitySummary<M> {
	const models = [...new Set(answers.map((a) => a.model))].map((model) => {
		const answered = answers.filter((a) => a.model === model && a.ok);
		const named = (prompt: PromptId): Verdict =>
			answered.find((a) => a.prompt === prompt)?.mentioned ?? null;
		const website = answered.find((a) => a.prompt === "website");
		const givesOtherSite =
			!!website && !website.cited && website.citations.length > 0;
		const describes = named("brand");
		return {
			model,
			knows: describes === null ? null : describes && !givesOtherSite,
			recommends: named("recommend"),
			citesSite: answered.length > 0 ? answered.some((a) => a.cited) : null,
		};
	});
	const tally = (key: "citesSite" | "knows" | "recommends") => ({
		yes: models.filter((m) => m[key] === true).length,
		of: models.filter((m) => m[key] !== null).length,
	});
	return {
		knows: tally("knows"),
		recommends: tally("recommends"),
		citesSite: tally("citesSite"),
		models,
	};
}
