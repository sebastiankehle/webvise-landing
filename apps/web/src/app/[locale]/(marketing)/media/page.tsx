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
		<section className="py-20 md:py-32">
			<div className="mx-auto max-w-[1200px] px-6">
				<h1 className="font-normal text-3xl tracking-tight md:text-[48px]">
					{t("title")}
				</h1>
				<p className="mt-4 font-light text-lg text-muted-foreground">
					{t("description")}
				</p>

				<MediaContent heroSlogan={heroTitle} />
			</div>
		</section>
	);
}
