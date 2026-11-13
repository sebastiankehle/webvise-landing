import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// This file is the one place allowed to read `process.env` directly.
const isProduction = process.env.VERCEL_ENV === "production";

export const env = createEnv({
	server: {
		DATABASE_URL: isProduction
			? z.string().min(1)
			: z.string().min(1).optional(),
		BETTER_AUTH_SECRET: isProduction
			? z.string().min(32)
			: z.string().min(32).optional(),
		BETTER_AUTH_URL: z.url().optional(),
		CORS_ORIGIN: z.url().optional(),
		RESEND_API_KEY: isProduction ? z.string().min(1) : z.string().optional(),
		ATTIO_API_KEY: z.string().optional(),
		GOOGLE_PAGESPEED_API_KEY: isProduction
			? z.string().min(1)
			: z.string().optional(),
		AI_GATEWAY_API_KEY: z.string().optional(),
		UPSTASH_REDIS_REST_URL: z.url().optional(),
		UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
		GOOGLE_VERIFICATION_CODE: z.string().optional(),
		CONTACT_EMAIL_TO: z.email().default("mail@webvise.io"),
		AI_CHAT_SYSTEM_PROMPT: z.string().optional(),
		EMAIL_TOKEN_SECRET: z.string().min(32).optional(),
		VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	// The Upstash integration on Vercel names its REST credentials
	// KV_REST_API_URL / KV_REST_API_TOKEN; accept those as well.
	runtimeEnv: {
		...process.env,
		UPSTASH_REDIS_REST_URL:
			process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
		UPSTASH_REDIS_REST_TOKEN:
			process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
	},
	emptyStringAsUndefined: true,
});
