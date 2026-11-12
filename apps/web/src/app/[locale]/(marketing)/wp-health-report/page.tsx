import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ActionArrow } from "@/components/marketing/action";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import WpHealthReport from "@/components/marketing/wp-health-report";
import { H2 } from "@/components/ui/typography";
import { getCaseStudyBySlug } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates } from "@/lib/seo";

const benefitKeys = ["0", "1", "2", "3"] as const;
/** Projects whose first metric is their Lighthouse performance score. */
const CLIENT_SCORES = [
	"old-world-labs",
	"finanzierungszertifikat",
	"maerkische-projekt-bau",
] as const;
// Lighthouse's own gauge: radius 56 in a 120 box, its pass green.
const RING = 2 * Math.PI * 56;
const LIGHTHOUSE_PASS = "#0cce6b";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("wpHealthReport"),
		getLocale(),
	]);
	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/wp-health-report", locale),
		openGraph: {
			title: t("meta.ogTitle"),
			description: t("meta.description"),
		},
	};
}

export default async function WpHealthReportPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [t, tm, locale] = await Promise.all([
		getTranslations("wpHealthReport"),
		getTranslations("metrics"),
		getLocale(),
	]);
	// Measured scores: this site and three client sites webvise built.
	const scores = [
		{
			name: "webvise.io",
			slug: "webvise",
			value: tm("results.items.lighthouse.value"),
		},
		...CLIENT_SCORES.flatMap((slug) => {
			const project = getCaseStudyBySlug(slug, locale);
			const metric = project?.metrics?.[0];
			return project && metric
				? [{ name: project.client, slug, value: metric.value }]
				: [];
		}),
	];

	return (
		<>
			<WpHealthReport />
			<SectionWrapper id="scores" surface="alternate">
				<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-center">
					<div className="lg:col-span-5">
						<H2>{t("scores.title")}</H2>
						<p className="mt-4 max-w-[46ch] text-lg text-muted-foreground leading-[1.6]">
							{t("preview.hint")}
						</p>
						<ul className="mt-8 border-foreground/[0.08] border-t">
							{benefitKeys.map((key) => (
								<li
									className="border-foreground/[0.08] border-b py-3 text-base text-foreground"
									key={key}
								>
									{t(`hero.benefits.${key}`)}
								</li>
							))}
						</ul>
					</div>
					<StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
						{scores.map((score) => (
							<Link
								className="surface-card group/arrow flex flex-col items-center gap-4 p-7 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={{
									pathname: "/case-studies/[slug]",
									params: { slug: score.slug },
								}}
								key={score.name}
							>
								<span className="relative grid size-32 place-items-center">
									<svg
										aria-hidden="true"
										className="absolute inset-0 size-full -rotate-90"
										viewBox="0 0 120 120"
									>
										<circle
											cx="60"
											cy="60"
											fill={LIGHTHOUSE_PASS}
											fillOpacity="0.1"
											r="56"
										/>
										<circle
											cx="60"
											cy="60"
											fill="none"
											r="56"
											stroke={LIGHTHOUSE_PASS}
											strokeDasharray={`${(RING * Number.parseFloat(score.value)) / 100} ${RING}`}
											strokeLinecap="round"
											strokeWidth="8"
										/>
									</svg>
									<span className="font-display text-4xl text-[#018642] tabular-nums leading-none tracking-[-0.03em] dark:text-[#0cce6b]">
										{score.value}
									</span>
								</span>
								<span>
									<span className="block font-medium text-base text-foreground">
										{score.name}
									</span>
									<span className="mt-1 inline-flex items-center gap-1.5 text-muted-foreground text-sm">
										{tm("results.items.lighthouse.label")}
										<ActionArrow />
									</span>
								</span>
							</Link>
						))}
					</StaggerChildren>
				</div>
			</SectionWrapper>
		</>
	);
}
