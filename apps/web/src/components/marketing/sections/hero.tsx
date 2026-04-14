import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import { Button } from "@/components/ui/button";
import { Display, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
	const t = await getTranslations("hero");

	return (
		<section id="hero" className="relative overflow-hidden py-48 md:py-52">
			{/* Mobile: subtle cloud in top-right, partially off-screen as depth layer */}
			<div className="pointer-events-none absolute top-12 right-[-24px] opacity-25 md:hidden">
				<div className="h-[220px] w-[180px]">
					<IconCloud />
				</div>
			</div>
			<div className="mx-auto max-w-[1320px] px-6">
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
								<Button
									size="lg"
									className="border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
									data-ph-capture-attribute-cta-location="hero"
									data-ph-capture-attribute-cta-variant="primary"
									render={<Link href={{ pathname: "/", hash: "contact" }} />}
								>
									{t("cta")}
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="hidden sm:inline-flex"
									data-ph-capture-attribute-cta-location="hero"
									data-ph-capture-attribute-cta-variant="secondary"
									render={<Link href={{ pathname: "/", hash: "services" }} />}
								>
									{t("ctaSecondary")}
								</Button>
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
