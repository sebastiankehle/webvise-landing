import {
	type EmailResult,
	sendEmail,
	setContact,
} from "@webvise-app/api/email/resend";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("sendEmail", () => {
	const fetchMock = vi.fn();
	const ORIGINAL_KEY = process.env.RESEND_API_KEY;

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
		process.env.RESEND_API_KEY = "test-key";
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (ORIGINAL_KEY === undefined) {
			delete process.env.RESEND_API_KEY;
		} else {
			process.env.RESEND_API_KEY = ORIGINAL_KEY;
		}
	});

	it("returns not_configured when API key missing", async () => {
		delete process.env.RESEND_API_KEY;
		const r: EmailResult = await sendEmail({
			label: "t",
			from: "a@x",
			to: "b@x",
			subject: "s",
			html: "<p>h</p>",
		});
		expect(r.ok).toBe(false);
		expect(r.ok === false && r.reason).toBe("not_configured");
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("posts to resend.com/emails with required fields and bearer auth", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		const r = await sendEmail({
			label: "contact",
			from: "from@x",
			to: "to@x",
			subject: "sub",
			html: "<p>hi</p>",
		});
		expect(r.ok).toBe(true);
		expect(fetchMock).toHaveBeenCalledOnce();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("https://api.resend.com/emails");
		expect(init.method).toBe("POST");
		expect(init.headers.Authorization).toBe("Bearer test-key");
		expect(init.headers["Content-Type"]).toBe("application/json");
		const body = JSON.parse(init.body);
		expect(body).toMatchObject({
			from: "from@x",
			to: ["to@x"],
			subject: "sub",
			html: "<p>hi</p>",
		});
	});

	it("translates camelCase replyTo to snake_case reply_to", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await sendEmail({
			label: "t",
			from: "from@x",
			to: "to@x",
			replyTo: "reply@x",
			subject: "s",
			html: "h",
		});
		const body = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(body.reply_to).toBe("reply@x");
	});

	it("accepts a string `to` and serialises as an array", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await sendEmail({
			label: "t",
			from: "from@x",
			to: "single@x",
			subject: "s",
			html: "h",
		});
		const body = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(body.to).toEqual(["single@x"]);
	});

	it("passes through optional headers and attachments", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await sendEmail({
			label: "t",
			from: "from@x",
			to: "to@x",
			subject: "s",
			html: "h",
			headers: { "List-Unsubscribe": "<mailto:u@x>" },
			attachments: [{ filename: "x.pdf", content: "BASE64" }],
		});
		const body = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(body.headers).toEqual({ "List-Unsubscribe": "<mailto:u@x>" });
		expect(body.attachments).toEqual([
			{ filename: "x.pdf", content: "BASE64" },
		]);
	});

	it("returns api_error when Resend responds non-2xx", async () => {
		fetchMock.mockResolvedValueOnce(new Response("invalid", { status: 422 }));
		const r = await sendEmail({
			label: "t",
			from: "a@x",
			to: "b@x",
			subject: "s",
			html: "h",
		});
		expect(r.ok).toBe(false);
		expect(r.ok === false && r.reason).toBe("api_error");
		expect(r.ok === false && r.details).toContain("invalid");
	});

	it("returns api_error when fetch itself throws", async () => {
		fetchMock.mockRejectedValueOnce(new Error("boom"));
		const r = await sendEmail({
			label: "t",
			from: "a@x",
			to: "b@x",
			subject: "s",
			html: "h",
		});
		expect(r.ok).toBe(false);
		expect(r.ok === false && r.reason).toBe("api_error");
		expect(r.ok === false && r.details).toBe("boom");
	});
});

describe("setContact", () => {
	const fetchMock = vi.fn();
	const ORIGINAL_KEY = process.env.RESEND_API_KEY;

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
		process.env.RESEND_API_KEY = "test-key";
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (ORIGINAL_KEY === undefined) {
			delete process.env.RESEND_API_KEY;
		} else {
			process.env.RESEND_API_KEY = ORIGINAL_KEY;
		}
	});

	it("subscribes by inverting the polarity to unsubscribed:false", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		const r = await setContact({
			label: "newsletter",
			email: "a@x",
			subscribed: true,
		});
		expect(r.ok).toBe(true);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("https://api.resend.com/contacts");
		expect(JSON.parse(init.body)).toEqual({
			email: "a@x",
			unsubscribed: false,
		});
	});

	it("unsubscribes by sending unsubscribed:true", async () => {
		fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));
		await setContact({
			label: "unsubscribe",
			email: "a@x",
			subscribed: false,
		});
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			email: "a@x",
			unsubscribed: true,
		});
	});

	it("returns not_configured when API key missing", async () => {
		delete process.env.RESEND_API_KEY;
		const r = await setContact({
			label: "u",
			email: "a@x",
			subscribed: false,
		});
		expect(r.ok).toBe(false);
		expect(r.ok === false && r.reason).toBe("not_configured");
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
