import { getTranslations } from "next-intl/server";

import FooterCtaBanner from "@/components/marketing/footer-cta-banner";
import { getCaseStudies } from "@/data/case-studies";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";

export default async function DefaultCta({ params }: { params: LocaleParams }) {
	const locale = await pinLocale(params);
	const t = await getTranslations("footer");
	// Six real project screens form the picture behind the message.
	const covers = getCaseStudies(locale)
		.flatMap((project) => (project.coverImage ? [project.coverImage] : []))
		.slice(0, 6);

	return (
		<FooterCtaBanner
			buttonText={t("ctaButton")}
			covers={covers}
			headline={t("ctaHeadline")}
			subtext={t("ctaSubtext")}
		/>
	);
}
