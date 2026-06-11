import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";
import { createRateLimiter } from "./rate-limit";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export function rateLimitedProcedure(opts: {
	name: string;
	maxRequests: number;
	windowMs: number;
}) {
	const limiter = createRateLimiter(opts);
	return t.procedure.use(async ({ ctx, next }) => {
		const { limited, retryAfterSec } = await limiter.check(ctx.ip);
		if (limited) {
			throw new TRPCError({
				code: "TOO_MANY_REQUESTS",
				message: `Too many requests. Try again in ${retryAfterSec}s.`,
			});
		}
		return next();
	});
}
