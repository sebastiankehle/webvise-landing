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
	const host = launched?.liveUrl
		? new URL(launched.liveUrl).hostname.replace("www.", "")
		: "";
	// Monday to Friday in the page's language; 1 Jan 2024 was a Monday.
	const weekday = new Intl.DateTimeFormat(locale, {
		timeZone: "UTC",
		weekday: "short",
	});
	const days = [1, 2, 3, 4, 5].map((day) =>
		weekday.format(new Date(Date.UTC(2024, 0, day)))
	);
	// The client sites that are live stand for the count, as tabs in a browser.
	const projects = getCaseStudies(locale, { kind: "client" })
		.filter((project) => project.liveUrl && project.slug !== "webvise")
		.slice(0, 5)
		.flatMap((project) => {
			const src = project.coverImage ?? project.cardImage;
			return project.liveUrl && src
				? [
						{
							host: new URL(project.liveUrl).hostname.replace("www.", ""),
							name: project.client,
							src,
						},
					]
				: [];
		});

	return (
		<SectionWrapper hatch id="metrics" surface="inverted">
			<H2 className="max-w-[640px]">{t("results.title")}</H2>
			<ResultsTiles
				days={days}
				host={host}
				items={kinds.map((kind) => ({
					kind,
					// The Lighthouse figure is the desktop run, and says so.
					label:
						kind === "lighthouse"
							? t("results.items.lighthouse.deviceLabel")
							: t(`results.items.${kind}.label`),
					value: t(`results.items.${kind}.value`),
				}))}
				projects={projects}
				steps={stepKeys.map((key) => t(`results.steps.${key}`))}
				week={ts("pictures.week")}
			/>
		</SectionWrapper>
	);
}
