import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import BookCall from "@/components/marketing/book-call";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import {
	Caption,
	H1,
	Lead,
	Muted,
	QuoteMark,
} from "@/components/ui/typography";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([getTranslations("book"), getLocale()]);

	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/book", locale),
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			siteName: "webvise",
			url: localizedUrl("/book", locale),
		},
	};
}

const factCount = 3;

export default async function BookPage() {
	const [t, tt] = await Promise.all([
		getTranslations("book"),
		getTranslations("testimonials"),
	]);

	return (
		<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
			<ConstructedGrid variant="page" />
			<GridContainer>
				<div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
					<div>
						<MarketingTag>{t("tag")}</MarketingTag>
						<H1 className="mt-6 max-w-3xl">{t("title")}</H1>
						<Lead className="mt-5 max-w-lg">{t("subtitle")}</Lead>
						<div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
							{Array.from({ length: factCount }, (_, i) => (
								<Caption
									className="flex items-center gap-3"
									key={t(`facts.${i}`)}
								>
									{i > 0 && (
										<span aria-hidden="true" className="text-border">
											·
										</span>
									)}
									{t(`facts.${i}`)}
								</Caption>
							))}
						</div>
					</div>

					<figure className="surface-card w-full max-w-md p-6 md:p-8 lg:justify-self-end">
						<QuoteMark />
						<blockquote className="mt-3 text-foreground text-sm leading-6">
							{tt("items.3.quote")}
						</blockquote>
						<figcaption className="mt-4">
							<Muted className="font-medium text-foreground">
								{tt("items.3.author")}
							</Muted>
							<Caption>
								{tt("items.3.role")} — {tt("items.3.company")}
							</Caption>
						</figcaption>
					</figure>
				</div>

				<BookCall />
			</GridContainer>
		</section>
	);
}
