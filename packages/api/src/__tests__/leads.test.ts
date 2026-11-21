import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	ATTIO_API_KEY: "attio-test-key" as string | undefined,
	VERCEL_ENV: undefined as string | undefined,
}));

vi.mock("@webvise-app/env/server", () => ({
	get env() {
		return envMock;
	},
}));

const insertValuesMock = vi.fn();
const posthogMock = vi.hoisted(() => ({ capture: vi.fn(), flush: vi.fn() }));

vi.mock("@webvise-app/api/posthog", () => ({
	getPostHogClient: () => posthogMock,
}));

vi.mock("@webvise-app/db", () => ({
	db: {
		insert: () => ({
			values: (...args: unknown[]) => insertValuesMock(...args),
		}),
	},
}));

const { recordLead, reportLeadNotificationFailure } = await import(
	"@webvise-app/api/services/leads"
);

const lead = {
	type: "contact" as const,
	email: " Lead@Example.com ",
	name: "Ada Lovelace",
	placement: "contact_form",
	path: "/book",
	topic: "web",
	note: { title: "Website contact form", content: "Hello" },
};

describe("recordLead", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		insertValuesMock.mockReset();
		insertValuesMock.mockResolvedValue(undefined);
		envMock.ATTIO_API_KEY = "attio-test-key";
		fetchMock.mockImplementation((url: string) =>
			Promise.resolve(
				url.includes("/notes")
					? new Response("{}", { status: 200 })
					: new Response(
							JSON.stringify({ data: { id: { record_id: "rec_1" } } }),
							{ status: 200 }
						)
			)
		);
		vi.stubGlobal("fetch", fetchMock);
		vi.spyOn(console, "error").mockImplementation(() => {
			// silence expected logs
		});
	});

	it("stores the event with the normalised email", async () => {
		await recordLead(lead);
		expect(insertValuesMock).toHaveBeenCalledWith({
			email: "lead@example.com",
			eventType: "contact",
			placement: "contact_form",
			path: "/book",
			topic: "web",
		});
	});

	it("sends the person and the note to Attio", async () => {
		await recordLead(lead);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const noteBody = JSON.parse(fetchMock.mock.calls[1]?.[1].body);
		expect(noteBody.data.title).toBe("Website contact form");
		expect(noteBody.data.parent_record_id).toBe("rec_1");
	});

	it("still calls Attio and resolves true when the DB insert throws", async () => {
		insertValuesMock.mockRejectedValue(new Error("db down"));
		await expect(recordLead(lead)).resolves.toBe(true);
		expect(fetchMock).toHaveBeenCalled();
	});

	it("resolves true when Attio answers 500", async () => {
		fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
		await expect(recordLead(lead)).resolves.toBe(true);
		expect(insertValuesMock).toHaveBeenCalledOnce();
	});

	it("resolves false when both the DB and Attio fail", async () => {
		insertValuesMock.mockRejectedValue(new Error("db down"));
		fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
		await expect(recordLead(lead)).resolves.toBe(false);
	});

	it("makes no request when ATTIO_API_KEY is missing", async () => {
		envMock.ATTIO_API_KEY = undefined;
		await recordLead(lead);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(insertValuesMock).toHaveBeenCalledOnce();
	});
});

describe("reportLeadNotificationFailure", () => {
	const failed = { ok: false, reason: "api_error" } as const;

	beforeEach(() => {
		posthogMock.capture.mockReset();
		posthogMock.flush.mockReset();
		posthogMock.flush.mockResolvedValue(undefined);
		vi.spyOn(console, "error").mockImplementation(() => {
			// silence expected logs
		});
	});

	it("sends a personless PostHog event in production, without the email", async () => {
		envMock.VERCEL_ENV = "production";
		await reportLeadNotificationFailure("wp_health_report", failed, true);
		envMock.VERCEL_ENV = undefined;
		expect(posthogMock.capture).toHaveBeenCalledWith({
			distinctId: "webvise-api",
			event: "lead_notification_failed",
			properties: {
				lead_type: "wp_health_report",
				reason: "api_error",
				stored: true,
				$process_person_profile: false,
			},
		});
		expect(posthogMock.flush).toHaveBeenCalledOnce();
	});

	it("only logs outside production", async () => {
		envMock.VERCEL_ENV = "preview";
		await reportLeadNotificationFailure("contact", failed, false);
		envMock.VERCEL_ENV = undefined;
		expect(posthogMock.capture).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(
			"[leads] contact notification email failed (api_error); lead lost"
		);
	});

	it("does not throw when PostHog fails", async () => {
		envMock.VERCEL_ENV = "production";
		posthogMock.flush.mockRejectedValue(new Error("network"));
		await expect(
			reportLeadNotificationFailure("contact", failed, false)
		).resolves.toBeUndefined();
		envMock.VERCEL_ENV = undefined;
	});
});
