import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { Body, Caption, H1, Lead, Muted } from "@/components/ui/typography";
import { getDeckBySlug, getDeckTitle, serviceDecks } from "@/data/decks";

const DECK_PAGE_CARDS = [0, 1, 2] as const;

export function generateStaticParams() {
	return serviceDecks.map((deck) => ({ slug: deck.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const deck = getDeckBySlug(slug);
	if (!deck) {
		return {};
	}
	const locale = await getLocale();

	return {
		title: `${getDeckTitle(deck, locale)} — webvise`,
		robots: { index: false, follow: false },
	};
}

export default async function DeckGatePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const deck = getDeckBySlug(slug);

	if (!deck) {
		notFound();
	}

	const [t, locale] = await Promise.all([
		getTranslations("deckGate"),
		getLocale(),
	]);

	return (
		<SectionWrapper className="py-16 md:py-32" id="deck-gate">
			<div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
				<div>
					<Caption className="text-brand-readable">{t("eyebrow")}</Caption>
					<H1 className="mt-3">{getDeckTitle(deck, locale)}</H1>
					<Lead className="mt-4">{t("description")}</Lead>
				</div>
				<div className="lg:pt-2">
					<ReportDownloadForm
						buttonLabel={t("formButton")}
						className="my-0"
						description={t("formDescription")}
						reportId={deck.reportId}
						title={t("formTitle")}
					/>
				</div>
			</div>
			<div className="mt-14 grid gap-5 md:grid-cols-3">
				{DECK_PAGE_CARDS.map((i) => (
					<div className="surface-card p-6 md:p-7" key={i}>
						<Caption className="block text-brand-readable">
							{String(i + 1).padStart(2, "0")}
						</Caption>
						<Body className="mt-5 font-medium text-foreground text-sm">
							{t(`pages.${i}.title`)}
						</Body>
						<Muted className="mt-1.5 text-sm leading-relaxed">
							{t(`pages.${i}.description`)}
						</Muted>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
