import NextLink from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { H1, Lead, Mono } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";

export default async function NotFound() {
	const [locale, t] = await Promise.all([
		getLocale(),
		getTranslations("notFound"),
	]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6">
			<Mono className="text-muted-foreground">404</Mono>
			<H1 className="mt-4">{t("title")}</H1>
			<Lead className="mt-4 max-w-md text-center">{t("description")}</Lead>
			<div className="mt-8 flex gap-3">
				<Button className="" render={<Link href="/" />}>
					{t("backHome")}
				</Button>
				<Button
					className=""
					render={
						<NextLink
							aria-label={t("contact")}
							href={homepageSectionHref("contact", locale)}
						/>
					}
					variant="outline"
				>
					{t("contact")}
				</Button>
			</div>
		</div>
	);
}
