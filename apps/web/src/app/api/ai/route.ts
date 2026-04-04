import { devToolsMiddleware } from "@ai-sdk/devtools";
import { gateway } from "@ai-sdk/gateway";
import {
	convertToModelMessages,
	streamText,
	type UIMessage,
	wrapLanguageModel,
} from "ai";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";

export const maxDuration = 30;

const limiter = createRateLimiter({
	name: "ai-completion",
	maxRequests: 10,
	windowMs: 60_000,
});

export async function POST(req: Request) {
	const ip = getClientIP(req);
	const rl = limiter.check(ip);
	if (rl.limited) return rateLimitResponse(rl.retryAfterSec);

	const { messages }: { messages: UIMessage[] } = await req.json();

	const model = wrapLanguageModel({
		model: gateway("google/gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
