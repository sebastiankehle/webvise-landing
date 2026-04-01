import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../../index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
	variable: "--font-geist-sans",
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
	},
	twitter: {
		card: "summary_large_image",
		title: "webvise - Design. Development. Automation.",
		description:
			"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
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
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
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
