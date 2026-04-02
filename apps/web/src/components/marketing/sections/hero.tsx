import { getTranslations } from "next-intl/server";

import GradientOrb from "@/components/marketing/gradient-orb";
import HeroAnimation from "@/components/marketing/hero-animation";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section id="hero" className="py-24 md:py-44">
      <div className="mx-auto max-w-[1320px] px-6">
        <HeroAnimation
          headline={
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
          }
          subtitle={
            <p className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          }
          actions={
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
          }
          visual={<GradientOrb />}
        />
      </div>
    </section>
  );
}
