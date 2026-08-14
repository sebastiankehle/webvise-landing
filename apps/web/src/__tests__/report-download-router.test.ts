import { reportDownloadRouter } from "@webvise-app/api/routers/report-download";
import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	BETTER_AUTH_SECRET: "test-secret-that-is-at-least-32-chars!!",
	NODE_ENV: "test",
	RESEND_API_KEY: "test-key",
}));

vi.mock("@webvise-app/env/server", () => ({
	get env() {
		return envMock;
	},
}));

const dbMock = vi.hoisted(() => {
	const values = vi.fn(async () => undefined);
	const insert = vi.fn(() => ({ values }));
	return { insert, values };
});

vi.mock("@webvise-app/db", () => ({
	db: { insert: dbMock.insert },
}));

vi.mock("node:fs", () => ({
	readFileSync: vi.fn(() => Buffer.from("test-pdf")),
}));

describe("reportDownloadRouter.request", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
		dbMock.insert.mockClear();
		dbMock.values.mockClear();
	});

	it("records a deck request as an immutable interest event", async () => {
		const caller = reportDownloadRouter.createCaller({
			ip: "report-download-test-1",
			session: null,
		});

		await caller.request({
			email: "Reader@Example.com",
			reportId: "deck-website-to-app-upgrades",
			locale: "en",
			path: "/services/website-to-app-upgrades",
		});

		expect(dbMock.insert).toHaveBeenCalledOnce();
		expect(dbMock.values).toHaveBeenCalledWith({
			email: "reader@example.com",
			eventType: "deck_request",
			placement: "deck_gate",
			path: "/services/website-to-app-upgrades",
			topic: "website-to-app-upgrades",
		});
	});
});
