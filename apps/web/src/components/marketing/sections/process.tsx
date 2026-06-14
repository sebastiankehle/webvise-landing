import { getTranslations } from "next-intl/server";

import ProcessSteps from "@/components/marketing/process-steps";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2, Lead } from "@/components/ui/typography";

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
		number: `${i + 1}.0`,
		title: t(`steps.${key}.title`),
		description: t(`steps.${key}.description`),
	}));

	return (
		<SectionWrapper hideOnMobile id="process">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<ProcessSteps steps={steps} />
		</SectionWrapper>
	);
}
