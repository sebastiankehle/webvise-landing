import posthog from "posthog-js";

type TrackProperties = Record<string, string | number | boolean | null>;

export function track(event: string, properties?: TrackProperties) {
	if (typeof window !== "undefined" && posthog.__loaded) {
		posthog.capture(event, properties);
	}
}
