import NextLink from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";
import { homepageSectionHref } from "@/lib/homepage-section-href";

export default async function MidCta() {
	const [locale, t] = await Promise.all([
		getLocale(),
		getTranslations("midCta"),
	]);

	return (
		<SectionWrapper
			className="!pt-20 !pb-20 md:!pt-28 md:!pb-28"
			id="mid-cta"
			surface="inverted"
		>
			<div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-[640px]">
					<H2 className="text-balance">
						{t.rich("title", {
							brand: (chunks) => (
								<span className="text-brand-readable">{chunks}</span>
							),
							br: () => <br className="hidden md:block" />,
						})}
					</H2>
					<Muted className="mt-4 max-w-[560px]">{t("subtitle")}</Muted>
				</div>
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "mid-cta",
						variant: "primary",
						destination: "contact",
					}}
				>
					<Button
						className="shrink-0 px-8"
						render={
							<NextLink
								aria-label={t("cta")}
								href={homepageSectionHref("contact", locale)}
							/>
						}
						size="lg"
						variant="brand"
					>
						{t("cta")}
					</Button>
				</TrackClick>
			</div>
		</SectionWrapper>
	);
}
