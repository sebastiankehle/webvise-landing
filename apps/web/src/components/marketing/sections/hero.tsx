import { getTranslations } from "next-intl/server";

import HeroContent from "@/components/marketing/hero-content";
import IconCloud from "@/components/marketing/icon-cloud";
import { Button } from "@/components/ui/button";

export default async function Hero() {
	const t = await getTranslations("hero");

	return (
		<section id="hero" className="py-32 md:py-40">
			<div className="mx-auto max-w-[1200px] px-6">
				<HeroContent>
					<div className="grid items-center gap-12 md:grid-cols-2">
						<div>
							<h1 className="font-normal text-4xl leading-[1.15] tracking-tight md:text-[48px]">
								{t.rich("title", {
									brand: (chunks) => (
										<span className="text-brand">{chunks}</span>
									),
									br: () => <br className="hidden md:block" />,
								})}
							</h1>
							<p className="mt-6 font-light text-lg text-muted-foreground leading-relaxed">
								{t("subtitle")}
							</p>
							<div className="mt-10 flex flex-col gap-3 sm:flex-row">
								<Button
									size="lg"
									className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
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
