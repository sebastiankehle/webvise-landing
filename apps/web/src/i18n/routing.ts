import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["de", "en"],
	// German is the site's own language and has no prefix; English lives
	// under /en. An unprefixed URL follows the NEXT_LOCALE cookie, then the
	// browser's language, so English readers from a shared link land on /en.
	// Crawlers send no language and get German.
	defaultLocale: "de",
	localePrefix: "as-needed",
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
		"/tools": "/tools",
		"/tools/robots-llms-generator": "/tools/robots-llms-generator",
		"/tools/ai-visibility-check": "/tools/ai-visibility-check",
		"/tools/project-scope": "/tools/project-scope",
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
		"/brand": "/brand",
	},
});
