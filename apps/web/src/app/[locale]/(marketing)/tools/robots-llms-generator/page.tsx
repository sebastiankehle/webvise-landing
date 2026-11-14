import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ArrowLink } from "@/components/marketing/action";
import RobotsLlmsGenerator from "@/components/marketing/robots-llms-generator";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2, H3 } from "@/components/ui/typography";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates } from "@/lib/seo";

const guideKeys = ["0", "1", "2"] as const;

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("robotsLlmsGenerator"),
		getLocale(),
	]);
	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/tools/robots-llms-generator", locale),
		openGraph: {
			title: t("meta.ogTitle"),
			description: t("meta.description"),
		},
	};
}

export default async function RobotsLlmsGeneratorPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const [t, messages] = await Promise.all([
		getTranslations("robotsLlmsGenerator"),
		getMessages(),
	]);

	return (
		<>
			{/* The root layout sends only a fixed list of namespaces to the
			    browser; this page sends its own. */}
			<NextIntlClientProvider
				messages={{ robotsLlmsGenerator: messages.robotsLlmsGenerator }}
			>
				<RobotsLlmsGenerator />
			</NextIntlClientProvider>
			<SectionWrapper id="guide">
				<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<H2>{t("guide.title")}</H2>
						<p className="mt-4 max-w-[46ch] text-lg text-muted-foreground leading-[1.6]">
							{t("guide.subtitle")}
						</p>
						<ArrowLink
							className="mt-8"
							href={{
								pathname: "/services/[slug]",
								params: { slug: "seo-geo" },
							}}
						>
							{t("guide.cta")}
						</ArrowLink>
					</div>
					<ul className="border-foreground/[0.08] border-t lg:col-span-6 lg:col-start-7">
						{guideKeys.map((key) => (
							<li className="border-foreground/[0.08] border-b py-5" key={key}>
								<H3 className="text-xl">{t(`guide.items.${key}.title`)}</H3>
								<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
									{t(`guide.items.${key}.description`)}
								</p>
							</li>
						))}
					</ul>
				</div>
			</SectionWrapper>
		</>
	);
}
