import { NextResponse } from "next/server";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
	let store = stores.get(name);
	if (!store) {
		store = new Map();
		stores.set(name, store);
	}
	return store;
}

export function createRateLimiter(opts: {
	name: string;
	maxRequests: number;
	windowMs: number;
}) {
	const store = getStore(opts.name);

	// Periodic cleanup of expired entries
	setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of store) {
			if (entry.resetAt <= now) {
				store.delete(key);
			}
		}
	}, opts.windowMs * 2).unref();

	return {
		check(ip: string): { limited: boolean; retryAfterSec: number } {
			const now = Date.now();
			const entry = store.get(ip);

			if (!entry || entry.resetAt <= now) {
				store.set(ip, { count: 1, resetAt: now + opts.windowMs });
				return { limited: false, retryAfterSec: 0 };
			}

			entry.count++;
			if (entry.count > opts.maxRequests) {
				const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
				return { limited: true, retryAfterSec };
			}

			return { limited: false, retryAfterSec: 0 };
		},
	};
}

export function getClientIP(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitResponse(retryAfterSec: number): NextResponse {
	return NextResponse.json(
		{ error: "Too many requests. Please try again later." },
		{
			status: 429,
			headers: { "Retry-After": String(retryAfterSec) },
		}
	);
}
