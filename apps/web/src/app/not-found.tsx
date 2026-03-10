import { Geist } from "next/font/google";
import { getTranslations } from "next-intl/server";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export default async function GlobalNotFound() {
	const t = await getTranslations("notFound");

	return (
		<html lang="en" className={geistSans.variable}>
			<body className="font-(family-name:--font-geist-sans) flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 antialiased">
				<p className="font-medium text-[#a3a3a3] text-sm uppercase tracking-wider">
					404
				</p>
				<h1 className="mt-4 font-normal text-4xl text-[#171717] tracking-tight md:text-5xl">
					{t("title")}
				</h1>
				<p className="mt-4 max-w-md text-center font-light text-[#737373] text-base">
					{t("description")}
				</p>
				<div className="mt-8 flex gap-3">
					<a
						href="/"
						className="inline-flex items-center justify-center border border-[#171717] bg-[#171717] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[#171717]/90"
					>
						{t("backHome")}
					</a>
					<a
						href="/#contact"
						className="inline-flex items-center justify-center border border-[#e5e5e5] bg-white px-4 py-2 font-medium text-[#171717] text-sm transition-colors hover:bg-[#f5f5f5]"
					>
						{t("contact")}
					</a>
				</div>
			</body>
		</html>
	);
}
