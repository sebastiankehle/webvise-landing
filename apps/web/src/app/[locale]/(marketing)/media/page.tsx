import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
		<section className="py-20 md:py-32">
			<div className="mx-auto max-w-[1200px] px-6">
				<H1>{t("title")}</H1>
				<Lead className="mt-4">{t("description")}</Lead>

				<MediaContent heroSlogan={heroTitle} />
			</div>
		</section>
	);
}
