import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ArrowLink } from "@/components/marketing/action";
import AiVisibilityCheck from "@/components/marketing/ai-visibility-check";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2 } from "@/components/ui/typography";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates } from "@/lib/seo";

const pointKeys = ["0", "1", "2", "3"] as const;

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("aiVisibilityCheck"),
		getLocale(),
	]);
	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/tools/ai-visibility-check", locale),
		openGraph: {
			title: t("meta.ogTitle"),
			description: t("meta.description"),
		},
	};
}

export default async function AiVisibilityCheckPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [t, messages] = await Promise.all([
		getTranslations("aiVisibilityCheck"),
		getMessages(),
	]);

	return (
		<>
			{/* Only this tool's copy goes to the client, not the whole site's. */}
			<NextIntlClientProvider
				messages={{ aiVisibilityCheck: messages.aiVisibilityCheck }}
			>
				<AiVisibilityCheck />
			</NextIntlClientProvider>
			<SectionWrapper id="why-ai-answers" surface="alternate">
				<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-start">
					<div className="lg:col-span-5">
						<H2>{t("explainer.title")}</H2>
						<p className="mt-4 max-w-[46ch] text-lg text-muted-foreground leading-[1.6]">
							{t("explainer.text")}
						</p>
					</div>
					<div className="lg:col-span-6 lg:col-start-7">
						<ul className="border-foreground/[0.08] border-t">
							{pointKeys.map((key) => (
								<li
									className="border-foreground/[0.08] border-b py-3 text-base text-foreground"
									key={key}
								>
									{t(`explainer.points.${key}`)}
								</li>
							))}
						</ul>
						<ArrowLink
							className="mt-6"
							href={{
								pathname: "/services/[slug]",
								params: { slug: "seo-geo" },
							}}
						>
							{t("results.geoCta")}
						</ArrowLink>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
