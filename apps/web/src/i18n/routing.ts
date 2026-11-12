import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["de", "en"],
	// German is the site's own language and has no prefix; English lives
	// under /en. The URL alone decides the language, so a shared link opens
	// the same page for everyone.
	defaultLocale: "de",
	localePrefix: "as-needed",
	localeDetection: false,
	pathnames: {
		"/": "/",
		"/services": "/services",
		"/services/[slug]": "/services/[slug]",
		"/faq": "/faq",
		"/industries": "/industries",
		"/industries/[slug]": "/industries/[slug]",
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
