import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import { Button } from "@/components/ui/button";

export default async function Hero() {
	const t = await getTranslations("hero");

	return (
		<section id="hero" className="py-32 md:py-40">
			<div className="mx-auto max-w-[1200px] px-6">
				<HeroContent>
					<div className="max-w-2xl">
						<h1 className="font-normal text-4xl leading-[1.15] tracking-tight md:text-[56px]">
							{t.rich("title", {
								brand: (chunks) => (
									<span className="text-brand">{chunks}</span>
								),
							})}
						</h1>
						<p className="mt-6 font-light text-lg text-muted-foreground leading-relaxed">
							{t("subtitle")}
						</p>
						<div className="mt-10 flex flex-col gap-3 sm:flex-row">
							<Button
								size="lg"
								className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								render={<a href="/#contact" />}
							>
								{t("cta")}
							</Button>
							<Button
								size="lg"
								variant="outline"
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								render={<a href="/#services" />}
							>
								{t("ctaSecondary")}
							</Button>
						</div>
					</div>
				</HeroContent>
			</div>
		</section>
	);
}
