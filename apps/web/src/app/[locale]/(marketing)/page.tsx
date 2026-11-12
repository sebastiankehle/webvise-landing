import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import Bento from "@/components/marketing/home/bento";
import Closing from "@/components/marketing/home/closing";
import Faq from "@/components/marketing/home/faq";
import Hero from "@/components/marketing/home/hero";
import Journal from "@/components/marketing/home/journal";
import Process from "@/components/marketing/home/process";
import Safeguards from "@/components/marketing/home/safeguards";
import Services from "@/components/marketing/home/services";
import Systems from "@/components/marketing/home/systems";
import Voices from "@/components/marketing/home/voices";
import Work from "@/components/marketing/home/work";
import Comparison from "@/components/marketing/sections/comparison";
import Metrics from "@/components/marketing/sections/metrics";
import MidCta from "@/components/marketing/sections/mid-cta";
import ProblemStatement from "@/components/marketing/sections/problem-statement";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { localizedUrl } from "@/lib/seo";

export default async function HomePage({ params }: { params: LocaleParams }) {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("siteMetadata"),
		getLocale(),
	]);
	const url = localizedUrl("/", locale);
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": "https://www.webvise.io/#organization",
				name: "webvise",
				url: "https://www.webvise.io",
				description: t("organizationDescription"),
				sameAs: [
					"https://github.com/webvise",
					"https://linkedin.com/company/webvise",
				],
			},
			{
				"@type": "WebSite",
				"@id": "https://www.webvise.io/#website",
				url: "https://www.webvise.io",
				name: "webvise",
				publisher: { "@id": "https://www.webvise.io/#organization" },
				inLanguage: ["en", "de"],
			},
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: t("title"),
				isPartOf: { "@id": "https://www.webvise.io/#website" },
				about: { "@id": "https://www.webvise.io/#organization" },
				description: t("description"),
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<Hero />
			<ProblemStatement />
			<Work />
			<Metrics />
			<Services />
			<MidCta />
			<Process />
			<Comparison />
			<Voices />
			<Bento />
			<Systems />
			<WpHealthCta />
			<Journal />
			<Faq />
			<Safeguards />
			<Closing />
		</>
	);
}
