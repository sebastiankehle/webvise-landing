import { getTranslations } from "next-intl/server";

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<section className="py-20 md:py-36">
			<div className="mx-auto max-w-[1320px] px-6">
				<p className="max-w-[960px] font-display text-[28px] leading-[1.3] md:text-[36px]">
					<span className="text-foreground">{t("known")}</span>{" "}
					<span className="text-muted-foreground">{t("pain")}</span>
				</p>
			</div>
		</section>
	);
}
