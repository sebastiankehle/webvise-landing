import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl, shareImage } from "@/lib/seo";
import BrandContent from "./brand-content";
import { BrandHero } from "./brand-hero";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("brand"),
		getLocale(),
	]);
	const title = t("title");
	const description = t("description");

	return {
		title,
		description,
		// Like the media kit: for people who work with webvise, not for search
		robots: { index: false, follow: false },
		alternates: generateAlternates("/brand", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/brand", locale),
			images: [shareImage(title)],
		},
	};
}

export default async function BrandPage({ params }: { params: LocaleParams }) {
	await pinLocale(params);

	return (
		<>
			<BrandHero />
			<BrandContent />
		</>
	);
}
