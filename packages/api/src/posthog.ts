import { env } from "@webvise-app/env/web";
import { PostHog } from "posthog-node";

// The project lives in PostHog's EU region; posthog-node defaults to the US.
const EU_HOST = "https://eu.i.posthog.com";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
	if (posthogClient) {
		return posthogClient;
	}
	const token = env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
	if (!token) {
		return null;
	}
	posthogClient = new PostHog(token, {
		host: env.NEXT_PUBLIC_POSTHOG_HOST ?? EU_HOST,
		flushAt: 1,
		flushInterval: 0,
	});
	return posthogClient;
}
