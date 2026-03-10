import Script from "next/script";

import Benefits from "@/components/marketing/sections/benefits";
import BlogPreview from "@/components/marketing/sections/blog-preview";
import Contact from "@/components/marketing/sections/contact";
import FAQ from "@/components/marketing/sections/faq";
import Hero from "@/components/marketing/sections/hero";
import Metrics from "@/components/marketing/sections/metrics";
import Pricing from "@/components/marketing/sections/pricing";
import Process from "@/components/marketing/sections/process";
import Services from "@/components/marketing/sections/services";
import TechStack from "@/components/marketing/sections/tech-stack";
import Testimonials from "@/components/marketing/sections/testimonials";
import WpHealthCta from "@/components/marketing/sections/wp-health-cta";

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": "https://webvise.io/#organization",
			name: "webvise",
			url: "https://webvise.io",
			description:
				"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
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
			"@id": "https://webvise.io/#webpage",
			url: "https://webvise.io",
			name: "webvise - Design. Development. Automation.",
			isPartOf: { "@id": "https://webvise.io/#website" },
			about: { "@id": "https://webvise.io/#organization" },
			description:
				"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
		},
	],
};

export default function HomePage() {
	return (
		<>
			<Script
				id="json-ld"
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <static JSON-LD from hardcoded content>
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				strategy="afterInteractive"
			/>
			<Hero />
			<TechStack />
			<Benefits />
			<WpHealthCta />
			<Metrics />
			<Services />
			<Process />
			<Testimonials />
			<BlogPreview />
			<Pricing />
			<Contact />
			<FAQ />
		</>
	);
}
