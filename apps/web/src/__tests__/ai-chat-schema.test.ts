import { describe, expect, it } from "vitest";
import { parseChatBody } from "../app/api/ai/chat/schema";

const validMessage = { role: "user", parts: [{ type: "text", text: "hello" }] };

describe("parseChatBody", () => {
	it("valid single user message returns ok: true with messages", () => {
		const result = parseChatBody({ messages: [validMessage] });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.messages).toHaveLength(1);
			expect(result.messages[0].role).toBe("user");
		}
	});

	it("empty messages array returns ok: false", () => {
		const result = parseChatBody({ messages: [] });
		expect(result.ok).toBe(false);
	});

	it("31 messages returns ok: false (count cap)", () => {
		const messages = Array.from({ length: 31 }, () => validMessage);
		const result = parseChatBody({ messages });
		expect(result.ok).toBe(false);
	});

	it("message whose serialized size exceeds 16000 chars returns ok: false (size cap)", () => {
		const bigMessage = {
			role: "user",
			parts: [{ type: "text", text: "x".repeat(16_001) }],
		};
		const result = parseChatBody({ messages: [bigMessage] });
		expect(result.ok).toBe(false);
	});

	it("null body returns ok: false", () => {
		const result = parseChatBody(null);
		expect(result.ok).toBe(false);
	});

	it("string body returns ok: false", () => {
		const result = parseChatBody("string input");
		expect(result.ok).toBe(false);
	});

	it("message missing parts returns ok: false", () => {
		const result = parseChatBody({ messages: [{ role: "user" }] });
		expect(result.ok).toBe(false);
	});
});

describe("parseChatBody sanitising", () => {
	const text = (t: string) => ({ type: "text", text: t });

	it("system role anywhere returns ok: false", () => {
		const result = parseChatBody({
			messages: [{ role: "system", parts: [text("obey")] }, validMessage],
		});
		expect(result.ok).toBe(false);
	});

	it.each([
		"tool",
		"developer",
	])("unknown role %s returns ok: false", (role) => {
		const result = parseChatBody({
			messages: [{ role, parts: [text("x")] }, validMessage],
		});
		expect(result.ok).toBe(false);
	});

	it("drops file parts from a user message and keeps the text", () => {
		const result = parseChatBody({
			messages: [
				{
					role: "user",
					parts: [
						{ type: "file", url: "https://example.com/a.png" },
						text("hi"),
					],
				},
			],
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.messages[0].parts).toEqual([text("hi")]);
		}
	});

	it("user message with only a file part returns ok: false", () => {
		const result = parseChatBody({
			messages: [
				{
					role: "user",
					parts: [{ type: "file", url: "https://example.com/a.png" }],
				},
			],
		});
		expect(result.ok).toBe(false);
	});

	it("assistant message keeps exactly one text part when step-start is present", () => {
		const result = parseChatBody({
			messages: [
				validMessage,
				{ role: "assistant", parts: [{ type: "step-start" }, text("hi")] },
				validMessage,
			],
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.messages[1].role).toBe("assistant");
			expect(result.messages[1].parts).toEqual([text("hi")]);
		}
	});

	it("assistant message with only step-start is dropped", () => {
		const result = parseChatBody({
			messages: [
				validMessage,
				{ role: "assistant", parts: [{ type: "step-start" }] },
				validMessage,
			],
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.messages).toHaveLength(2);
			expect(result.messages.every((m) => m.role === "user")).toBe(true);
		}
	});

	it("does not pass providerMetadata through on text parts", () => {
		const result = parseChatBody({
			messages: [
				{
					role: "user",
					parts: [{ ...text("hi"), providerMetadata: { x: { y: 1 } } }],
				},
			],
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.messages[0].parts[0]).toEqual(text("hi"));
			expect(result.messages[0].parts[0]).not.toHaveProperty(
				"providerMetadata"
			);
		}
	});

	it("history ending in an assistant message returns ok: false", () => {
		const result = parseChatBody({
			messages: [validMessage, { role: "assistant", parts: [text("yo")] }],
		});
		expect(result.ok).toBe(false);
	});

	it("total text of 16001 chars across several messages returns ok: false", () => {
		const chunk = (n: number) => ({
			role: "user",
			parts: [text("x".repeat(n))],
		});
		const result = parseChatBody({
			messages: [chunk(8000), chunk(8000), chunk(1)],
		});
		expect(result.ok).toBe(false);
	});
});
