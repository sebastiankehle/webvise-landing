import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().optional(),
		NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
		// Set by Vercel; NODE_ENV is "production" on previews too.
		NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:
			process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
	},
	emptyStringAsUndefined: true,
});
