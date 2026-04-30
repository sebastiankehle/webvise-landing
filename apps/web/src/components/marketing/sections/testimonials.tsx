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
			<StaggerChildren className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-2 lg:grid-cols-3">
				{testimonialKeys.map((key) => (
					<div
						className="flex flex-col justify-between border-grid-line border-b p-6 md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
						key={key}
					>
						<div>
							<QuoteMark className="block" />
							<Muted className="mt-3 leading-[1.65]">
								{t(`items.${key}.quote`)}
							</Muted>
						</div>
						<div className="mt-8">
							<Body className="text-sm">{t(`items.${key}.author`)}</Body>
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
