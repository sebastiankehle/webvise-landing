import {
	createRateLimiter,
	getClientIPFromHeaders,
} from "@webvise-app/api/rate-limit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getClientIPFromHeaders", () => {
	it("uses x-forwarded-for first IP", () => {
		const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
		expect(getClientIPFromHeaders(h)).toBe("1.2.3.4");
	});

	it("falls back to x-real-ip when x-forwarded-for missing", () => {
		const h = new Headers({ "x-real-ip": "9.9.9.9" });
		expect(getClientIPFromHeaders(h)).toBe("9.9.9.9");
	});

	it("returns 'unknown' when no headers present", () => {
		expect(getClientIPFromHeaders(new Headers())).toBe("unknown");
	});

	it("trims whitespace from x-forwarded-for", () => {
		const h = new Headers({ "x-forwarded-for": "  1.2.3.4  , 5.6.7.8" });
		expect(getClientIPFromHeaders(h)).toBe("1.2.3.4");
	});

	it("ignores empty x-forwarded-for and falls back", () => {
		const h = new Headers({
			"x-forwarded-for": "",
			"x-real-ip": "8.8.8.8",
		});
		expect(getClientIPFromHeaders(h)).toBe("8.8.8.8");
	});
});

describe("createRateLimiter", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("allows up to maxRequests then blocks", () => {
		const l = createRateLimiter({
			name: `t-allow-${Math.random()}`,
			maxRequests: 3,
			windowMs: 60_000,
		});
		expect(l.check("1.1.1.1").limited).toBe(false);
		expect(l.check("1.1.1.1").limited).toBe(false);
		expect(l.check("1.1.1.1").limited).toBe(false);
		const blocked = l.check("1.1.1.1");
		expect(blocked.limited).toBe(true);
		expect(blocked.retryAfterSec).toBeGreaterThan(0);
	});

	it("isolates buckets per IP", () => {
		const l = createRateLimiter({
			name: `t-isolate-${Math.random()}`,
			maxRequests: 1,
			windowMs: 60_000,
		});
		expect(l.check("a").limited).toBe(false);
		expect(l.check("b").limited).toBe(false);
		expect(l.check("a").limited).toBe(true);
		expect(l.check("b").limited).toBe(true);
	});

	it("isolates buckets per limiter name", () => {
		const a = createRateLimiter({
			name: `t-name-a-${Math.random()}`,
			maxRequests: 1,
			windowMs: 60_000,
		});
		const b = createRateLimiter({
			name: `t-name-b-${Math.random()}`,
			maxRequests: 1,
			windowMs: 60_000,
		});
		expect(a.check("x").limited).toBe(false);
		expect(b.check("x").limited).toBe(false);
		expect(a.check("x").limited).toBe(true);
		expect(b.check("x").limited).toBe(true);
	});

	it("resets the counter after the window elapses", () => {
		const l = createRateLimiter({
			name: `t-reset-${Math.random()}`,
			maxRequests: 1,
			windowMs: 1000,
		});
		expect(l.check("z").limited).toBe(false);
		expect(l.check("z").limited).toBe(true);
		vi.advanceTimersByTime(1001);
		expect(l.check("z").limited).toBe(false);
	});

	it("reports retryAfterSec rounded up", () => {
		const l = createRateLimiter({
			name: `t-retry-${Math.random()}`,
			maxRequests: 1,
			windowMs: 5500,
		});
		l.check("y");
		const r = l.check("y");
		expect(r.limited).toBe(true);
		expect(r.retryAfterSec).toBeLessThanOrEqual(6);
		expect(r.retryAfterSec).toBeGreaterThan(0);
	});
});
