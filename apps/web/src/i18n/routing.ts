import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "de"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	localeDetection: true,
	pathnames: {
		"/": "/",
		"/services/[slug]": "/services/[slug]",
		"/blog": "/blog",
		"/blog/[slug]": "/blog/[slug]",
		"/case-studies": "/case-studies",
		"/case-studies/[slug]": "/case-studies/[slug]",
		"/decks/[slug]": "/decks/[slug]",
		"/wp-health-report": "/wp-health-report",
		"/about": "/about",
		"/book": "/book",
		"/privacy": {
			en: "/privacy",
			de: "/datenschutz",
		},
		"/terms": "/terms",
		"/imprint": {
			en: "/imprint",
			de: "/impressum",
		},
		"/media": "/media",
		"/login": "/login",
		"/dashboard": "/dashboard",
		"/ai": "/ai",
	},
});
