import { hasAnalyticsConsent } from "@/lib/consent";
import { getPostHog } from "@/lib/posthog-client";

type TrackProperties = Record<string, string | number | boolean | null>;

export function track(event: string, properties?: TrackProperties) {
	if (typeof window === "undefined" || !hasAnalyticsConsent()) {
		return;
	}
	const gtag = (window as unknown as Record<string, unknown>).gtag;
	if (typeof gtag === "function") {
		(gtag as (...args: unknown[]) => void)("event", event, properties);
	}
	getPostHog().then((posthog) => posthog?.capture(event, properties));
}
