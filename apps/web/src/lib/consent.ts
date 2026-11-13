export const CONSENT_STORAGE_KEY = "webvise-consent-v1";

export type ConsentChoice = "granted" | "denied";

export function parseConsent(raw: string | null): ConsentChoice | null {
	if (!raw) {
		return null;
	}
	try {
		const parsed = JSON.parse(raw) as { choice?: unknown } | null;
		const choice = parsed?.choice;
		return choice === "granted" || choice === "denied" ? choice : null;
	} catch {
		return null;
	}
}

export function readConsent(): ConsentChoice | null {
	if (typeof window === "undefined") {
		return null;
	}
	try {
		return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
	} catch {
		return null;
	}
}

export function hasAnalyticsConsent(): boolean {
	return readConsent() === "granted";
}

export function writeConsent(choice: ConsentChoice): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		window.localStorage.setItem(
			CONSENT_STORAGE_KEY,
			JSON.stringify({ choice, ts: Date.now() })
		);
	} catch {
		// ignore (Safari private mode etc.)
	}
	window.dispatchEvent(new CustomEvent("webvise:consent", { detail: choice }));
}

export function clearConsent(): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		window.localStorage.removeItem(CONSENT_STORAGE_KEY);
	} catch {
		// ignore
	}
}

const ANALYTICS_COOKIE = /^(ph_|_ga|_gid)/;

/** Names of the analytics cookies (PostHog, Google Analytics) in a cookie header. */
export function analyticsCookieNames(cookieHeader: string): string[] {
	return cookieHeader
		.split(";")
		.map((part) => part.split("=")[0]?.trim() ?? "")
		.filter((name) => ANALYTICS_COOKIE.test(name));
}

const IPV4 = /^[\d.]+$/;

function parentDomain(hostname: string): string | null {
	if (
		hostname === "localhost" ||
		IPV4.test(hostname) ||
		hostname.includes(":")
	) {
		return null;
	}
	const labels = hostname.split(".");
	return labels.length < 2 ? null : `.${labels.slice(-2).join(".")}`;
}

/** Remove PostHog and Google Analytics identifiers from the browser. */
export function clearAnalyticsStorage(): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		for (const key of Object.keys(window.localStorage)) {
			if (key.startsWith("ph_") || key.startsWith("__ph_")) {
				window.localStorage.removeItem(key);
			}
		}
	} catch {
		// ignore
	}
	const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
	const domain = parentDomain(window.location.hostname);
	for (const name of analyticsCookieNames(document.cookie)) {
		// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not supported in all browsers yet
		document.cookie = `${name}=;${expired}`;
		if (domain) {
			// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not supported in all browsers yet
			document.cookie = `${name}=;${expired};domain=${domain}`;
		}
	}
}
