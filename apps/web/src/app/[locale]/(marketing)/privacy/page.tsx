import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { getLegalPage } from "@/data/legal";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	return {
		title: page?.title ?? "Privacy Policy",
		description: page?.subtitle,
		alternates: generateAlternates("/privacy", locale),
	};
}

export default async function PrivacyPage() {
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	if (!page) {
		notFound();
	}
	const tt = await getTranslations("trust.blogBanner");

	return <LegalPageShell page={page} trustText={tt("text")} />;
}
