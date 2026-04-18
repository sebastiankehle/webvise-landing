import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../../index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	verification: {
		google: process.env.GOOGLE_VERIFICATION_CODE,
	},
	icons: {
		icon: { url: "/icon.svg", type: "image/svg+xml" },
		apple: "/apple-icon",
	},
	title: {
		default: "webvise - Design. Development. Automation.",
		template: "%s - webvise",
	},
	description:
		"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
	metadataBase: new URL("https://webvise.io"),
	openGraph: {
		type: "website",
		siteName: "webvise",
		title: "webvise - Design. Development. Automation.",
		description:
			"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "webvise - Design. Development. Automation.",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "webvise - Design. Development. Automation.",
		description:
			"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
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
	alternates: {
		canonical: "https://webvise.io",
		languages: {
			en: "https://webvise.io",
			de: "https://webvise.io/de",
			fr: "https://webvise.io/fr",
			es: "https://webvise.io/es",
			nl: "https://webvise.io/nl",
			pl: "https://webvise.io/pl",
			it: "https://webvise.io/it",
			"x-default": "https://webvise.io",
		},
	},
};

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
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-D5466MRK51"
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
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
			<body className={`${inter.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					forcedTheme="light"
					disableTransitionOnChange
				>
					<NextIntlClientProvider messages={messages}>
						<TooltipProvider>{children}</TooltipProvider>
					</NextIntlClientProvider>
					<Toaster richColors />
					<Analytics />
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	);
}
