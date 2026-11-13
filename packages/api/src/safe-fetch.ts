import { UrlValidationError, validateUrl } from "./url-validation";

export interface SafeFetchResult {
	headers: Headers;
	status: number;
	text: string;
	url: string;
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

async function readCapped(res: Response, maxBytes: number): Promise<string> {
	if (!res.body) {
		return "";
	}
	const reader = res.body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	while (total < maxBytes) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
		total += value.byteLength;
	}
	// Stop the download when the body is larger than the cap.
	await reader.cancel().catch(() => undefined);
	const bytes = new Uint8Array(Math.min(total, maxBytes));
	let offset = 0;
	for (const chunk of chunks) {
		const room = bytes.length - offset;
		if (room <= 0) {
			break;
		}
		bytes.set(chunk.subarray(0, room), offset);
		offset += Math.min(chunk.byteLength, room);
	}
	return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Fetch a user-supplied URL. Every hop (including redirects) is validated,
 * one timeout covers the whole chain, and the body is capped at `maxBytes`.
 */
export async function safeFetchText(
	url: string,
	opts: {
		timeoutMs: number;
		maxBytes: number;
		maxRedirects: number;
		headers?: Record<string, string>;
	}
): Promise<SafeFetchResult> {
	const signal = AbortSignal.timeout(opts.timeoutMs);
	let current = url;
	let hops = 0;

	while (true) {
		await validateUrl(current);
		const res = await fetch(current, {
			redirect: "manual",
			signal,
			headers: opts.headers,
		});
		const location = res.headers.get("location");
		if (REDIRECT_STATUSES.has(res.status) && location) {
			await res.body?.cancel().catch(() => undefined);
			hops += 1;
			if (hops > opts.maxRedirects) {
				throw new UrlValidationError("Too many redirects.");
			}
			current = new URL(location, current).href;
			continue;
		}
		const text = await readCapped(res, opts.maxBytes);
		return { status: res.status, headers: res.headers, text, url: current };
	}
}
