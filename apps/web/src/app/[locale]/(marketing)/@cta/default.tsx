import { getTranslations } from "next-intl/server";

import FooterCtaBanner, {
	bannerCovers,
} from "@/components/marketing/footer-cta-banner";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";

export default async function DefaultCta({ params }: { params: LocaleParams }) {
	const locale = await pinLocale(params);
	const t = await getTranslations("footer");
	return (
		<FooterCtaBanner
			buttonText={t("ctaButton")}
			covers={bannerCovers(locale)}
			headline={t("ctaHeadline")}
			subtext={t("ctaSubtext")}
		/>
	);
}
