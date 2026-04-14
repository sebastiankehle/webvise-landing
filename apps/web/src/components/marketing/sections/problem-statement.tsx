import { getTranslations } from "next-intl/server";

import { DisplayH2 } from "@/components/ui/typography";

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<section className="py-28 md:py-44">
			<div className="mx-auto max-w-[1320px] px-6">
				<DisplayH2 className="max-w-[840px]">
					<span className="text-foreground">{t("known")}</span>{" "}
					<span className="text-muted-foreground">{t("pain")}</span>
				</DisplayH2>
			</div>
		</section>
	);
}
