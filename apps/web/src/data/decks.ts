export interface ServiceDeck {
	reportId: string;
	slug: string;
	title: { de: string; en: string };
}

function deck(slug: string, titleDe: string, titleEn: string): ServiceDeck {
	return {
		reportId: `deck-${slug}`,
		slug,
		title: { de: titleDe, en: titleEn },
	};
}

/**
 * Gated service-deck PDFs (WEB-59 CI set). Slugs match offering slugs so
 * every service subpage links to its own deck; "leistungsuebersicht" is the
 * cross-service master sheet reachable only via direct link. German pages
 * deliver the German PDF, every other locale the English one.
 */
export const serviceDecks: ServiceDeck[] = [
	deck("leistungsuebersicht", "Leistungsübersicht", "Service Overview"),
	deck(
		"landing-pages",
		"Landing Pages und Launch-Seiten",
		"Landing Pages & Launch Sites"
	),
	deck(
		"mvp-development",
		"MVPs und Produktprototypen",
		"MVPs & Product Prototypes"
	),
	deck("website-to-app-upgrades", "Website-Workflows", "Website Workflows"),
	deck(
		"wordpress-migration",
		"WordPress- und Legacy-Migrationen",
		"WordPress & Legacy Migrations"
	),
	deck(
		"internal-tools-dashboards",
		"Interne Tools und Dashboards",
		"Internal Tools & Dashboards"
	),
	deck(
		"client-portals-business-apps",
		"Kundenportale und Geschäftsanwendungen",
		"Client Portals & Business Applications"
	),
	deck(
		"booking-event-platforms",
		"Booking- und Event-Plattformen",
		"Booking & Event Platforms"
	),
	deck(
		"full-stack-applications",
		"Individuelle Business-Anwendungen",
		"Custom Business Applications"
	),
	deck("ai-consulting", "KI-Audit und Beratung", "AI Audit & Consulting"),
	deck(
		"company-brain-memory-systems",
		"Company-Brain-Systeme",
		"Company Brain Systems"
	),
	deck("ai-automation", "KI-Workflow-Automation", "AI Workflow Automation"),
	deck(
		"agentic-workflow-automation",
		"KI-Agenten mit Review-Gates",
		"AI Agents with Review Gates"
	),
];

export function getDeckBySlug(slug: string): ServiceDeck | undefined {
	return serviceDecks.find((entry) => entry.slug === slug);
}

export function getDeckTitle(deckEntry: ServiceDeck, locale: string): string {
	return locale === "de" ? deckEntry.title.de : deckEntry.title.en;
}
