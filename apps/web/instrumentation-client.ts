import posthog from "posthog-js";

const CONSENT_STORAGE_KEY = "webvise-consent-v1";
const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token) {
	posthog.init(token, {
		api_host: "/ingest",
		ui_host: "https://eu.posthog.com",
		defaults: "2026-01-30",
		capture_exceptions: true,
		debug: process.env.NODE_ENV === "development",
		persistence: "memory",
		opt_out_capturing_by_default: true,
	});
}

try {
	const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
	if (stored) {
		const parsed = JSON.parse(stored) as { choice?: string };
		if (parsed.choice === "granted") {
			posthog.set_config({ persistence: "localStorage+cookie" });
			posthog.opt_in_capturing();
		}
	}
} catch {
	// ignore (Safari private mode etc.)
}
