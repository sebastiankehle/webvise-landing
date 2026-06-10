import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";
import { generateAlternates, localizedUrl } from "@/lib/seo";
import MediaContent from "./media-content";

export async function generateMetadata(): Promise<Metadata> {
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
		},
	};
}

export default async function MediaPage() {
	const t = await getTranslations("media");
	const tHero = await getTranslations("hero");

	const heroTitle = (tHero.raw("title") as string)
		.replace(/<br\s*\/?><\/br>/g, " ")
		.replace(/<brand>(.*?)<\/brand>/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim();

	return (
		<section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
			<ConstructedGrid variant="page" />
			<GridContainer width="media">
				<H1>{t("title")}</H1>
				<Lead className="mt-4">{t("description")}</Lead>

				<MediaContent heroSlogan={heroTitle} />
			</GridContainer>
		</section>
	);
}
