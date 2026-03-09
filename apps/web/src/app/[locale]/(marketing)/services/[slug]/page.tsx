import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import AnimateIn from "@/components/marketing/animate-in";
import SectionWrapper from "@/components/marketing/section-wrapper";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, services } from "@/data/services";

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
			<section className="py-20 md:py-40">
				<div className="mx-auto max-w-[1200px] px-6">
					<AnimateIn>
						<div className="max-w-2xl">
							<a
								href="/#services"
								className="font-light text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								&larr; {td("backLink")}
							</a>
							<div className="mt-6 flex items-center gap-4">
								<Icon
									className="h-8 w-8 text-brand"
									strokeWidth={1.5}
								/>
								<h1 className="font-normal text-3xl tracking-tight md:text-5xl">
									{t(`${key}.title`)}
								</h1>
							</div>
							<p className="mt-3 font-light text-lg text-muted-foreground">
								{t(`${key}.tagline`)}
							</p>
							<div className="mt-6 flex flex-wrap gap-4 font-light text-sm">
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
					</AnimateIn>
				</div>
			</section>

			<SectionWrapper id="about" alternate>
				<div className="grid gap-16 md:grid-cols-2">
					<div>
						<h2 className="font-normal text-2xl tracking-tight">
							{td("aboutTitle")}
						</h2>
						<p className="mt-4 font-light text-muted-foreground leading-relaxed">
							{t(`${key}.description`)}
						</p>
					</div>
					<div>
						<h2 className="font-normal text-2xl tracking-tight">
							{td("toolsTitle")}
						</h2>
						<div className="mt-4 flex flex-wrap gap-2">
							{Array.from({ length: service.toolCount }, (_, i) => (
								<span
									key={t(`${key}.tools.${i}`)}
									className="border border-border/40 px-3 py-1.5 font-light text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
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
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{td("painPointsTitle")}
					</h2>
				</div>
				<div className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
					{Array.from({ length: service.painPointCount }, (_, i) => (
						<div
							key={t(`${key}.painPoints.${i}.heading`)}
							className="border-border/40 border-t-2 border-t-brand p-6 md:p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-b-0"
						>
							<h3 className="font-medium text-base">
								{t(`${key}.painPoints.${i}.heading`)}
							</h3>
							<p className="mt-3 font-light text-muted-foreground text-sm leading-relaxed">
								{t(`${key}.painPoints.${i}.description`)}
							</p>
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="features" alternate>
				<h2 className="font-normal text-2xl tracking-tight">
					{td("featuresTitle")}
				</h2>
				<div className="mt-8 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2">
					{Array.from({ length: service.featureCount }, (_, i) => (
						<div
							key={t(`${key}.features.${i}`)}
							className="border-border/40 p-4 font-light text-sm [&:not(:last-child)]:border-b md:[&:nth-child(odd):not(:last-child)]:border-r"
						>
							{t(`${key}.features.${i}`)}
						</div>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="deliverables">
				<h2 className="font-normal text-2xl tracking-tight">
					{td("deliverablesTitle")}
				</h2>
				<div className="mt-8 max-w-2xl border border-border/40">
					{Array.from({ length: service.deliverableCount }, (_, i) => (
						<div
							key={t(`${key}.deliverables.${i}`)}
							className="flex gap-4 px-6 py-4 [&:not(:last-child)]:border-border/40 [&:not(:last-child)]:border-b"
						>
							<span className="text-brand/60 text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="font-light text-sm">
								{t(`${key}.deliverables.${i}`)}
							</span>
						</div>
					))}
				</div>
			</SectionWrapper>

			{slug === "wordpress-migration" && <WpHealthCta />}

			<SectionWrapper id="cta" alternate>
				<div className="max-w-xl">
					<h2 className="font-normal text-2xl tracking-tight">
						{td("ctaTitle")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{td("ctaDescription")}
					</p>
					<div className="mt-8 flex gap-3">
						<Button
							className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							render={<a href="/#contact" />}
						>
							{td("ctaButton")}
						</Button>
						{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
						<Button variant="outline" render={<a href="/#pricing" />}>
							{td("ctaPricingButton")}
						</Button>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
