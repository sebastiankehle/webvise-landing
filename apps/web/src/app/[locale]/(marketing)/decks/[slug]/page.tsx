import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { Caption, H1, Muted } from "@/components/ui/typography";
import { getDeckBySlug, getDeckTitle, serviceDecks } from "@/data/decks";

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
		<SectionWrapper className="pt-8 md:pt-12" id="deck-gate">
			<div className="mx-auto max-w-2xl">
				<Caption className="text-brand-readable">{t("eyebrow")}</Caption>
				<H1 className="mt-3">{getDeckTitle(deck, locale)}</H1>
				<Muted className="mt-4 leading-relaxed">{t("description")}</Muted>
				<ReportDownloadForm
					buttonLabel={t("formButton")}
					description={t("formDescription")}
					reportId={deck.reportId}
					title={t("formTitle")}
				/>
			</div>
		</SectionWrapper>
	);
}
