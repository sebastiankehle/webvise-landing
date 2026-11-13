import { safeFetchText } from "../../safe-fetch";

const WP_CONTENT_RE = /\/wp-content\//i;
const WP_INCLUDES_RE = /\/wp-includes\//i;
const WP_GENERATOR_RE = /name=["']generator["'][^>]*WordPress/i;
const PHP_FILE_RE = /\.php[\s"'?]/i;

export const PAGE_FETCH_OPTIONS = {
	timeoutMs: 10_000,
	maxBytes: 2_000_000,
	maxRedirects: 3,
	headers: { "User-Agent": "webvise-health-report/1.0" },
};

export interface TechFlags {
	isPHP: boolean;
	isWordPress: boolean;
}

export function detectTechnologyFromPage(page: {
	headers: Headers;
	text: string;
}): TechFlags {
	const html = page.text;
	const headers = Object.fromEntries(
		[...page.headers.entries()].map(([k, v]) => [k.toLowerCase(), v])
	);

	const isWordPress =
		WP_CONTENT_RE.test(html) ||
		WP_INCLUDES_RE.test(html) ||
		WP_GENERATOR_RE.test(html) ||
		headers["x-powered-by"]?.toLowerCase().includes("wordpress") === true ||
		headers.link?.includes("wp-json") === true;

	const isPHP =
		isWordPress ||
		headers["x-powered-by"]?.toLowerCase().includes("php") === true ||
		PHP_FILE_RE.test(html);

	return { isWordPress, isPHP };
}

export async function detectTechnology(url: string): Promise<TechFlags> {
	try {
		const result = await safeFetchText(url, PAGE_FETCH_OPTIONS);
		return detectTechnologyFromPage(result);
	} catch {
		return { isWordPress: false, isPHP: false };
	}
}
