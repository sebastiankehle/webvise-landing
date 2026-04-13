import { getTranslations } from "next-intl/server";

import { H2 } from "@/components/ui/typography";

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<section className="py-20 md:py-36">
			<div className="mx-auto max-w-[1320px] px-6">
				<H2 className="max-w-[960px] text-[36px] leading-[1.3]">
					<span className="text-foreground">{t("known")}</span>{" "}
					<span className="text-muted-foreground">{t("pain")}</span>
				</H2>
			</div>
		</section>
	);
}
