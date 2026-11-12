import { getTranslations } from "next-intl/server";

import SystemsBeam from "@/components/marketing/home/scenes/systems-beam";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";

/** The systems a client already runs, wired into the one webvise builds. */
export default async function Systems() {
	const t = await getTranslations("home.systems");

	return (
		<SectionWrapper id="systems" surface="alternate">
			<SectionHeading description={t("description")} title={t("title")} />
			<div className="relative mt-10 aspect-square overflow-hidden rounded-[20px] bg-[#0b0e12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:aspect-[2/1] md:mt-14 lg:aspect-[3/1]">
				<SystemsBeam internal={t("internal")} />
			</div>
		</SectionWrapper>
	);
}
