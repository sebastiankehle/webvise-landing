import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "de", "fr", "es", "nl", "pl", "it"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	pathnames: {
		"/": "/",
		"/services/[slug]": "/services/[slug]",
		"/blog": "/blog",
		"/blog/[slug]": "/blog/[slug]",
		"/wp-health-report": "/wp-health-report",
		"/privacy": "/privacy",
		"/terms": "/terms",
		"/imprint": "/imprint",
	},
});
