import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl, shareImage } from "@/lib/seo";
import BrandContent from "./brand-content";

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
	const t = await getTranslations("brand");

	return (
		<section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
			<ConstructedGrid variant="page" />
			<GridContainer width="media">
				<H1>{t("title")}</H1>
				<Lead className="mt-4 max-w-[60ch]">
					{t.rich("lead", {
						link: (chunks) => (
							<Link
								className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:decoration-foreground"
								href="/media"
							>
								{chunks}
							</Link>
						),
					})}
				</Lead>

				<BrandContent />
			</GridContainer>
		</section>
	);
}
