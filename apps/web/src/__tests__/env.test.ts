import { afterEach, describe, expect, it, vi } from "vitest";

const REQUIRED_IN_PRODUCTION = [
	"DATABASE_URL",
	"BETTER_AUTH_SECRET",
	"RESEND_API_KEY",
	"GOOGLE_PAGESPEED_API_KEY",
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
});
