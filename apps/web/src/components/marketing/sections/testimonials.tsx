import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";

const testimonialKeys = ["0", "1", "2", "3", "4", "5"];

export default async function Testimonials() {
	const t = await getTranslations("testimonials");

	return (
		<SectionWrapper id="testimonials">
			<div className="max-w-[640px]">
				<h2 className="font-display text-[28px] leading-[1.15] md:text-[40px]">
					{t("title")}
				</h2>
				<p className="mt-5 max-w-[520px] text-[15px] text-muted-foreground leading-[1.6]">
					{t("subtitle")}
				</p>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-3">
				{testimonialKeys.map((key) => (
					<div
						key={key}
						className="flex flex-col justify-between border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-nth-[3n]:border-r md:nth-[-n+3]:border-b md:not-last:border-b-0 md:p-10"
					>
						<div>
							<span className="block font-display text-5xl text-brand/30 leading-none select-none">
								&ldquo;
							</span>
							<p className="mt-3 text-muted-foreground text-sm leading-[1.65]">
								{t(`items.${key}.quote`)}
							</p>
						</div>
						<div className="mt-8 border-border/40 border-t pt-5">
							<p className="text-sm">{t(`items.${key}.author`)}</p>
							<p className="mt-0.5 font-mono text-muted-foreground text-xs">
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
