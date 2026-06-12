import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	Body,
	Caption,
	H2,
	Lead,
	Muted,
	QuoteMark,
} from "@/components/ui/typography";

const testimonialKeys = ["0", "1", "2", "3", "4", "5"];

export default async function Testimonials() {
	const t = await getTranslations("testimonials");

	return (
		<SectionWrapper hatch id="testimonials">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
				{testimonialKeys.map((key, index) => (
					<div
						className={`surface-card flex flex-col justify-between p-6 md:p-7 ${index > 2 ? "max-md:hidden" : ""}`}
						key={key}
					>
						<div>
							<QuoteMark className="block" />
							<Muted className="mt-3 text-sm leading-6">
								{t(`items.${key}.quote`)}
							</Muted>
						</div>
						<div className="mt-8">
							<Body className="text-sm leading-6">
								{t(`items.${key}.author`)}
							</Body>
							<Caption className="mt-0.5 block">
								{t(`items.${key}.role`)}
								{t(`items.${key}.company`) && `, ${t(`items.${key}.company`)}`}
							</Caption>
						</div>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
