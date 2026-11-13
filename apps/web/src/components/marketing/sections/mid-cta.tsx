import { getLocale, getTranslations } from "next-intl/server";

import {
	bannerCovers,
	CtaBanner,
} from "@/components/marketing/footer-cta-banner";
import SectionWrapper from "@/components/marketing/section-wrapper";

/** The banner that closes every inner page, set halfway down the homepage.
 * Its button leads to the form at the end of this page. */
export default async function MidCta() {
	const [locale, t] = await Promise.all([
		getLocale(),
		getTranslations("midCta"),
	]);

	return (
		<SectionWrapper className="py-14 md:py-20" id="mid-cta">
			<CtaBanner
				buttonText={t("cta")}
				covers={bannerCovers(locale)}
				headline={t.rich("title", {
					brand: (chunks) => (
						<span className="text-brand-readable">{chunks}</span>
					),
					// Each sentence starts its own line, on a phone too, so no
					// line ends in the middle of the next sentence
					br: () => <br />,
				})}
				href={{ pathname: "/", hash: "contact" }}
				location="mid-cta"
				subtext={t("subtitle")}
			/>
		</SectionWrapper>
	);
}
