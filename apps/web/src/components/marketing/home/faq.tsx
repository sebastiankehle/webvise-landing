import { getTranslations } from "next-intl/server";

import { ArrowLink } from "@/components/marketing/action";
import { FaqList } from "@/components/marketing/faq-list";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, Lead } from "@/components/ui/typography";

/** Keys into `faq.items`: timeline, price, code ownership, who does the
 * work, support after launch. */
const questionKeys = ["0", "2", "3", "5", "9", "7"] as const;

export default async function Faq() {
	const tf = await getTranslations("faq");

	return (
		<SectionWrapper id="faq" surface="alternate">
			<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
				<div className="lg:col-span-4">
					<div className="lg:sticky lg:top-28">
						<H2>{tf("title")}</H2>
						<Lead className="mt-4">{tf("subtitle")}</Lead>
						<ArrowLink className="mt-5" href="/faq">
							{tf("hub.linkAll")}
						</ArrowLink>
					</div>
				</div>
				<StaggerChildren className="lg:col-span-7 lg:col-start-6">
					<FaqList
						items={questionKeys.map((key) => ({
							question: tf(`items.${key}.question`),
							answer: tf(`items.${key}.answer`),
						}))}
					/>
				</StaggerChildren>
			</div>
		</SectionWrapper>
	);
}
