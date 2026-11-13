import { z } from "zod";

const MAX_MESSAGES = 30;
const MAX_TOTAL_CHARS = 16_000;
const MAX_ID_LENGTH = 200;

export interface ChatMessage {
	id: string;
	parts: { type: "text"; text: string }[];
	role: "user" | "assistant";
}

const messageSchema = z.object({
	id: z.unknown().optional(),
	role: z.enum(["user", "assistant"]),
	parts: z.array(z.unknown()),
});

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

function toTextPart(part: unknown): { type: "text"; text: string } | null {
	if (typeof part !== "object" || part === null) {
		return null;
	}
	const { type, text } = part as { type?: unknown; text?: unknown };
	if (type !== "text" || typeof text !== "string") {
		return null;
	}
	return { type: "text", text };
}

export function parseChatBody(
	body: unknown
): { ok: true; messages: ChatMessage[] } | { ok: false } {
	const parsed = bodySchema.safeParse(body);
	if (!parsed.success) {
		return { ok: false };
	}

	const messages: ChatMessage[] = [];
	let totalChars = 0;
	for (const message of parsed.data.messages) {
		const parts: ChatMessage["parts"] = [];
		for (const raw of message.parts) {
			const part = toTextPart(raw);
			if (part) {
				parts.push(part);
				totalChars += part.text.length;
			}
		}
		if (parts.length === 0) {
			if (message.role === "user") {
				return { ok: false };
			}
			continue;
		}
		const id =
			typeof message.id === "string" && message.id.length <= MAX_ID_LENGTH
				? message.id
				: crypto.randomUUID();
		messages.push({ id, role: message.role, parts });
	}

	if (totalChars > MAX_TOTAL_CHARS) {
		return { ok: false };
	}
	if (messages.at(-1)?.role !== "user") {
		return { ok: false };
	}
	return { ok: true, messages };
}
