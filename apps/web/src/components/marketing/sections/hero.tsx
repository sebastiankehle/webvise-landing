import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
	const t = await getTranslations("hero");
	const tt = await getTranslations("trust");

	return (
		<section id="hero" className="py-24 md:py-44">
			<div className="mx-auto max-w-[1320px] px-6">
				<HeroContent>
					<div className="grid items-center gap-16 md:grid-cols-2">
						<div>
							<h1 className="text-balance font-display text-3xl leading-[1.12] tracking-tight md:text-[52px]">
								{t.rich("title", {
									brand: (chunks) => (
										<span className="text-brand">{chunks}</span>
									),
									br: () => (
										<>
											{" "}
											<br className="hidden md:block" />
										</>
									),
								})}
							</h1>
							<p className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
								{t("subtitle")}
							</p>
							<p className="mt-3 text-muted-foreground/50 text-xs">
								{tt("heroBadge")}
							</p>
							<div className="mt-12 flex flex-col gap-4 sm:flex-row">
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
									data-ph-capture-attribute-cta-location="hero"
									data-ph-capture-attribute-cta-variant="secondary"
									render={<Link href={{ pathname: "/", hash: "services" }} />}
								>
									{t("ctaSecondary")}
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div className="relative w-full max-w-sm">
								<IconCloud />
							</div>
						</div>
					</div>
				</HeroContent>
			</div>
		</section>
	);
}
