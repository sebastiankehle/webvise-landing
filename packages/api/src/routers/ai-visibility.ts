import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimitedProcedure, router } from "../index";
import { createRateLimiter } from "../rate-limit";
import { runAiVisibilityCheck } from "../services/ai-visibility/check";

const DAY_MS = 24 * 60 * 60_000;

// Each check makes up to nine paid model calls with web search (measured at
// about 15 cents), so the limits are strict: per visitor per hour and per
// day, and a site-wide daily cap that bounds the total spend however many
// visitors there are.
const aiVisibilityProcedure = rateLimitedProcedure({
	name: "ai-visibility-check",
	maxRequests: 3,
	windowMs: 60 * 60_000,
});
const dailyPerVisitor = createRateLimiter({
	name: "ai-visibility-check-day",
	maxRequests: 5,
	windowMs: DAY_MS,
});
const dailySiteWide = createRateLimiter({
	name: "ai-visibility-check-site",
	maxRequests: 25,
	windowMs: DAY_MS,
	failClosed: true,
});

/** The client shows its "try again tomorrow" message for this. */
const DAILY_LIMIT_MESSAGE = "DAILY_LIMIT";

const SINGLE_LINE_RE = /^[^\r\n]*$/;
const text = (max: number) => z.string().trim().max(max).regex(SINGLE_LINE_RE);
const optionalText = (max: number) =>
	text(max)
		.optional()
		.transform((value) => value || undefined);

export const aiVisibilityRouter = router({
	run: aiVisibilityProcedure
		.input(
			z.object({
				brand: text(100).min(1),
				url: z.string().url().max(2000),
				category: optionalText(80),
				city: optionalText(80),
				email: z.string().trim().email().max(200).optional(),
				firstName: optionalText(100),
				locale: z.enum(["de", "en"]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// The site-wide count only moves once the visitor's own limits pass.
			for (const [limiter, key] of [
				[dailyPerVisitor, ctx.ip],
				[dailySiteWide, "site"],
			] as const) {
				if ((await limiter.check(key)).limited) {
					throw new TRPCError({
						code: "TOO_MANY_REQUESTS",
						message: DAILY_LIMIT_MESSAGE,
					});
				}
			}
			const check = await runAiVisibilityCheck(input);
			if (check.ok) {
				return check.result;
			}
			if (check.error.kind === "invalid_url") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: check.error.message,
				});
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "The AI assistants did not answer. Please try again later.",
			});
		}),
});
