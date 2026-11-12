import { getLocale, getTranslations } from "next-intl/server";

import { ArrowLink } from "@/components/marketing/action";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import WorkWall from "@/components/marketing/work-wall";
import { getCaseStudies } from "@/data/case-studies";

export default async function Work() {
	const [t, locale] = await Promise.all([
		getTranslations("caseStudies"),
		getLocale(),
	]);
	const featured = getCaseStudies(locale, { kind: "client" }).slice(0, 6);

	if (featured.length === 0) {
		return null;
	}

	return (
		<SectionWrapper hatch id="case-studies" surface="inverted">
			<SectionHeading
				action={<ArrowLink href="/case-studies">{t("viewAll")}</ArrowLink>}
				description={t("subtitle")}
				title={t("title")}
			/>
			{/* Six projects as a wall of their real first screens, two to a row */}
			<div className="mt-10 md:mt-16">
				<WorkWall projects={featured} />
			</div>
		</SectionWrapper>
	);
}
