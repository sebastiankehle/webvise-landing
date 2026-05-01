const WP_CONTENT_RE = /\/wp-content\//i;
const WP_INCLUDES_RE = /\/wp-includes\//i;
const WP_GENERATOR_RE = /name=["']generator["'][^>]*WordPress/i;
const PHP_FILE_RE = /\.php[\s"'?]/i;

export interface TechFlags {
	isPHP: boolean;
	isWordPress: boolean;
}

export async function detectTechnology(url: string): Promise<TechFlags> {
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(10_000),
			headers: { "User-Agent": "webvise-health-report/1.0" },
		});
		const html = await res.text();
		const headers = Object.fromEntries(
			[...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v])
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
	} catch {
		return { isWordPress: false, isPHP: false };
	}
}
