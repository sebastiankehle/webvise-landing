import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	ATTIO_API_KEY: "attio-test-key" as string | undefined,
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

const { recordLead } = await import("@webvise-app/api/services/leads");

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
		const noteBody = JSON.parse(fetchMock.mock.calls[1][1].body);
		expect(noteBody.data.title).toBe("Website contact form");
		expect(noteBody.data.parent_record_id).toBe("rec_1");
	});

	it("still calls Attio and resolves when the DB insert throws", async () => {
		insertValuesMock.mockRejectedValue(new Error("db down"));
		await expect(recordLead(lead)).resolves.toBeUndefined();
		expect(fetchMock).toHaveBeenCalled();
	});

	it("resolves when Attio answers 500", async () => {
		fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
		await expect(recordLead(lead)).resolves.toBeUndefined();
		expect(insertValuesMock).toHaveBeenCalledOnce();
	});

	it("makes no request when ATTIO_API_KEY is missing", async () => {
		envMock.ATTIO_API_KEY = undefined;
		await recordLead(lead);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(insertValuesMock).toHaveBeenCalledOnce();
	});
});
