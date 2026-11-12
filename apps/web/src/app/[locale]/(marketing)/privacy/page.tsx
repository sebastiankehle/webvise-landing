import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { getLegalPage } from "@/data/legal";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	return {
		title: page?.title ?? "Privacy Policy",
		description: page?.subtitle,
		alternates: generateAlternates("/privacy", locale),
		openGraph: {
			title: page?.title,
			description: page?.subtitle,
			siteName: "webvise",
			url: localizedUrl("/privacy", locale),
		},
	};
}

export default async function PrivacyPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	if (!page) {
		notFound();
	}
	const tt = await getTranslations("trust.blogBanner");

	return <LegalPageShell page={page} trustText={tt("text")} />;
}
