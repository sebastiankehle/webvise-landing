import { z } from "zod";

const MAX_MESSAGES = 30;
const MAX_TOTAL_CHARS = 16_000;

const messageSchema = z.looseObject({
	role: z.string(),
	parts: z.array(z.unknown()),
});

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

export function parseChatBody(
	body: unknown
): { ok: true; messages: z.infer<typeof messageSchema>[] } | { ok: false } {
	const parsed = bodySchema.safeParse(body);
	if (!parsed.success) {
		return { ok: false };
	}
	const totalChars = JSON.stringify(parsed.data.messages).length;
	if (totalChars > MAX_TOTAL_CHARS) {
		return { ok: false };
	}
	return { ok: true, messages: parsed.data.messages };
}
