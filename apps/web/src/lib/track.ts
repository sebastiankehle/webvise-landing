import posthog from "posthog-js";

type TrackProperties = Record<string, string | number | boolean | null>;

export function track(event: string, properties?: TrackProperties) {
	if (typeof window === "undefined") {
		return;
	}
	const gtag = (window as unknown as Record<string, unknown>).gtag;
	if (typeof gtag === "function") {
		(gtag as (...args: unknown[]) => void)("event", event, properties);
	}
	posthog.capture(event, properties);
}
