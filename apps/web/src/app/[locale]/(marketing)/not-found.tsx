import { getTranslations } from "next-intl/server";

import { ActionLink } from "@/components/marketing/action";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1 } from "@/components/ui/typography";

export default async function NotFound() {
	const t = await getTranslations("notFound");

	return (
		<section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
			<ConstructedGrid variant="page" />
			<GridContainer>
				<H1 className="max-w-[18ch]">{t("title")}</H1>
				<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
					{t("description")}
				</p>
				<div className="mt-10 flex flex-wrap gap-3">
					<ActionLink arrow href="/" location="not_found">
						{t("backHome")}
					</ActionLink>
					<ActionLink href="/book" location="not_found" variant="quiet">
						{t("contact")}
					</ActionLink>
				</div>
			</GridContainer>
		</section>
	);
}
