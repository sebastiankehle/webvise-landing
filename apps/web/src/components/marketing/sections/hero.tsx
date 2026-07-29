import NextLink from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import { OpenAiPartnerBadge } from "@/components/marketing/openai-partner-badge";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Display, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";

export default async function Hero() {
	const [locale, t] = await Promise.all([getLocale(), getTranslations("hero")]);

	return (
		<section className="relative overflow-hidden py-48 md:py-36" id="hero">
			<ConstructedGrid hatch variant="hero" />
			{/* Mobile: subtle cloud in top-right, partially off-screen as depth layer */}
			<div className="pointer-events-none absolute top-12 right-[-24px] md:hidden">
				<div className="h-[220px] w-[180px]">
					<IconCloud />
				</div>
			</div>
			<GridContainer>
				<HeroContent>
					<div className="relative grid items-center gap-12 md:grid-cols-12">
						<div className="md:col-span-7">
							<Display>
								{t.rich("title", {
									brand: (chunks) => (
										<span className="text-brand-readable">{chunks}</span>
									),
									muted: (chunks) => (
										<span className="text-muted-foreground">{chunks}</span>
									),
									br: () => (
										<>
											{" "}
											<br className="hidden md:block" />
										</>
									),
								})}
							</Display>
							<Lead className="mt-6 max-w-[500px]">{t("subtitle")}</Lead>
							<div className="mt-10 flex flex-wrap items-center gap-4">
								<TrackClick
									event="cta_clicked"
									properties={{
										location: "hero",
										variant: "primary",
										destination: "contact",
									}}
								>
									<Button
										className="px-8"
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
								<TrackClick
									event="cta_clicked"
									properties={{
										location: "hero",
										variant: "secondary",
										destination: "case-studies",
									}}
								>
									<Button
										render={
											<Link
												aria-label={t("ctaSecondary")}
												href="/case-studies"
											/>
										}
										size="lg"
										variant="outline"
									>
										{t("ctaSecondary")}
									</Button>
								</TrackClick>
							</div>
						</div>
						<div className="hidden items-center justify-center md:col-span-5 md:flex">
							<div className="relative w-full max-w-[300px]">
								<IconCloud />
							</div>
						</div>
						<OpenAiPartnerBadge className="absolute right-0 bottom-0 hidden w-[93px] md:inline-flex" />
					</div>
					<div className="mt-10 flex md:hidden">
						<OpenAiPartnerBadge className="w-[93px]" />
					</div>
				</HeroContent>
			</GridContainer>
		</section>
	);
}
