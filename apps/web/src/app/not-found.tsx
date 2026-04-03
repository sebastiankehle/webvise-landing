import { Geist } from "next/font/google";
import { getTranslations } from "next-intl/server";
import "../index.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export default async function GlobalNotFound() {
	const t = await getTranslations("notFound");

	return (
		<html lang="en" className={geistSans.variable}>
			<body className="flex min-h-screen flex-col items-center justify-center bg-background px-6 font-sans antialiased">
				<p className="font-medium text-muted-foreground/50 text-sm">
					404
				</p>
				<h1 className="mt-4 font-normal text-4xl tracking-tight md:text-5xl">
					{t("title")}
				</h1>
				<p className="mt-4 max-w-md text-center font-light text-muted-foreground">
					{t("description")}
				</p>
				<div className="mt-8 flex gap-3">
					<a
						href="/"
						className="inline-flex items-center justify-center border border-foreground bg-foreground px-4 py-2 font-medium text-background text-sm transition-colors hover:bg-foreground/90"
					>
						{t("backHome")}
					</a>
					<a
						href="/#contact"
						className="inline-flex items-center justify-center border border-border bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
					>
						{t("contact")}
					</a>
				</div>
			</body>
		</html>
	);
}
