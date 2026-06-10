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
