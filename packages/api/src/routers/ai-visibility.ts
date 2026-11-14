import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimitedProcedure, router } from "../index";
import { runAiVisibilityCheck } from "../services/ai-visibility/check";

// Each check makes up to nine paid model calls, so the limit is strict.
const aiVisibilityProcedure = rateLimitedProcedure({
	name: "ai-visibility-check",
	maxRequests: 5,
	windowMs: 60 * 60_000,
});

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
		.mutation(async ({ input }) => {
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
