import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import { GridFrame } from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { Display, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
	const t = await getTranslations("hero");

	return (
		<section id="hero" className="relative overflow-hidden py-48 md:py-52">
			{/* Continuous vertical connectors */}
			<div
				className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block"
				aria-hidden="true"
			>
				<div className="h-full border-grid-line border-x" />
			</div>
			{/* Side gutter hatch */}
			<div
				className="grid-hatch pointer-events-none absolute inset-y-0 left-0 hidden md:block md:w-[calc((100%-1320px)/2)]"
				aria-hidden="true"
			/>
			<div
				className="grid-hatch pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[calc((100%-1320px)/2)]"
				aria-hidden="true"
			/>
			<GridFrame className="inset-0" />
			{/* Mobile: subtle cloud in top-right, partially off-screen as depth layer */}
			<div className="pointer-events-none absolute top-12 right-[-24px] opacity-25 md:hidden">
				<div className="h-[220px] w-[180px]">
					<IconCloud />
				</div>
			</div>
			<div className="relative mx-auto max-w-[1320px] px-6">
				<HeroContent>
					<div className="grid items-center gap-12 md:grid-cols-12">
						<div className="md:col-span-7">
							<Display>
								{t.rich("title", {
									brand: (chunks) => (
										<span className="text-brand">{chunks}</span>
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
										size="lg"
										className="border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
										render={<Link href={{ pathname: "/", hash: "contact" }} />}
									>
										{t("cta")}
									</Button>
								</TrackClick>
								<TrackClick
									event="cta_clicked"
									properties={{
										location: "hero",
										variant: "secondary",
										destination: "services",
									}}
								>
									<Button
										size="lg"
										variant="ghost"
										className="hidden text-muted-foreground sm:inline-flex"
										render={<Link href={{ pathname: "/", hash: "services" }} />}
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
			</div>
		</section>
	);
}
