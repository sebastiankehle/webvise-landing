import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1).optional(),
		BETTER_AUTH_SECRET: z.string().min(32).optional(),
		BETTER_AUTH_URL: z.url().optional(),
		CORS_ORIGIN: z.url().optional(),
		RESEND_API_KEY: z.string().optional(),
		ATTIO_API_KEY: z.string().optional(),
		GOOGLE_PAGESPEED_API_KEY: z.string().optional(),
		AI_GATEWAY_API_KEY: z.string().optional(),
		UPSTASH_REDIS_REST_URL: z.url().optional(),
		UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
		GOOGLE_VERIFICATION_CODE: z.string().optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
