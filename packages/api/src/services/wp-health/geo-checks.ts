import { safeFetchText } from "../../safe-fetch";

export const AI_CRAWLERS = [
	"GPTBot",
	"ClaudeBot",
	"PerplexityBot",
	"Google-Extended",
	"CCBot",
] as const;

export interface GeoResult {
	aiCrawlers: "allowed" | "partly-blocked" | "blocked" | "unknown";
	blockedCrawlers: string[];
	jsonLdTypes: string[];
	llmsTxt: boolean;
}

interface RobotsGroup {
	agents: string[];
	allowAll: boolean;
	disallowAll: boolean;
}

const LINE_BREAK_RE = /\r?\n/;

function applyDirective(
	group: RobotsGroup | null,
	field: string,
	value: string
): void {
	if (!group || value !== "/") {
		return;
	}
	if (field === "disallow") {
		group.disallowAll = true;
	} else {
		group.allowAll = true;
	}
}

function parseGroups(robotsTxt: string): RobotsGroup[] {
	const groups: RobotsGroup[] = [];
	let current: RobotsGroup | null = null;
	let collectingAgents = false;

	for (const rawLine of robotsTxt.split(LINE_BREAK_RE)) {
		const line = (rawLine.split("#")[0] ?? "").trim();
		const idx = line.indexOf(":");
		if (idx === -1) {
			continue;
		}
		const field = line.slice(0, idx).trim().toLowerCase();
		const value = line.slice(idx + 1).trim();

		if (field === "user-agent") {
			if (!(current && collectingAgents)) {
				current = { agents: [], disallowAll: false, allowAll: false };
				groups.push(current);
			}
			current.agents.push(value.toLowerCase());
			collectingAgents = true;
		} else if (field === "disallow" || field === "allow") {
			collectingAgents = false;
			applyDirective(current, field, value);
		}
	}
	return groups;
}

function isBlocked(group: RobotsGroup | undefined): boolean {
	return !!group && group.disallowAll && !group.allowAll;
}

export function parseRobotsForAiCrawlers(robotsTxt: string): {
	status: GeoResult["aiCrawlers"];
	blocked: string[];
} {
	const groups = parseGroups(robotsTxt);
	const wildcard = groups.find((g) => g.agents.includes("*"));
	const blocked = AI_CRAWLERS.filter((bot) => {
		const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
		return isBlocked(own ?? wildcard);
	});

	let status: GeoResult["aiCrawlers"] = "partly-blocked";
	if (blocked.length === 0) {
		status = "allowed";
	} else if (blocked.length === AI_CRAWLERS.length) {
		status = "blocked";
	}
	return { status, blocked: [...blocked] };
}

const JSON_LD_RE =
	/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function collectTypes(node: unknown, out: Set<string>): void {
	if (Array.isArray(node)) {
		for (const item of node) {
			collectTypes(item, out);
		}
		return;
	}
	if (!node || typeof node !== "object") {
		return;
	}
	const obj = node as Record<string, unknown>;
	const type = obj["@type"];
	if (typeof type === "string") {
		out.add(type);
	} else if (Array.isArray(type)) {
		for (const t of type) {
			if (typeof t === "string") {
				out.add(t);
			}
		}
	}
	if (obj["@graph"]) {
		collectTypes(obj["@graph"], out);
	}
}

export function extractJsonLdTypes(html: string): string[] {
	const types = new Set<string>();
	for (const match of html.matchAll(JSON_LD_RE)) {
		try {
			collectTypes(JSON.parse(match[1] ?? ""), types);
		} catch {
			// skip invalid JSON-LD
		}
	}
	return [...types].sort();
}

const FETCH_OPTIONS = {
	timeoutMs: 8000,
	maxBytes: 200_000,
	maxRedirects: 3,
};

async function checkLlmsTxt(origin: string): Promise<boolean> {
	try {
		const res = await safeFetchText(`${origin}/llms.txt`, FETCH_OPTIONS);
		const text = res.text.trim();
		return res.status === 200 && text.length > 0 && !text.startsWith("<");
	} catch {
		return false;
	}
}

async function checkRobots(
	origin: string
): Promise<ReturnType<typeof parseRobotsForAiCrawlers>> {
	try {
		const res = await safeFetchText(`${origin}/robots.txt`, FETCH_OPTIONS);
		if (res.status === 200) {
			return parseRobotsForAiCrawlers(res.text);
		}
		if (res.status === 404) {
			return { status: "allowed", blocked: [] };
		}
	} catch {
		// fall through to unknown
	}
	return { status: "unknown", blocked: [] };
}

export async function runGeoChecks(
	pageUrl: string,
	homepageHtml: string | null
): Promise<GeoResult> {
	const origin = new URL(pageUrl).origin;
	const [llmsTxt, robots] = await Promise.all([
		checkLlmsTxt(origin),
		checkRobots(origin),
	]);
	return {
		llmsTxt,
		aiCrawlers: robots.status,
		blockedCrawlers: robots.blocked,
		jsonLdTypes: homepageHtml ? extractJsonLdTypes(homepageHtml) : [],
	};
}
