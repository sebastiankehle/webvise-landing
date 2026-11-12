import { getPostHog } from "./src/lib/posthog-client";

// Analytics starts once the page has loaded and the browser has a free
// moment, so it never competes with the first paint.
function startWhenIdle() {
	if ("requestIdleCallback" in window) {
		window.requestIdleCallback(() => getPostHog(), { timeout: 2000 });
	} else {
		setTimeout(getPostHog, 200);
	}
}

if (document.readyState === "complete") {
	startWhenIdle();
} else {
	window.addEventListener("load", startWhenIdle, { once: true });
}
