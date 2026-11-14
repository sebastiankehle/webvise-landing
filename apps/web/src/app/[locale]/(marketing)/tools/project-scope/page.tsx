import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import ProjectScopeEstimator, {
	BandMeter,
	type ServiceLink,
} from "@/components/marketing/project-scope-estimator";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, H3 } from "@/components/ui/typography";
import { getOfferingBySlug } from "@/data/offerings";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { offeringTagline, offeringTitle } from "@/lib/offering-content";
import { BANDS, PROJECT_TYPES, type ProjectType } from "@/lib/project-scope";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const PATH = "/tools/project-scope";
const factorKeys = ["0", "1", "2", "3"] as const;

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	const locale = await pinLocale(params);
	const t = await getTranslations("projectScope");
	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates(PATH, locale),
		openGraph: {
			title: t("meta.ogTitle"),
			description: t("meta.description"),
		},
	};
}

export default async function ProjectScopePage({
	params,
}: {
	params: LocaleParams;
}) {
	const locale = await pinLocale(params);
	const [t, ts, tc, messages] = await Promise.all([
		getTranslations("projectScope"),
		getTranslations("services"),
		getTranslations("customSystems"),
		getMessages(),
	]);

	// Each project type's service page, named in this locale.
	const services: Partial<Record<ProjectType, ServiceLink>> = {};
	for (const [type, { slug }] of Object.entries(PROJECT_TYPES)) {
		const offering = slug ? getOfferingBySlug(slug) : undefined;
		if (offering) {
			services[type as ProjectType] = {
				slug: offering.slug,
				tagline: offeringTagline(offering, ts, tc),
				title: offeringTitle(offering, ts, tc),
				url: localizedUrl(`/services/${offering.slug}`, locale),
			};
		}
	}

	return (
		<>
			{/* The layout sends the browser only a fixed list of namespaces; the
			    estimator gets its own. */}
			<NextIntlClientProvider
				messages={{ projectScope: messages.projectScope }}
			>
				<ProjectScopeEstimator
					services={services}
					servicesUrl={localizedUrl("/services", locale)}
					toolUrl={localizedUrl(PATH, locale)}
				/>
			</NextIntlClientProvider>
			<SectionWrapper id="no-price" surface="alternate">
				<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-center">
					<div className="lg:col-span-5">
						<H2>{t("about.title")}</H2>
						<p className="mt-4 max-w-[46ch] text-lg text-muted-foreground leading-[1.6]">
							{t("about.text")}
						</p>
						<ul className="mt-8 border-foreground/[0.08] border-t">
							{factorKeys.map((key) => (
								<li
									className="border-foreground/[0.08] border-b py-3 text-base text-foreground"
									key={key}
								>
									{t(`about.factors.${key}`)}
								</li>
							))}
						</ul>
					</div>
					<StaggerChildren className="grid gap-5 lg:col-span-6 lg:col-start-7">
						{BANDS.map((band, i) => (
							<div className="surface-card p-7" key={band}>
								<div className="max-w-40">
									<BandMeter level={i} />
								</div>
								<H3 className="mt-5 text-xl">{t(`bands.${band}.title`)}</H3>
								<p className="mt-2 text-base text-muted-foreground leading-[1.6]">
									{t(`bands.${band}.description`)}
								</p>
							</div>
						))}
					</StaggerChildren>
				</div>
			</SectionWrapper>
		</>
	);
}
