import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GridFrame } from "@/components/marketing/section-wrapper";
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
			{/* Constructed grid */}
			<div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block" aria-hidden="true">
				<div className="h-full border-x border-grid-line" />
			</div>
			<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block" aria-hidden="true" />
			<GridFrame className="inset-0" />
			<div className="relative mx-auto max-w-[1200px] px-6">
				<H1>{t("title")}</H1>
				<Lead className="mt-4">{t("description")}</Lead>

				<MediaContent heroSlogan={heroTitle} />
			</div>
		</section>
	);
}
