import { Hanken_Grotesk } from "next/font/google";
import { getTranslations } from "next-intl/server";
import Logo from "@/components/logo";
import { ActionArrow, actionVariants } from "@/components/marketing/action";
import { H1 } from "@/components/ui/typography";
import { routing } from "@/i18n/routing";
import "../index.css";

const hankenGrotesk = Hanken_Grotesk({
	variable: "--font-hanken-grotesk",
	subsets: ["latin"],
	// The locale layout preloads the same font for every page already.
	preload: false,
	weight: ["400", "500"],
});

/** The last resort: addresses outside every locale, such as /wp-login.php,
 * which the proxy never rewrites. Every other unknown address gets the 404
 * inside the site, from app/[locale]/(marketing)/not-found.tsx. */
export default async function GlobalNotFound() {
	// Next renders this fallback with every page, outside the locale layout.
	// Reading the request locale here would force every page to render on
	// demand, so it names its language itself, the one in its <html lang>.
	const t = await getTranslations({
		locale: routing.defaultLocale,
		namespace: "notFound",
	});

	return (
		<html className={hankenGrotesk.variable} lang={routing.defaultLocale}>
			<body>
				<div className="mx-auto flex min-h-screen max-w-[1320px] flex-col px-6">
					<a className="flex h-16 items-center self-start lg:h-[72px]" href="/">
						<Logo className="h-[17px] w-auto" />
					</a>
					<main className="flex flex-1 flex-col justify-center pb-24">
						<H1 className="max-w-[18ch]">{t("title")}</H1>
						<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
							{t("description")}
						</p>
						<div className="mt-10 flex flex-wrap gap-3">
							<a className={actionVariants()} href="/">
								{t("backHome")}
								<ActionArrow />
							</a>
							<a className={actionVariants({ variant: "quiet" })} href="/book">
								{t("contact")}
							</a>
						</div>
					</main>
				</div>
			</body>
		</html>
	);
}
