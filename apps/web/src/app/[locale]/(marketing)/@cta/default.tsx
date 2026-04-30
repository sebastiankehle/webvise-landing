import { getTranslations } from "next-intl/server";

import FooterCtaBanner from "@/components/marketing/footer-cta-banner";

export default async function DefaultCta() {
	const t = await getTranslations("footer");

	return (
		<FooterCtaBanner
			buttonText={t("ctaButton")}
			headline={t("ctaHeadline")}
			subtext={t("ctaSubtext")}
		/>
	);
}
