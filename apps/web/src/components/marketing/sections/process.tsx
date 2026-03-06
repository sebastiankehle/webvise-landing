import { getTranslations } from "next-intl/server";

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

	return (
		<SectionWrapper id="process" alternate>
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-5">
				{stepKeys.map((key, i) => (
					<div
						key={key}
						className="border-border/40 p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-b-0"
					>
						<span className="font-medium text-muted-foreground/50 text-xs">
							{String(i + 1).padStart(2, "0")}
						</span>
						<h3 className="mt-2 font-medium text-base">
							{t(`steps.${key}.title`)}
						</h3>
						<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
							{t(`steps.${key}.description`)}
						</p>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
