import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";
import MediaContent from "./media-content";

export const metadata: Metadata = {
	title: "Media",
	robots: { index: false, follow: false },
};

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
