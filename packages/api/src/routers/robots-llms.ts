import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimitedProcedure, router } from "../index";
import { prefillFromSite } from "../services/robots-llms/prefill";

const prefillProcedure = rateLimitedProcedure({
	name: "robots-llms-prefill",
	maxRequests: 10,
	windowMs: 60_000,
});

export const robotsLlmsRouter = router({
	prefill: prefillProcedure
		.input(z.object({ url: z.string().url().max(2000) }))
		.mutation(async ({ input }) => {
			const outcome = await prefillFromSite(input.url);
			if (!outcome.ok) {
				throw new TRPCError({ code: "BAD_REQUEST", message: outcome.message });
			}
			return outcome.result;
		}),
});
