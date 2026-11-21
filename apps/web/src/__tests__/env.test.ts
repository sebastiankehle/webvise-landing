import { afterEach, describe, expect, it, vi } from "vitest";

const REQUIRED_IN_PRODUCTION = [
	"DATABASE_URL",
	"BETTER_AUTH_SECRET",
	"RESEND_API_KEY",
	"GOOGLE_PAGESPEED_API_KEY",
	"ATTIO_API_KEY",
] as const;

describe("server env", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	it("throws in production when required variables are missing", async () => {
		vi.resetModules();
		vi.stubEnv("VERCEL_ENV", "production");
		for (const name of REQUIRED_IN_PRODUCTION) {
			vi.stubEnv(name, "");
		}
		await expect(import("@webvise-app/env/server")).rejects.toThrow();
	});

	it("throws in production when only ATTIO_API_KEY is missing", async () => {
		vi.resetModules();
		vi.stubEnv("VERCEL_ENV", "production");
		vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
		vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-that-is-at-least-32-chars!!");
		vi.stubEnv("RESEND_API_KEY", "re_test");
		vi.stubEnv("GOOGLE_PAGESPEED_API_KEY", "psi_test");
		vi.stubEnv("ATTIO_API_KEY", "");
		await expect(import("@webvise-app/env/server")).rejects.toThrow();
	});

	it("loads in preview without them and defaults CONTACT_EMAIL_TO", async () => {
		vi.resetModules();
		vi.stubEnv("VERCEL_ENV", "preview");
		for (const name of REQUIRED_IN_PRODUCTION) {
			vi.stubEnv(name, "");
		}
		vi.stubEnv("CONTACT_EMAIL_TO", "");
		const { env } = await import("@webvise-app/env/server");
		expect(env.CONTACT_EMAIL_TO).toBe("mail@webvise.io");
	});

	it("reads the Upstash REST credentials from the Vercel integration's KV names", async () => {
		vi.resetModules();
		vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
		vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
		vi.stubEnv("KV_REST_API_URL", "https://example-kv.upstash.io");
		vi.stubEnv("KV_REST_API_TOKEN", "kv-test-token");
		const { env } = await import("@webvise-app/env/server");
		expect(env.UPSTASH_REDIS_REST_URL).toBe("https://example-kv.upstash.io");
		expect(env.UPSTASH_REDIS_REST_TOKEN).toBe("kv-test-token");
	});

	it("prefers the UPSTASH_REDIS_REST_* names when both are set", async () => {
		vi.resetModules();
		vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example-upstash.upstash.io");
		vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "upstash-test-token");
		vi.stubEnv("KV_REST_API_URL", "https://example-kv.upstash.io");
		vi.stubEnv("KV_REST_API_TOKEN", "kv-test-token");
		const { env } = await import("@webvise-app/env/server");
		expect(env.UPSTASH_REDIS_REST_URL).toBe(
			"https://example-upstash.upstash.io"
		);
		expect(env.UPSTASH_REDIS_REST_TOKEN).toBe("upstash-test-token");
	});
});
