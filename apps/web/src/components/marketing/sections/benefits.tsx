import { Clock, Rocket, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";

const benefitKeys = [
	{ key: "speed", icon: Clock },
	{ key: "futureProof", icon: Rocket },
	{ key: "performance", icon: Zap },
];

export default async function Benefits() {
	const t = await getTranslations("benefits");

	return (
		<SectionWrapper id="benefits">
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{benefitKeys.map(({ key, icon: Icon }) => (
					<div
						key={key}
						className="border-border/40 p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-b-0"
					>
						<Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
						<h3 className="mt-4 font-medium text-lg">{t(`${key}.title`)}</h3>
						<p className="mt-2 font-light text-muted-foreground leading-relaxed">
							{t(`${key}.description`)}
						</p>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
