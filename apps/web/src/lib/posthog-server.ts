import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
	if (posthogClient) {
		return posthogClient;
	}
	const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
	if (!token) {
		return null;
	}
	posthogClient = new PostHog(token, {
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		flushAt: 1,
		flushInterval: 0,
	});
	return posthogClient;
}
