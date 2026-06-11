import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@webvise-app/env/server";
import { NextResponse } from "next/server";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

interface RateLimitResult {
	limited: boolean;
	retryAfterSec: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();
const durableLimiters = new Map<string, Ratelimit>();
let durableRedis: Redis | null = null;

function getStore(name: string): Map<string, RateLimitEntry> {
	let store = stores.get(name);
	if (!store) {
		store = new Map();
		stores.set(name, store);
	}
	return store;
}

function getDurableRedis(): Redis | null {
	if (env.NODE_ENV === "test") {
		return null;
	}
	if (!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)) {
		return null;
	}
	if (!durableRedis) {
		durableRedis = new Redis({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN,
		});
	}
	return durableRedis;
}

function getDurableLimiter(opts: {
	name: string;
	maxRequests: number;
	windowMs: number;
}): Ratelimit | null {
	const redis = getDurableRedis();
	if (!redis) {
		return null;
	}

	const key = `${opts.name}:${opts.maxRequests}:${opts.windowMs}`;
	let limiter = durableLimiters.get(key);
	if (!limiter) {
		limiter = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(
				opts.maxRequests,
				`${Math.max(1, Math.ceil(opts.windowMs / 1000))} s`
			),
			prefix: `webvise:ratelimit:${opts.name}`,
		});
		durableLimiters.set(key, limiter);
	}
	return limiter;
}

export function createRateLimiter(opts: {
	name: string;
	maxRequests: number;
	windowMs: number;
}) {
	const store = getStore(opts.name);
	const durableLimiter = getDurableLimiter(opts);

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
		async check(ip: string): Promise<RateLimitResult> {
			if (durableLimiter) {
				const result = await durableLimiter.limit(ip);
				return {
					limited: !result.success,
					retryAfterSec: result.success
						? 0
						: Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
				};
			}

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

export function getClientIPFromHeaders(headers: Headers): string {
	const forwarded = headers.get("x-forwarded-for");
	const first = forwarded?.split(",")[0]?.trim();
	if (first) {
		return first;
	}
	return headers.get("x-real-ip") ?? "unknown";
}

export function getClientIP(request: Request): string {
	return getClientIPFromHeaders(request.headers);
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
