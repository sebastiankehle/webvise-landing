/** What a crawler reads a site for. */
export type CrawlerKind = "search" | "aiSearch" | "training" | "user";

/**
 * Crawlers the robots.txt generator lets a visitor allow or block. No imports,
 * so the browser bundle can use the same list as the prefill call.
 */
export const GENERATOR_CRAWLERS = [
	{ name: "Googlebot", owner: "Google", kind: "search" },
	{ name: "Bingbot", owner: "Microsoft", kind: "search" },
	{ name: "OAI-SearchBot", owner: "OpenAI", kind: "aiSearch" },
	{ name: "Claude-SearchBot", owner: "Anthropic", kind: "aiSearch" },
	{ name: "PerplexityBot", owner: "Perplexity", kind: "aiSearch" },
	{ name: "GPTBot", owner: "OpenAI", kind: "training" },
	{ name: "ClaudeBot", owner: "Anthropic", kind: "training" },
	{ name: "Google-Extended", owner: "Google", kind: "training" },
	{ name: "Applebot-Extended", owner: "Apple", kind: "training" },
	{ name: "Meta-ExternalAgent", owner: "Meta", kind: "training" },
	{ name: "CCBot", owner: "Common Crawl", kind: "training" },
	{ name: "Bytespider", owner: "ByteDance", kind: "training" },
	{ name: "ChatGPT-User", owner: "OpenAI", kind: "user" },
	{ name: "Claude-User", owner: "Anthropic", kind: "user" },
	{ name: "Perplexity-User", owner: "Perplexity", kind: "user" },
] as const satisfies readonly {
	kind: CrawlerKind;
	name: string;
	owner: string;
}[];

export type CrawlerName = (typeof GENERATOR_CRAWLERS)[number]["name"];

export const GENERATOR_CRAWLER_NAMES: readonly CrawlerName[] =
	GENERATOR_CRAWLERS.map((c) => c.name);
