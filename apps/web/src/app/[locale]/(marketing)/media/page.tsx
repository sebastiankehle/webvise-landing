import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl, shareImage } from "@/lib/seo";
import MediaContent from "./media-content";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("media"),
		getLocale(),
	]);
	const title = t("title");
	const description = t("description");

	return {
		title,
		description,
		robots: { index: false, follow: false },
		alternates: generateAlternates("/media", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/media", locale),
			images: [shareImage(title)],
		},
	};
}

export default async function MediaPage({ params }: { params: LocaleParams }) {
	await pinLocale(params);
	const t = await getTranslations("media");
	// The assets carry the home page's headline in English, in both locales,
	// as the share image does
	const tHome = await getTranslations({ locale: "en", namespace: "home" });
	const tagline = [
		tHome("hero.titleLead"),
		tHome.markup("hero.titleRest", { nb: (chunks) => chunks }),
	] as const;

	return (
		<section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
			<ConstructedGrid variant="page" />
			<GridContainer width="media">
				<H1>{t("title")}</H1>
				<Lead className="mt-4">{t("description")}</Lead>

				<MediaContent tagline={tagline} />
			</GridContainer>
		</section>
	);
}
