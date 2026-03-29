import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, services } from "@/data/services";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
	return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = getServiceBySlug(slug);
	if (!service) return {};

	const t = await getTranslations("services");

	return {
		title: `${t(`${service.translationKey}.title`)} - webvise`,
		description: t(`${service.translationKey}.description`),
	};
}

export default async function ServicePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = getServiceBySlug(slug);

	if (!service) {
		notFound();
	}

	const t = await getTranslations("services");
	const td = await getTranslations("serviceDetail");
	const key = service.translationKey;
	const Icon = service.icon;

	return (
		<>
			<section className="py-24 md:py-44">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="max-w-2xl">
						<Link
							href={{ pathname: "/", hash: "services" }}
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							&larr; {td("backLink")}
						</Link>
						<div className="mt-8">
							<div className="flex h-12 w-12 items-center justify-center border border-brand/20 bg-brand/5">
								<Icon className="h-6 w-6 text-brand" strokeWidth={1.5} />
							</div>
							<h1 className="mt-5 font-display text-4xl tracking-tight md:text-5xl">
								{t(`${key}.title`)}
							</h1>
						</div>
						<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
							{t(`${key}.tagline`)}
						</p>
						<div className="mt-8 flex flex-wrap gap-3 text-sm">
							<span className="border border-border/40 px-3 py-1.5">
								{t(`${key}.price`)}
							</span>
							<span className="border border-border/40 px-3 py-1.5">
								{t(`${key}.timeline`)}
							</span>
							<span className="border border-border/40 px-3 py-1.5">
								{td("ongoingSupport")}
							</span>
						</div>
					</div>
				</div>
			</section>

			<SectionWrapper id="about" alternate>
				<div className="grid gap-16 md:grid-cols-2 md:gap-20">
					<div>
						<h2 className="font-display text-2xl tracking-tight">
							{td("aboutTitle")}
						</h2>
						<p className="mt-4 text-muted-foreground leading-relaxed">
							{t(`${key}.description`)}
						</p>
					</div>
					<div>
						<h2 className="font-display text-2xl tracking-tight">
							{td("toolsTitle")}
						</h2>
						<div className="mt-4 flex flex-wrap gap-2">
							{Array.from({ length: service.toolCount }, (_, i) => (
								<span
									key={t(`${key}.tools.${i}`)}
									className="border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
								>
									{t(`${key}.tools.${i}`)}
								</span>
							))}
						</div>
					</div>
				</div>
			</SectionWrapper>

			<SectionWrapper id="why">
				<div className="max-w-2xl">
					<h2 className="font-display text-3xl tracking-tight md:text-4xl">
						{td("painPointsTitle")}
					</h2>
				</div>
				<div className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => (
						<div
							key={t(`${key}.painPoints.${i}.heading`)}
							className="border-border/40 border-t-2 border-t-brand not-last:border-b p-8 md:not-last:border-r md:not-last:border-b-0 md:p-10"
						>
							<h3 className="font-display text-lg">
								{t(`${key}.painPoints.${i}.heading`)}
							</h3>
							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								{t(`${key}.painPoints.${i}.description`)}
							</p>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" alternate>
				<h2 className="font-display text-2xl tracking-tight">
					{td("featuresTitle")}
				</h2>
				<div className="mt-10 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2">
					{Array.from({ length: service.featureCount }, (_, i) => (
						<div
							key={t(`${key}.features.${i}`)}
							className="border-border/40 not-last:border-b p-5 text-sm md:nth-last-[-n+2]:border-b-0 md:odd:not-last:border-r"
						>
							{t(`${key}.features.${i}`)}
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="deliverables">
				<h2 className="font-display text-2xl tracking-tight">
					{td("deliverablesTitle")}
				</h2>
				<div className="mt-10 max-w-2xl border border-border/40">
					{Array.from({ length: service.deliverableCount }, (_, i) => (
						<div
							key={t(`${key}.deliverables.${i}`)}
							className="flex gap-4 not-last:border-border/40 not-last:border-b px-6 py-5"
						>
							<span className="font-display text-brand/50 text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="text-sm leading-relaxed">
								{t(`${key}.deliverables.${i}`)}
							</span>
						</div>
					))}
				</div>
			</SectionWrapper>

			{slug === "wordpress-migration" && <WpHealthCta />}

			<SectionWrapper id="cta" alternate>
				<div className="max-w-xl">
					<h2 className="font-display text-2xl tracking-tight">
						{td("ctaTitle")}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">
						{td("ctaDescription")}
					</p>
					<div className="mt-8 flex gap-3">
						<Button
							className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							render={<Link href={{ pathname: "/", hash: "contact" }} />}
						>
							{td("ctaButton")}
						</Button>
						{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
						<Button variant="outline" render={<Link href={{ pathname: "/", hash: "pricing" }} />}>
							{td("ctaPricingButton")}
						</Button>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
