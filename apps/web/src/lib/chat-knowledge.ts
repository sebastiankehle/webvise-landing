import { getCaseStudies } from "@/data/case-studies";
import { industries } from "@/data/industries";
import { getOfferingTranslationKey, offeringGroups } from "@/data/offerings";
import de from "@/messages/de.json";
import en from "@/messages/en.json";

type Tree = Record<string, unknown>;

function read(tree: unknown, path: string): unknown {
	let node = tree;
	for (const key of path.split(".")) {
		node = (node as Tree | undefined)?.[key];
	}
	return node;
}

function text(tree: unknown, path: string): string {
	const value = read(tree, path);
	return typeof value === "string" ? value : "";
}

function entries<T>(tree: unknown, path: string): T[] {
	return Object.values((read(tree, path) as Tree | undefined) ?? {}) as T[];
}

function services(): string {
	return offeringGroups
		.map((group) => {
			const head = `### ${text(en, `services.groups.${group.key}.title`)}: ${text(en, `services.groups.${group.key}.description`)}`;
			const rows = group.items.map((offering) => {
				const key = getOfferingTranslationKey(offering);
				const base =
					offering.kind === "service"
						? `services.${key}`
						: `customSystems.items.${key}`;
				return `- ${text(en, `${base}.title`)} (German: ${text(de, `${base}.title`)}), /services/${offering.slug}: ${text(en, `${base}.description`)}`;
			});
			return [head, ...rows].join("\n");
		})
		.join("\n\n");
}

function projects(): string {
	return getCaseStudies("en")
		.map((study) => {
			let kind = `Client project, ${study.industry}.`;
			if (study.kind === "concept") {
				kind = "A product webvise designed and built itself.";
			} else if (study.slug === "webvise") {
				kind = "webvise's own website.";
			}
			return [
				`- ${study.client} (/case-studies/${study.slug}).`,
				kind,
				`${study.title}.`,
				study.excerpt,
				study.results?.length ? `Results: ${study.results.join("; ")}.` : "",
				study.metrics?.length
					? `Figures: ${study.metrics.map((metric) => `${metric.value} ${metric.label}`).join("; ")}.`
					: "",
				study.liveUrl ? `Live at ${study.liveUrl}.` : "",
			]
				.filter(Boolean)
				.join(" ");
		})
		.join("\n");
}

function figures(): string {
	const results = entries<{
		deviceLabel?: string;
		label: string;
		value: string;
	}>(en, "metrics.results.items").map(
		(item) => `- ${item.value} ${item.deviceLabel ?? item.label}`
	);
	const facts = entries<string>(en, "home.hero.facts").map(
		(fact) => `- ${fact}`
	);
	return [...results, ...facts].join("\n");
}

function quotes(): string {
	return entries<{
		author: string;
		company: string;
		quote: string;
		role: string;
	}>(en, "testimonials.items")
		.map(
			(item) =>
				`- "${item.quote}" ${item.author}, ${item.role}, ${item.company}`
		)
		.join("\n");
}

function faq(): string {
	return entries<{ answer: string; question: string }>(en, "faq.items")
		.map((item) => `Q: ${item.question}\nA: ${item.answer}`)
		.join("\n");
}

function about(): string {
	const bio = entries<string>(en, "about.bio.paragraphs");
	const roles = entries<{ company: string; period: string; role: string }>(
		en,
		"about.experience.items"
	).map((item) => `- ${item.role}, ${item.company}, ${item.period}`);
	return [
		text(en, "about.intro.description"),
		...bio,
		"Experience:",
		...roles,
	].join("\n");
}

function fields(): string {
	return industries
		.map(
			(industry) =>
				`- ${text(en, `industries.items.${industry.slug}.title`)}: /industries/${industry.slug}`
		)
		.join("\n");
}

/** What the website says about webvise, as plain text for the chat assistant.
 * It reads the same messages and case study files as the pages, so a new
 * service, project or figure reaches the assistant with the next deploy. */
export function siteKnowledge(): string {
	return `## Services
Every service has its own page. Recommend the one that fits the visitor's workflow.

${services()}

## Projects
Projects marked "a product webvise designed and built itself" are webvise's own products. Present them as such and never call them client work.

${projects()}

## Figures the website states
${figures()}

## What clients say
${quotes()}

## Frequently asked questions
${faq()}

## About Sebastian Kehle, founder
${about()}

## Industries
${fields()}

## Contact
${text(en, "footer.address.email")}, ${text(en, "footer.address.street")}, ${text(en, "footer.address.city")}`;
}
