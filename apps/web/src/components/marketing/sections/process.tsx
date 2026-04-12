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
			<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
				<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
					{t("title")}
				</h2>
				<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
					{t("subtitle")}
				</p>
			</div>
			<ProcessSteps steps={steps} />
		</SectionWrapper>
	);
}
