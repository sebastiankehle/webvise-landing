import { createNewsletterConfirmationToken } from "@webvise-app/api/email/newsletter-confirmation-token";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../app/api/newsletter/confirm/route";

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
	const returning = vi.fn(
		async (): Promise<Array<{ path: string }>> => [{ path: "" }]
	);
	const onConflictDoUpdate = vi.fn(() => ({ returning }));
	const values = vi.fn(() => ({ onConflictDoUpdate }));
	const insert = vi.fn(() => ({ values }));
	return { insert, values, onConflictDoUpdate, returning };
});

vi.mock("@webvise-app/db", () => ({
	db: { insert: dbMock.insert },
}));

vi.mock("@/data/blog", () => ({
	getBlogPostBySlug: vi.fn((slug: string) =>
		slug === "agent-memory-vs-context"
			? { title: "Agent Memory vs Context", tags: ["AI", "AI Agents"] }
			: undefined
	),
}));

describe("GET /api/newsletter/confirm", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
		dbMock.insert.mockClear();
		dbMock.values.mockClear();
		dbMock.returning.mockClear();
		dbMock.returning.mockResolvedValue([{ path: "" }]);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("subscribes the contact and redirects to the success page for a valid token", async () => {
		const token = createNewsletterConfirmationToken(
			"Reader@Example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		const response = await GET(
			new Request(`https://webvise.io/api/newsletter/confirm?token=${token}`)
		);

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/newsletter-confirmed?success=true"
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock.mock.calls[0][0]).toBe("https://api.resend.com/contacts");
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			email: "reader@example.com",
			unsubscribed: false,
		});
		expect(fetchMock.mock.calls[1][0]).toBe("https://api.resend.com/emails");
		const welcomeBody = JSON.parse(fetchMock.mock.calls[1][1].body);
		expect(welcomeBody.subject).toBe("Welcome to the webvise newsletter");
		expect(welcomeBody.headers).toHaveProperty("List-Unsubscribe");
	});

	it("marks the subscriber row confirmed", async () => {
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		await GET(
			new Request(`https://webvise.io/api/newsletter/confirm?token=${token}`)
		);

		expect(dbMock.insert).toHaveBeenCalledOnce();
		expect(dbMock.values).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "reader@example.com",
				status: "confirmed",
			})
		);
	});

	it("sends a topic-specific welcome email when the signup came from a blog post", async () => {
		dbMock.returning.mockResolvedValue([
			{ path: "/blog/agent-memory-vs-context" },
		]);
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		await GET(
			new Request(`https://webvise.io/api/newsletter/confirm?token=${token}`)
		);

		const welcomeBody = JSON.parse(fetchMock.mock.calls[1][1].body);
		expect(welcomeBody.html).toContain("Agent Memory vs Context");
		expect(welcomeBody.html).toContain("AI agents");
		expect(welcomeBody.text).toContain("Agent Memory vs Context");
	});

	it("falls back to the generic welcome email when the subscriber row is missing", async () => {
		dbMock.returning.mockRejectedValue(new Error("db down"));
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		const response = await GET(
			new Request(`https://webvise.io/api/newsletter/confirm?token=${token}`)
		);

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/newsletter-confirmed?success=true"
		);
		const welcomeBody = JSON.parse(fetchMock.mock.calls[1][1].body);
		expect(welcomeBody.html).toContain(
			"web performance, modern development, and what we&#39;re building"
		);
	});

	it("redirects invalid tokens without touching Resend contacts", async () => {
		const response = await GET(
			new Request("https://webvise.io/api/newsletter/confirm?token=bad")
		);

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/newsletter-confirmed?error=invalid"
		);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(dbMock.insert).not.toHaveBeenCalled();
	});
});
