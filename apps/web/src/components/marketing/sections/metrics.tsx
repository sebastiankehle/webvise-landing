import { getLocale, getTranslations } from "next-intl/server";

import ResultsTiles, {
	type ResultKind,
} from "@/components/marketing/home/scenes/results-tiles";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2 } from "@/components/ui/typography";
import { getCaseStudies, getCaseStudyBySlug } from "@/data/case-studies";

const stepKeys = ["0", "1", "2"] as const;

const kinds: ResultKind[] = [
	"lighthouse",
	"weeks",
	"projects",
	"raised",
	"users",
];

/** What the work has added up to: five figures, each with a detailed picture
 * of what it counts. */
export default async function Metrics() {
	const [t, ts, locale] = await Promise.all([
		getTranslations("metrics"),
		getTranslations("home.safeguards"),
		getLocale(),
	]);
	// The three-week story is told with a site that took three weeks.
	const launched = getCaseStudyBySlug("maerkische-projekt-bau", locale);
	const launch = {
		host: launched?.liveUrl
			? new URL(launched.liveUrl).hostname.replace("www.", "")
			: "",
		src: launched?.images?.[3] ?? launched?.coverImage ?? "",
	};
	// Six real client projects stand for the count in the projects tile.
	const thumbs = getCaseStudies(locale, { kind: "client" })
		.slice(0, 6)
		.flatMap((project) => {
			const src = project.cardImage ?? project.coverImage;
			return src ? [{ alt: project.client, src }] : [];
		});

	return (
		<SectionWrapper hatch id="metrics" surface="inverted">
			<H2 className="max-w-[640px]">{t("results.title")}</H2>
			<ResultsTiles
				items={kinds.map((kind) => ({
					kind,
					// The Lighthouse figure is the desktop run, and says so.
					label:
						kind === "lighthouse"
							? t("results.items.lighthouse.deviceLabel")
							: t(`results.items.${kind}.label`),
					value: t(`results.items.${kind}.value`),
				}))}
				launch={launch}
				steps={stepKeys.map((key) => t(`results.steps.${key}`))}
				thumbs={thumbs}
				week={ts("pictures.week")}
			/>
		</SectionWrapper>
	);
}
