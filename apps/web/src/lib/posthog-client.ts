import { env } from "@webvise-app/env/web";
import type { PostHog } from "posthog-js";

import { hasAnalyticsConsent } from "@/lib/consent";

const token = env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// Only run analytics in production. The /ingest reverse proxy does not exist in
// local dev, so initializing here floods the console with "Failed to fetch".
const enabled = Boolean(token) && process.env.NODE_ENV === "production";

let ready: Promise<PostHog | null> | undefined;
let client: PostHog | null = null;

/** The initialised PostHog client, or null where analytics is off or the
 * visitor has not accepted analytics. The library is about 60 KB compressed
 * and nothing on the first screen needs it, so it loads with the first call
 * after consent: at idle once the page has loaded, or with the first tracked
 * action if that comes sooner. */
export function getPostHog(): Promise<PostHog | null> {
	if (
		!(enabled && token) ||
		typeof window === "undefined" ||
		!hasAnalyticsConsent()
	) {
		return Promise.resolve(null);
	}
	ready ??= import("posthog-js").then(({ default: posthog }) => {
		posthog.init(token, {
			api_host: "/ingest",
			ui_host: "https://eu.posthog.com",
			defaults: "2026-01-30",
			capture_exceptions: true,
			persistence: "localStorage+cookie",
			advanced_disable_flags: true,
		});
		client = posthog;
		return posthog;
	});
	return ready;
}

/** The client if it has already loaded, for callers that cannot wait. */
export function loadedPostHog(): PostHog | null {
	return client;
}
