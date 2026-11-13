import { DECKS } from "@webvise-app/api/reports";

export interface ServiceDeck {
	reportId: string;
	slug: string;
	title: { de: string; en: string };
}

/**
 * Gated service-deck PDFs, one per offering slug plus the cross-service
 * master sheet. The catalogue lives in the API package so the deck form and
 * the download endpoint cannot drift apart.
 */
export const serviceDecks: ServiceDeck[] = DECKS.map((entry) => ({
	reportId: `deck-${entry.slug}`,
	slug: entry.slug,
	title: entry.title,
}));

export function getDeckBySlug(slug: string): ServiceDeck | undefined {
	return serviceDecks.find((entry) => entry.slug === slug);
}

export function getDeckTitle(deckEntry: ServiceDeck, locale: string): string {
	return locale === "de" ? deckEntry.title.de : deckEntry.title.en;
}
