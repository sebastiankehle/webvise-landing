import { Geist_Mono, Inter } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { H1, Lead, Mono } from "@/components/ui/typography";
import "../index.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default async function GlobalNotFound() {
	const t = await getTranslations("notFound");

	return (
		<html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
			<body className="flex min-h-screen flex-col items-center justify-center bg-background px-6 font-sans antialiased">
				<Mono className="text-muted-foreground/50">404</Mono>
				<H1 className="mt-4">{t("title")}</H1>
				<Lead className="mt-4 max-w-md text-center font-light">
					{t("description")}
				</Lead>
				<div className="mt-8 flex gap-3">
					<a
						href="/"
						className="inline-flex items-center justify-center border border-foreground bg-foreground px-4 py-2 font-sans text-background text-sm transition-colors hover:bg-foreground/90"
					>
						{t("backHome")}
					</a>
					<a
						href="/#contact"
						className="inline-flex items-center justify-center border border-border bg-background px-4 py-2 font-sans text-foreground text-sm transition-colors hover:bg-muted"
					>
						{t("contact")}
					</a>
				</div>
			</body>
		</html>
	);
}
