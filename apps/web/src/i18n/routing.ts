import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "de", "fr", "es", "nl", "pl", "it"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	pathnames: {
		"/": "/",
		"/services/[slug]": "/services/[slug]",
		"/privacy": "/privacy",
		"/terms": "/terms",
		"/imprint": "/imprint",
	},
});
