import { partnerRouter } from "@webvise-app/api/routers/partner";
import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	ATTIO_API_KEY: "attio-test-key",
	BETTER_AUTH_SECRET: "test-secret-that-is-at-least-32-chars!!",
	CONTACT_EMAIL_TO: "mail@webvise.io",
	NODE_ENV: "test",
	RESEND_API_KEY: "test-key",
}));

vi.mock("@webvise-app/env/server", () => ({
	get env() {
		return envMock;
	},
}));

const insertValuesMock = vi.fn();

vi.mock("@webvise-app/db", () => ({
	db: {
		insert: () => ({
			values: (...args: unknown[]) => insertValuesMock(...args),
		}),
	},
}));

const VALID = {
	name: "Ada Lovelace",
	email: "Lead@Example.com",
	discipline: "Design",
	interest: "network" as const,
};

describe("partnerRouter.submit", () => {
	const fetchMock = vi.fn();
	let ipCounter = 0;

	function caller() {
		ipCounter += 1;
		return partnerRouter.createCaller({
			ip: `partner-router-test-${ipCounter}`,
			session: null,
		});
	}

	beforeEach(() => {
		fetchMock.mockReset();
		insertValuesMock.mockReset();
		insertValuesMock.mockResolvedValue(undefined);
		fetchMock.mockImplementation((url: string) =>
			Promise.resolve(
				url.includes("attio.com/v2/objects")
					? new Response(
							JSON.stringify({ data: { id: { record_id: "rec_1" } } }),
							{ status: 200 }
						)
					: new Response("{}", { status: 200 })
			)
		);
		vi.stubGlobal("fetch", fetchMock);
		vi.spyOn(console, "error").mockImplementation(() => {
			// silence expected logs
		});
	});

	it("discards a honeypot submission without email or lead", async () => {
		await expect(
			caller().submit({ ...VALID, company: "Spam Inc" })
		).resolves.toEqual({ success: true });
		expect(fetchMock).not.toHaveBeenCalled();
		expect(insertValuesMock).not.toHaveBeenCalled();
	});

	it("discards a submission filled in too fast", async () => {
		await expect(
			caller().submit({ ...VALID, elapsedMs: 500 })
		).resolves.toEqual({ success: true });
		expect(fetchMock).not.toHaveBeenCalled();
		expect(insertValuesMock).not.toHaveBeenCalled();
	});

	it("sends one email and records one partner_application lead", async () => {
		await expect(caller().submit(VALID)).resolves.toEqual({ success: true });
		const urls = fetchMock.mock.calls.map((call) => call[0] as string);
		expect(
			urls.filter((u) => u === "https://api.resend.com/emails")
		).toHaveLength(1);
		expect(urls.some((u) => u.includes("attio.com/v2/notes"))).toBe(true);
		expect(insertValuesMock).toHaveBeenCalledOnce();
		expect(insertValuesMock.mock.calls[0][0]).toMatchObject({
			email: "lead@example.com",
			eventType: "partner_application",
			topic: "network",
		});
	});

	it("fails and records no lead when the email cannot be sent", async () => {
		fetchMock.mockResolvedValue(new Response("nope", { status: 500 }));
		await expect(caller().submit(VALID)).rejects.toMatchObject({
			code: "INTERNAL_SERVER_ERROR",
		});
		expect(insertValuesMock).not.toHaveBeenCalled();
	});
});
