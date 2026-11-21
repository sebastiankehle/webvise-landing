import type { TRPCError } from "@trpc/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	NODE_ENV: "test",
	CONTACT_EMAIL_TO: "mail@webvise.io",
	GOOGLE_PAGESPEED_API_KEY: "psi-key",
	BETTER_AUTH_SECRET: "test-secret-that-is-at-least-32-chars!!",
}));
vi.mock("@webvise-app/env/server", () => ({ env: envMock }));

const mocks = vi.hoisted(() => ({
	lookup: vi.fn(),
	sendEmail: vi.fn(),
	findFirst: vi.fn(),
	insertValues: vi.fn(),
}));
vi.mock("@webvise-app/db", () => ({
	db: {
		query: { leadEvent: { findFirst: mocks.findFirst } },
		insert: () => ({ values: mocks.insertValues }),
	},
}));
vi.mock("node:dns/promises", () => ({ lookup: mocks.lookup }));
vi.mock("@webvise-app/api/email/resend", () => ({
	sendEmail: mocks.sendEmail,
	setContact: vi.fn(),
}));

const { wpHealthRouter } = await import("@webvise-app/api/routers/wp-health");

function psi(score: number) {
	return {
		lighthouseResult: {
			categories: { performance: { score }, seo: { score: 0.9 } },
			audits: {},
		},
	};
}

let ipCounter = 0;
function caller() {
	ipCounter += 1;
	return wpHealthRouter.createCaller({
		ip: `wp-health-test-${ipCounter}`,
		session: null,
	});
}

describe("wpHealthRouter.unlock", () => {
	const fetchMock = vi.fn();
	let psiScore = 0.42;

	beforeEach(() => {
		for (const mock of Object.values(mocks)) {
			mock.mockReset();
		}
		mocks.lookup.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
		mocks.findFirst.mockResolvedValue(undefined);
		mocks.insertValues.mockResolvedValue(undefined);
		mocks.sendEmail.mockResolvedValue({ ok: true });
		psiScore = 0.42;
		fetchMock.mockReset();
		fetchMock.mockImplementation((url: string) =>
			Promise.resolve(
				url.includes("googleapis.com")
					? new Response(JSON.stringify(psi(psiScore)), { status: 200 })
					: new Response("<html></html>", { status: 200 })
			)
		);
		vi.stubGlobal("fetch", fetchMock);
		vi.spyOn(console, "error").mockImplementation(() => {
			// Attio is not configured in tests
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("emails the scores the visitor saw, without running PageSpeed again", async () => {
		const report = await caller().run({ url: "https://example.com" });
		// A second PageSpeed run would now score 90.
		psiScore = 0.9;
		const psiCalls = () =>
			fetchMock.mock.calls.filter(([url]) => url.includes("googleapis.com"))
				.length;
		expect(psiCalls()).toBe(2);

		const out = await caller().unlock({
			reportToken: report.reportToken,
			email: "lead@example.com",
			locale: "de",
		});

		expect(out).toEqual({ emailed: true });
		expect(psiCalls()).toBe(2);
		const labels = mocks.sendEmail.mock.calls.map((c) => c[0].label);
		expect(labels).toEqual(["wp-health-admin", "wp-health-prospect"]);
		expect(mocks.sendEmail.mock.calls[0]?.[0].subject).toBe(
			"WP Lead: https://example.com - mobile 42/100"
		);
		expect(mocks.sendEmail.mock.calls[1]?.[0].text).toContain("Mobil: 42/100");
	});

	it("rejects a report token the client changed", async () => {
		const report = await caller().run({ url: "https://example.com" });
		const [data, issuedAt, signature] = report.reportToken.split(".");
		const forged = JSON.parse(
			Buffer.from(data ?? "", "base64url").toString("utf-8")
		);
		forged.mobile.score = 99;
		const tampered = `${Buffer.from(JSON.stringify(forged)).toString("base64url")}.${issuedAt}.${signature}`;

		const err = await caller()
			.unlock({ reportToken: tampered, email: "lead@example.com" })
			.catch((e: unknown) => e);
		expect((err as TRPCError).code).toBe("BAD_REQUEST");
		expect(mocks.sendEmail).not.toHaveBeenCalled();
	});

	it("rejects a report token older than a day", async () => {
		const report = await caller().run({ url: "https://example.com" });
		vi.useFakeTimers({ now: Date.now() + 25 * 60 * 60 * 1000 });
		try {
			const err = await caller()
				.unlock({ reportToken: report.reportToken, email: "lead@example.com" })
				.catch((e: unknown) => e);
			expect((err as TRPCError).code).toBe("BAD_REQUEST");
		} finally {
			vi.useRealTimers();
		}
	});

	it("fails when the lead reached neither webvise nor a store", async () => {
		const report = await caller().run({ url: "https://example.com" });
		mocks.sendEmail.mockResolvedValue({ ok: false, reason: "api_error" });
		mocks.insertValues.mockRejectedValue(new Error("db down"));

		const err = await caller()
			.unlock({ reportToken: report.reportToken, email: "lead@example.com" })
			.catch((e: unknown) => e);
		expect((err as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
	});

	it("opens the report but says no email went out when the send fails", async () => {
		const report = await caller().run({ url: "https://example.com" });
		mocks.sendEmail.mockImplementation((input: { label: string }) =>
			Promise.resolve(
				input.label === "wp-health-prospect"
					? { ok: false, reason: "api_error" }
					: { ok: true }
			)
		);
		const out = await caller().unlock({
			reportToken: report.reportToken,
			email: "lead@example.com",
		});
		expect(out).toEqual({ emailed: false });
	});
});
