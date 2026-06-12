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

describe("newsletterRouter.subscribe", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
	});

	it("sends a confirmation email without subscribing the contact immediately", async () => {
		const caller = newsletterRouter.createCaller({
			ip: "newsletter-router-test",
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
});
