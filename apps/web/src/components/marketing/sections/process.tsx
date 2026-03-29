import { getTranslations } from "next-intl/server";

import ProcessSteps from "@/components/marketing/process-steps";
import SectionWrapper from "@/components/marketing/section-wrapper";

const stepKeys = [
	"discovery",
	"planning",
	"execution",
	"optimization",
	"launch",
];

export default async function Process() {
	const t = await getTranslations("process");

	const steps = stepKeys.map((key, i) => ({
		number: String(i + 1).padStart(2, "0"),
		title: t(`steps.${key}.title`),
		description: t(`steps.${key}.description`),
	}));

	return (
		<SectionWrapper id="process" alternate>
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
			</div>
			<ProcessSteps steps={steps} />
		</SectionWrapper>
	);
}
