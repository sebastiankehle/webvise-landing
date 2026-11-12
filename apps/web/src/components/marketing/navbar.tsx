import { getLocale, getTranslations } from "next-intl/server";

import NavbarShell, {
	type NavbarServiceGroup,
} from "@/components/marketing/navbar-shell";
import { getCaseStudies, getCaseStudyBySlug } from "@/data/case-studies";
import { industries } from "@/data/industries";
import { getOfferingTranslationKey, offeringGroups } from "@/data/offerings";

export default async function Navbar() {
	const [locale, t, ts, tc, ti] = await Promise.all([
		getLocale(),
		getTranslations("nav"),
		getTranslations("services"),
		getTranslations("customSystems"),
		getTranslations("industries"),
	]);

	const groups: NavbarServiceGroup[] = offeringGroups.map((group) => ({
		key: group.key,
		// Each group's scene, as the picture it ends on
		image:
			group.key === "launch"
				? `/images/home/services/menu-launch-${locale === "de" ? "de" : "en"}.webp`
				: `/images/home/services/menu-${group.key}.webp`,
		title: ts(`groups.${group.key}.title`),
		line: ts(`groups.${group.key}.line`),
		items: group.items.map((item) => {
			const key = getOfferingTranslationKey(item);
			return {
				slug: item.slug,
				title:
					item.kind === "service"
						? ts(`${key}.title`)
						: tc(`items.${key}.title`),
			};
		}),
	}));

	// Client work first, then the studies built in-house: the menu reaches all.
	const projects = [
		...getCaseStudies(locale, { kind: "client" }),
		...getCaseStudies(locale, { kind: "concept" }),
	].map((project) => ({
		client: project.client,
		image: project.cardImage ?? project.coverImage,
		industry: project.industry,
		slug: project.slug,
	}));

	return (
		<NavbarShell
			groups={groups}
			industries={industries.map((industry) => {
				const proof = getCaseStudyBySlug(industry.proof[0], locale);
				return {
					image: proof?.cardImage ?? proof?.coverImage,
					line: ti(`items.${industry.slug}.title`),
					name: ti(`items.${industry.slug}.name`),
					slug: industry.slug,
				};
			})}
			labels={{
				about: t("about"),
				blog: t("blog"),
				bookCall: t("bookCall"),
				closeMenu: t("aria.closeMenu"),
				home: t("aria.home"),
				industries: ti("label"),
				menuPrompt: t("menuPrompt"),
				menuPromptCta: t("menuPromptCta"),
				menuAll: t("menuAll"),
				menuAllIndustries: t("menuAllIndustries"),
				menuAllWork: t("menuAllWork"),
				menuMoreWork: t("menuMoreWork"),
				main: t("aria.main"),
				mobile: t("aria.mobile"),
				openMenu: t("aria.openMenu"),
				services: t("services"),
				work: t("caseStudies"),
			}}
			projects={projects}
		/>
	);
}
