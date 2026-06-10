import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Display, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
	const t = await getTranslations("hero");

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
					<div className="grid items-center gap-12 md:grid-cols-12">
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
							<div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
										render={<Link href={{ pathname: "/", hash: "contact" }} />}
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
										destination: "systems",
									}}
								>
									<Button
										className="hidden text-muted-foreground sm:inline-flex"
										render={<Link href={{ pathname: "/", hash: "systems" }} />}
										size="lg"
										variant="ghost"
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
					</div>
				</HeroContent>
			</GridContainer>
		</section>
	);
}
