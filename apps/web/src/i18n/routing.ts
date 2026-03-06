import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "de"],
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
