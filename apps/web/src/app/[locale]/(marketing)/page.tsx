import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import Benefits from "@/components/marketing/sections/benefits";
import BlogPreview from "@/components/marketing/sections/blog-preview";
import CaseStudiesPreview from "@/components/marketing/sections/case-studies-preview";
import Comparison from "@/components/marketing/sections/comparison";
import Contact from "@/components/marketing/sections/contact";
import CustomSystems from "@/components/marketing/sections/custom-systems";
import FAQ from "@/components/marketing/sections/faq";
import Hero from "@/components/marketing/sections/hero";
import Metrics from "@/components/marketing/sections/metrics";
import MidCta from "@/components/marketing/sections/mid-cta";
import Pricing from "@/components/marketing/sections/pricing";
import Process from "@/components/marketing/sections/process";
import ProjectSurfaces from "@/components/marketing/sections/project-surfaces";
import SeniorLed from "@/components/marketing/sections/senior-led";
import Services from "@/components/marketing/sections/services";
import Support from "@/components/marketing/sections/support";
import TechStack from "@/components/marketing/sections/tech-stack";
import Testimonials from "@/components/marketing/sections/testimonials";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";
import { localizedUrl } from "@/lib/seo";

export default async function HomePage() {
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
				"@id": "https://webvise.io/#organization",
				name: "webvise",
				url: "https://webvise.io",
				description: t("organizationDescription"),
				sameAs: [
					"https://github.com/webvise",
					"https://linkedin.com/company/webvise",
				],
			},
			{
				"@type": "WebSite",
				"@id": "https://webvise.io/#website",
				url: "https://webvise.io",
				name: "webvise",
				publisher: { "@id": "https://webvise.io/#organization" },
				inLanguage: ["en", "de", "fr", "es", "nl", "pl", "it"],
			},
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: t("title"),
				isPartOf: { "@id": "https://webvise.io/#website" },
				about: { "@id": "https://webvise.io/#organization" },
				description: t("description"),
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<Hero />
			<ProjectSurfaces />
			<Metrics />
			<CustomSystems />
			<Services />
			<SeniorLed />
			<TechStack />
			<Benefits />
			<MidCta />
			<Testimonials />
			<CaseStudiesPreview />
			<Process />
			<Comparison />
			<Pricing />
			<Support />
			<WpHealthCta />
			<BlogPreview />
			<FAQ />
			<Contact />
		</>
	);
}
