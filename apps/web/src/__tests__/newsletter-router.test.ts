import { newsletterRouter } from "@webvise-app/api/routers/newsletter";
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
	const onConflictDoUpdate = vi.fn(async () => undefined);
	const values = vi.fn(() => ({ onConflictDoUpdate }));
	const insert = vi.fn(() => ({ values }));
	return { insert, values, onConflictDoUpdate };
});

vi.mock("@webvise-app/db", () => ({
	db: { insert: dbMock.insert },
}));

describe("newsletterRouter.subscribe", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
		dbMock.insert.mockClear();
		dbMock.values.mockClear();
		dbMock.onConflictDoUpdate.mockClear();
		dbMock.onConflictDoUpdate.mockResolvedValue(undefined);
	});

	it("sends a confirmation email without subscribing the contact immediately", async () => {
		const caller = newsletterRouter.createCaller({
			ip: "newsletter-router-test-1",
			session: null,
		});

		await expect(
			caller.subscribe({ email: "reader@example.com" })
		).resolves.toEqual({ success: true });

		expect(fetchMock).toHaveBeenCalledOnce();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("https://api.resend.com/emails");
		const body = JSON.parse(init.body);
		expect(body.subject).toBe("Confirm your webvise newsletter subscription");
		expect(body.html).toContain("/api/newsletter/confirm?token=");
		expect(body.text).toContain("/api/newsletter/confirm?token=");
	});

	it("stores the signup source as a pending subscriber row", async () => {
		const caller = newsletterRouter.createCaller({
			ip: "newsletter-router-test-2",
			session: null,
		});

		await caller.subscribe({
			email: "Reader@Example.com",
			placement: "blog_article",
			path: "/blog/agent-memory-vs-context",
		});

		expect(dbMock.insert).toHaveBeenCalledOnce();
		expect(dbMock.values).toHaveBeenCalledWith({
			email: "reader@example.com",
			placement: "blog_article",
			path: "/blog/agent-memory-vs-context",
		});
		expect(dbMock.onConflictDoUpdate).toHaveBeenCalledOnce();
	});

	it("falls back to an unknown source when the client sends none", async () => {
		const caller = newsletterRouter.createCaller({
			ip: "newsletter-router-test-3",
			session: null,
		});

		await caller.subscribe({ email: "reader@example.com" });

		expect(dbMock.values).toHaveBeenCalledWith({
			email: "reader@example.com",
			placement: "unknown",
			path: "",
		});
	});

	it("still sends the confirmation email when the source write fails", async () => {
		dbMock.onConflictDoUpdate.mockRejectedValue(new Error("db down"));

		const caller = newsletterRouter.createCaller({
			ip: "newsletter-router-test-4",
			session: null,
		});

		await expect(
			caller.subscribe({
				email: "reader@example.com",
				placement: "footer",
				path: "/",
			})
		).resolves.toEqual({ success: true });

		expect(fetchMock).toHaveBeenCalledOnce();
	});
});
