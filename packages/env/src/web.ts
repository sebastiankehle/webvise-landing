import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().optional(),
		NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:
			process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	},
	emptyStringAsUndefined: true,
});
