import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const testimonialKeys = ["0", "1", "2", "3", "4", "5"];

export default async function Testimonials() {
	const t = await getTranslations("testimonials");

	return (
		<SectionWrapper id="testimonials">
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<StaggerChildren
				className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3"
			>
				{testimonialKeys.map((key) => (
					<div
						key={key}
						className="flex flex-col justify-between border-border/40 p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:nth-child(3n))]:border-r md:[&:nth-child(-n+3)]:border-b"
					>
						<div>
							<span className="block font-serif text-3xl leading-none text-brand/40">
								&ldquo;
							</span>
							<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
								{t(`items.${key}.quote`)}
							</p>
						</div>
						<div className="mt-6">
							<p className="font-medium text-sm">{t(`items.${key}.author`)}</p>
							<p className="font-light text-muted-foreground text-xs">
								{t(`items.${key}.role`)}
								{t(`items.${key}.company`) && `, ${t(`items.${key}.company`)}`}
							</p>
						</div>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
