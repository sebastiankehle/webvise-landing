import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import WpHealthReport from "@/components/marketing/wp-health-report";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
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

export default function WpHealthReportPage() {
	return <WpHealthReport />;
}
