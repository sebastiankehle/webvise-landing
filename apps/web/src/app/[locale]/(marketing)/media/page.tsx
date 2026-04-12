import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
		<section className="py-24 md:py-44">
			<div className="mx-auto max-w-[1320px] px-6">
				<h1 className="font-display text-[40px] leading-[1.1] md:text-[56px]">
					{t("title")}
				</h1>
				<p className="mt-5 text-[17px] text-muted-foreground leading-[1.5]">
					{t("description")}
				</p>

				<MediaContent heroSlogan={heroTitle} />
			</div>
		</section>
	);
}
