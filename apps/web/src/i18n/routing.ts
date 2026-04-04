import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "de", "fr", "es", "nl", "pl", "it"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	localeDetection: false,
	pathnames: {
		"/": "/",
		"/services/[slug]": "/services/[slug]",
		"/blog": "/blog",
		"/blog/[slug]": "/blog/[slug]",
		"/case-studies": "/case-studies",
		"/case-studies/[slug]": "/case-studies/[slug]",
		"/wp-health-report": "/wp-health-report",
		"/about": "/about",
		"/privacy": "/privacy",
		"/terms": "/terms",
		"/imprint": "/imprint",
		"/media": "/media",
		"/login": "/login",
		"/dashboard": "/dashboard",
		"/todos": "/todos",
		"/ai": "/ai",
	},
});
