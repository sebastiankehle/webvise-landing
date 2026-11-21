import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimitedProcedure, router } from "../index";
import { runWpHealthAudit, sendReportLead } from "../services/wp-health/audit";
import {
	createReportToken,
	verifyReportToken,
} from "../services/wp-health/report-token";

const wpHealthProcedure = rateLimitedProcedure({
	name: "wp-health-report",
	maxRequests: 5,
	windowMs: 60_000,
});
const unlockProcedure = rateLimitedProcedure({
	name: "wp-health-unlock",
	maxRequests: 5,
	windowMs: 60_000,
});

export const wpHealthRouter = router({
	run: wpHealthProcedure
		.input(
			z.object({
				url: z.string().url().max(2000),
				// The lead fields: only client bundles from before `unlock` send them.
				email: z.string().email().max(200).optional(),
				firstName: z.string().max(100).optional(),
				// Optional so client bundles from before this field keep working.
				locale: z.enum(["de", "en"]).optional(),
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
			return {
				...audit.result,
				reportToken: createReportToken(audit.result),
			};
		}),
	/** Emails the report the visitor saw; the token stops anyone editing it. */
	unlock: unlockProcedure
		.input(
			z.object({
				reportToken: z.string().max(50_000),
				email: z.string().email().max(200),
				firstName: z.string().max(100).optional(),
				locale: z.enum(["de", "en"]).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const report = verifyReportToken(input.reportToken);
			if (!report) {
				// Not BAD_REQUEST: the client tells an expired report from bad input.
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "This report has expired. Please run it again.",
				});
			}
			const lead = await sendReportLead(report, input);
			if (lead.lost) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Your email could not be saved. Please try again.",
				});
			}
			return { emailed: lead.emailed };
		}),
});
