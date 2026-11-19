import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionLink } from "@/components/marketing/action";
import HeroWall from "@/components/marketing/home/hero-wall";
import { ScenePlayer } from "@/components/marketing/scene-player";
import { GridContainer } from "@/components/marketing/section-wrapper";

// Credentials first, then the track record.
const factKeys = ["3", "0"] as const;

export default async function Hero() {
	const t = await getTranslations("home");
	const locale = await getLocale();

	return (
		<section
			className="relative overflow-hidden pt-14 pb-16 md:pt-24 md:pb-24"
			id="hero"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-[46rem]"
				style={{
					backgroundImage:
						"linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					backgroundPosition: "center top",
					maskImage:
						"radial-gradient(55% 60% at 50% 38%, black 20%, transparent 100%)",
				}}
			/>
			<GridContainer>
				{/* CSS-only entrance: the first screen never waits for script */}
				<div className="stagger-visible">
					<h1 className="mx-auto max-w-[70rem] text-balance text-center font-display text-[2.125rem] text-foreground leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:text-[4rem] lg:leading-[1.04] xl:text-[4.5rem]">
						{t("hero.titleLead")}
						<br />
						<span className="text-foreground/45">
							{t.rich("hero.titleRest", {
								nb: (chunks) => (
									<span className="whitespace-nowrap">{chunks}</span>
								),
							})}
						</span>
					</h1>
					<p className="mx-auto mt-6 max-w-[58ch] text-balance text-center text-[1.0625rem] text-foreground/65 leading-[1.6] lg:text-lg">
						{t("hero.subtitle")}
					</p>
					<div className="mt-9 flex flex-wrap items-center justify-center gap-3">
						<ActionLink
							arrow
							className="h-11 px-5 text-[0.9375rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_-12px_rgba(14,18,23,0.7)]"
							href="/book"
							location="hero"
							variant="ink"
						>
							{t("hero.cta")}
						</ActionLink>
						<ActionLink
							className="h-11 bg-card px-5 text-[0.9375rem] shadow-[0_0_0_1px_rgba(14,18,23,0.09),0_2px_6px_-2px_rgba(14,18,23,0.14)] hover:bg-card/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
							href="/case-studies"
							location="hero_secondary"
							variant="quiet"
						>
							{t("hero.secondary")}
						</ActionLink>
					</div>
					<ul className="mt-7 flex flex-col items-center gap-1.5 text-foreground/55 text-sm lg:flex-row lg:justify-center lg:gap-0">
						{/* One quiet line: the person first, then the proof */}
						<li className="flex items-center gap-2 whitespace-nowrap text-foreground/75">
							<Image
								alt=""
								className="size-6 shrink-0 rounded-full object-cover"
								height={24}
								src="/images/founder.jpeg"
								width={24}
							/>
							{t("hero.direct")}
						</li>
						{factKeys.map((key) => (
							<li className="flex items-center" key={key}>
								<span
									aria-hidden="true"
									className="mx-2.5 hidden text-foreground/25 lg:inline"
								>
									·
								</span>
								<span className="text-balance text-center lg:whitespace-nowrap">
									{t.rich(`hero.facts.${key}`, {
										nb: (chunks) => (
											<span className="whitespace-nowrap">{chunks}</span>
										),
									})}
								</span>
							</li>
						))}
					</ul>

					<div className="relative mx-auto mt-12 max-w-[1180px] md:mt-16">
						<ScenePlayer>
							<HeroWall label={t("stage.wall")} locale={locale} />
						</ScenePlayer>
					</div>
				</div>
			</GridContainer>
		</section>
	);
}
