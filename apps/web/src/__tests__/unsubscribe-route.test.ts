import { createUnsubscribeToken } from "@webvise-app/api/email/unsubscribe-token";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../app/api/unsubscribe/route";

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
	const where = vi.fn(async () => undefined);
	const set = vi.fn(() => ({ where }));
	const update = vi.fn(() => ({ set }));
	return { update, set, where };
});

vi.mock("@webvise-app/db", () => ({
	db: { update: dbMock.update },
}));

function validToken() {
	return createUnsubscribeToken(
		"reader@example.com",
		Date.now(),
		envMock.BETTER_AUTH_SECRET
	);
}

function formPost(token: string) {
	const formData = new FormData();
	formData.set("token", token);
	return POST(
		new Request("https://webvise.io/api/unsubscribe", {
			method: "POST",
			body: formData,
		})
	);
}

function oneClickPost(token: string) {
	return POST(
		new Request(`https://webvise.io/api/unsubscribe?token=${token}`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "List-Unsubscribe=One-Click",
		})
	);
}

describe("/api/unsubscribe", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
		vi.stubGlobal("fetch", fetchMock);
		dbMock.update.mockClear();
		dbMock.set.mockClear();
		dbMock.where.mockReset();
		dbMock.where.mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("only leads to the confirm page when a mail scanner follows the GET link", () => {
		const token = validToken();

		const response = GET(
			new Request(`https://webvise.io/api/unsubscribe?token=${token}`)
		);

		expect(response.headers.get("location")).toContain("/unsubscribe?token=");
		expect(fetchMock).not.toHaveBeenCalled();
		expect(dbMock.update).not.toHaveBeenCalled();
	});

	it("reports a missing or invalid token on GET", () => {
		const missing = GET(new Request("https://webvise.io/api/unsubscribe"));
		expect(missing.headers.get("location")).toContain("error=missing");

		const invalid = GET(
			new Request("https://webvise.io/api/unsubscribe?token=bad")
		);
		expect(invalid.headers.get("location")).toContain("error=invalid");
	});

	it("unsubscribes the contact and records it when the page form is posted", async () => {
		const response = await formPost(validToken());

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/unsubscribe?success=true"
		);
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(fetchMock.mock.calls[0][0]).toBe("https://api.resend.com/contacts");
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			email: "reader@example.com",
			unsubscribed: true,
		});
		expect(dbMock.set).toHaveBeenCalledWith(
			expect.objectContaining({ status: "unsubscribed" })
		);
	});

	it("still reports success when the database update fails", async () => {
		dbMock.where.mockRejectedValue(new Error("db down"));

		const response = await formPost(validToken());

		expect(response.status).toBe(303);
		expect(response.headers.get("location")).toBe(
			"https://webvise.io/unsubscribe?success=true"
		);
	});

	it("answers a one-click POST with an empty 200", async () => {
		const response = await oneClickPost(validToken());

		expect(response.status).toBe(200);
		expect(await response.text()).toBe("");
		expect(fetchMock).toHaveBeenCalledOnce();
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			email: "reader@example.com",
			unsubscribed: true,
		});
	});

	it("rejects a one-click POST with an invalid token", async () => {
		const response = await oneClickPost("bad");

		expect(response.status).toBe(400);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
