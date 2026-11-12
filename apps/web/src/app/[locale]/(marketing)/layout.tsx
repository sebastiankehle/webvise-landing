import { getTranslations } from "next-intl/server";
import ChatWidgetMount from "@/components/marketing/chat-widget-mount";
import Footer from "@/components/marketing/footer";
import HashLinkScrollManager from "@/components/marketing/hash-link-scroll-manager";
import Navbar from "@/components/marketing/navbar";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";

export default async function MarketingLayout({
	children,
	cta,
	params,
}: {
	children: React.ReactNode;
	cta: React.ReactNode;
	params: LocaleParams;
}) {
	await pinLocale(params);
	const t = await getTranslations("nav");

	return (
		<>
			<a
				className="sr-only fixed top-4 left-4 z-100 rounded-sm bg-primary px-4 py-2 font-medium text-primary-foreground text-sm focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
				href="#main-content"
			>
				{t("aria.skip")}
			</a>
			{/* Without script nothing reveals on scroll, so nothing may start hidden. */}
			<noscript>
				<style>{".stagger-hidden > * { opacity: 1; transform: none; }"}</style>
			</noscript>
			<Navbar />
			<HashLinkScrollManager />
			<main className="border-grid-line border-x" id="main-content">
				{children}
			</main>
			<Footer ctaBanner={cta} />
			<ChatWidgetMount />
		</>
	);
}
