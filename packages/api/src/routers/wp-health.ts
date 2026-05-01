import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimitedProcedure, router } from "../index";
import { runWpHealthAudit } from "../services/wp-health/audit";

const wpHealthProcedure = rateLimitedProcedure({
	name: "wp-health-report",
	maxRequests: 5,
	windowMs: 60_000,
});

export const wpHealthRouter = router({
	run: wpHealthProcedure
		.input(
			z.object({
				url: z.string().url(),
				email: z.string().email().optional(),
				firstName: z.string().max(100).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const audit = await runWpHealthAudit(input);
			if (!audit.ok) {
				switch (audit.error.kind) {
					case "missing_psi_key":
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message:
								"Service temporarily unavailable. Please try again later.",
						});
					case "invalid_url":
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: audit.error.message,
						});
					case "psi_failed": {
						const code = audit.error.code;
						if (code === "rate_limited") {
							throw new TRPCError({
								code: "TOO_MANY_REQUESTS",
								message:
									"Rate limited by Google. Please try again in a moment.",
							});
						}
						if (code === "bad_url") {
							throw new TRPCError({
								code: "BAD_REQUEST",
								message:
									"Could not analyze this URL. Make sure it's a publicly accessible website.",
							});
						}
						if (code === "key_issue") {
							throw new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message:
									"Analysis service is temporarily unavailable. Please try again later.",
							});
						}
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message:
								"Failed to analyze website. Please check the URL and try again.",
						});
					}
					case "psi_null_score":
						throw new TRPCError({
							code: "BAD_REQUEST",
							message:
								"Could not analyze this URL. Make sure it's a publicly accessible website.",
						});
					default: {
						const _exhaustive: never = audit.error;
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Unknown error",
							cause: _exhaustive,
						});
					}
				}
			}
			return audit.result;
		}),
});
