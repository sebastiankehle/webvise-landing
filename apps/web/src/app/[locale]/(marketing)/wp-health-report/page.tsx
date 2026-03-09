import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import WpHealthReport from "@/components/marketing/wp-health-report";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("wpHealthReport");
	return {
		title: t("meta.title"),
		description: t("meta.description"),
		openGraph: {
			title: t("meta.ogTitle"),
			description: t("meta.description"),
		},
	};
}

export default function WpHealthReportPage() {
	return <WpHealthReport />;
}
