import { createNewsletterConfirmationToken } from "@webvise-app/api/email/newsletter-confirmation-token";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../app/api/newsletter/confirm/route";

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
	const findMany = vi.fn(
		async (): Promise<
			Array<{
				eventType: "newsletter_signup" | "deck_request";
				path: string;
				topic: string | null;
			}>
		> => []
	);
	const returning = vi.fn(
		async (): Promise<Array<{ path: string; placement?: string }>> => [
			{ path: "", placement: "unknown" },
		]
	);
	const onConflictDoUpdate = vi.fn(() => ({ returning }));
	const values = vi.fn(() => ({ onConflictDoUpdate }));
	const insert = vi.fn(() => ({ values }));
	return { findMany, insert, values, onConflictDoUpdate, returning };
});

vi.mock("@webvise-app/db", () => ({
	db: {
		insert: dbMock.insert,
		query: { leadEvent: { findMany: dbMock.findMany } },
	},
}));

vi.mock("@/data/blog", () => ({
	getBlogPostBySlug: vi.fn((slug: string) =>
		slug === "agent-memory-vs-context"
			? { title: "Agent Memory vs Context", tags: ["AI", "AI Agents"] }
			: undefined
	),
}));

function postConfirmation(token: string) {
	const formData = new FormData();
	formData.set("token", token);
	return POST(
		new Request("https://webvise.io/api/newsletter/confirm", {
			method: "POST",
			body: formData,
		})
	);
}

describe("/api/newsletter/confirm", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
		dbMock.insert.mockClear();
		dbMock.values.mockClear();
		dbMock.returning.mockClear();
		dbMock.findMany.mockClear();
		dbMock.findMany.mockResolvedValue([]);
		dbMock.returning.mockResolvedValue([{ path: "", placement: "unknown" }]);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("does not confirm a subscriber when a mail scanner follows the GET link", async () => {
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
			`https://webvise.io/newsletter-confirmed?token=${token}`
		);
		expect(dbMock.insert).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("redirects through the public forwarded host", async () => {
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		const response = await GET(
			new Request(
				`http://localhost:4430/api/newsletter/confirm?token=${token}`,
				{
					headers: {
						"x-forwarded-host": "webvise.localhost",
						"x-forwarded-proto": "https",
					},
				}
			)
		);

		expect(response.headers.get("location")).toBe(
			`https://webvise.localhost/newsletter-confirmed?token=${token}`
		);
	});

	it("subscribes the contact and redirects to the success page for a valid token", async () => {
		const token = createNewsletterConfirmationToken(
			"Reader@Example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		const response = await postConfirmation(token);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/newsletter-confirmed?success=true"
		);
		expect(fetchMock).toHaveBeenCalledTimes(3);
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

	it("notifies the team about the new subscriber and their source", async () => {
		dbMock.returning.mockResolvedValue([
			{ path: "/blog/agent-memory-vs-context", placement: "blog_article" },
		]);
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		await postConfirmation(token);

		const notifyBody = JSON.parse(fetchMock.mock.calls[2][1].body);
		expect(notifyBody.to).toEqual(["mail@webvise.io"]);
		expect(notifyBody.subject).toBe(
			"New newsletter subscriber: reader@example.com"
		);
		expect(notifyBody.html).toContain("blog_article");
		expect(notifyBody.html).toContain("/blog/agent-memory-vs-context");
		expect(notifyBody.html).toContain("Agent Memory vs Context");
		expect(notifyBody.text).toContain("Placement: blog_article");
	});

	it("includes the confirmed subscriber's captured interests", async () => {
		dbMock.findMany.mockResolvedValue([
			{
				eventType: "newsletter_signup",
				path: "/services/website-to-app-upgrades",
				topic: null,
			},
			{
				eventType: "deck_request",
				path: "/services/website-to-app-upgrades",
				topic: "website-to-app-upgrades",
			},
		]);
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		await postConfirmation(token);

		const notifyBody = JSON.parse(fetchMock.mock.calls[2][1].body);
		expect(notifyBody.text).toContain(
			"Interest: Newsletter signup · /services/website-to-app-upgrades"
		);
		expect(notifyBody.text).toContain(
			"Interest: Deck request: website-to-app-upgrades · /services/website-to-app-upgrades"
		);
	});

	it("marks the subscriber row confirmed", async () => {
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		await postConfirmation(token);

		expect(dbMock.insert).toHaveBeenCalledOnce();
		expect(dbMock.values).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "reader@example.com",
				status: "confirmed",
			})
		);
	});

	it("does not send duplicate emails when the subscriber is already confirmed", async () => {
		dbMock.returning.mockResolvedValue([]);
		const token = createNewsletterConfirmationToken(
			"reader@example.com",
			Date.now(),
			envMock.BETTER_AUTH_SECRET
		);

		const response = await postConfirmation(token);

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/newsletter-confirmed?success=true"
		);
		expect(fetchMock).not.toHaveBeenCalled();
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

		await postConfirmation(token);

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

		const response = await postConfirmation(token);

		expect(response.status).toBe(303);
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
