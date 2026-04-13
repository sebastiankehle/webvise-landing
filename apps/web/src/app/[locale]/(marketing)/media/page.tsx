import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MediaContent from "./media-content";
import { H1, Lead } from "@/components/ui/typography";

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
				<h1 className="font-display text-[32px] leading-[1.05] md:text-[48px]">
					{t("title")}
				</h1>
				<p className="mt-4 text-[16px] text-muted-foreground leading-[1.6]">
					{t("description")}
				</p>

				<MediaContent heroSlogan={heroTitle} />
			</div>
		</section>
	);
}
