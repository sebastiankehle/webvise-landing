import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale,
} from "next-intl/server";
import "../../index.css";
import { ConsentBanner } from "@/components/marketing/consent-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { generateAlternates, localizedUrl, SITE_URL } from "@/lib/seo";
import { SITE_THEME_IDS } from "@/lib/themes";

const CLIENT_MESSAGE_NAMESPACES = [
	"becomePartner",
	"blog",
	"book",
	"caseStudies",
	"chatWidget",
	"consent",
	"contact",
	"customSystems",
	"faq",
	"media",
	"nav",
	"reportDownload",
	"services",
	"themeSwitcher",
	"wpHealthReport",
] as const;

function pickClientMessages(messages: Record<string, unknown>) {
	return Object.fromEntries(
		CLIENT_MESSAGE_NAMESPACES.flatMap((namespace) => {
			const value = messages[namespace];
			return value === undefined ? [] : [[namespace, value]];
		})
	);
}

const hankenGrotesk = Hanken_Grotesk({
	variable: "--font-hanken-grotesk",
	subsets: ["latin"],
	weight: ["400", "500"],
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale: requestedLocale } = await params;
	const locale = hasLocale(routing.locales, requestedLocale)
		? requestedLocale
		: routing.defaultLocale;
	const t = await getTranslations({ locale, namespace: "siteMetadata" });
	const title = t("title");
	const description = t("description");

	return {
		verification: {
			google: process.env.GOOGLE_VERIFICATION_CODE,
		},
		icons: {
			icon: { url: "/icon.svg", type: "image/svg+xml" },
			apple: "/apple-icon",
		},
		title: {
			default: title,
			template: "%s - webvise",
		},
		description,
		metadataBase: new URL(SITE_URL),
		openGraph: {
			type: "website",
			siteName: "webvise",
			title,
			description,
			url: localizedUrl("/", locale),
			images: [
				{
					url: "/opengraph-image",
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/twitter-image"],
		},
		formatDetection: {
			telephone: false,
			address: false,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: generateAlternates("/", locale),
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = pickClientMessages(await getMessages());

	return (
		<html data-scroll-behavior="smooth" lang={locale} suppressHydrationWarning>
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-D5466MRK51"
					strategy="lazyOnload"
				/>
				<Script id="gtag-init" strategy="lazyOnload">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('consent', 'default', {
							analytics_storage: 'denied',
							ad_storage: 'denied',
							ad_user_data: 'denied',
							ad_personalization: 'denied',
						});
						gtag('js', new Date());
						gtag('config', 'G-D5466MRK51');
					`}
				</Script>
			</head>
			<body
				className={`${hankenGrotesk.variable} ${GeistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
					enableColorScheme={false}
					themes={SITE_THEME_IDS}
				>
					<NextIntlClientProvider messages={messages}>
						<TooltipProvider>{children}</TooltipProvider>
						<ConsentBanner />
					</NextIntlClientProvider>
					<Toaster richColors />
					<Analytics />
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	);
}
