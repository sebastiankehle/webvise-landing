import { devToolsMiddleware } from "@ai-sdk/devtools";
import { gateway } from "@ai-sdk/gateway";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@webvise-app/api/rate-limit";
import { auth } from "@webvise-app/auth";
import {
	convertToModelMessages,
	streamText,
	type UIMessage,
	wrapLanguageModel,
} from "ai";

export const maxDuration = 30;

const limiter = createRateLimiter({
	name: "ai-completion",
	maxRequests: 10,
	windowMs: 60_000,
});

const SYSTEM_PROMPT =
	"You are an AI assistant, not a human support agent. Be clear about that if the user asks who they are interacting with. Do not ask users to share confidential, secret, sensitive, or special-category personal data. If asked for legal, medical, financial, or similarly regulated advice, provide general information only and recommend qualified professional advice for decisions.";

export async function POST(req: Request) {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const ip = getClientIP(req);
	const rl = await limiter.check(ip);
	if (rl.limited) {
		return rateLimitResponse(rl.retryAfterSec);
	}

	const { messages }: { messages: UIMessage[] } = await req.json();

	const model =
		process.env.NODE_ENV === "development"
			? wrapLanguageModel({
					model: gateway("google/gemini-2.5-flash"),
					middleware: devToolsMiddleware(),
				})
			: gateway("google/gemini-2.5-flash");

	const result = streamText({
		model,
		system: SYSTEM_PROMPT,
		messages: await convertToModelMessages(messages),
		abortSignal: req.signal,
	});

	return result.toUIMessageStreamResponse();
}
