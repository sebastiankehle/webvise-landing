import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

export const CASE_STUDY_COLLECTIONS = {
	featured: ["hyyve", "ohyp-fintech", "rautenberg-pitch-engine"],
	concept: ["relay", "keel", "morrow"],
} as const;

const CASE_STUDY_ORDER = [
	"hyyve",
	"ohyp-fintech",
	"rautenberg-pitch-engine",
	"relay",
	"keel",
	"morrow",
	"mp-bau-construction",
	"old-world-labs",
	"webvise",
] as const;

export type CaseStudyCollection = keyof typeof CASE_STUDY_COLLECTIONS;
export type CaseStudyKind = "client" | "concept";

export interface CaseStudyMeta {
	client: string;
	coverImage?: string;
	date: string;
	deliveryTime?: string;
	fullPageImage?: string;
	images?: string[];
	industry: string;
	kind: CaseStudyKind;
	liveUrl?: string;
	location?: string;
	services: string[];
	slug: string;
}

export interface CaseStudyMetric {
	label: string;
	value: string;
}

export interface CaseStudyContent {
	challenge: string;
	excerpt: string;
	liveUrlLabel?: string;
	metrics?: CaseStudyMetric[];
	results?: string[];
	solution: string;
	techStack: string[];
	testimonial: {
		quote: string;
		author: string;
		role: string;
	} | null;
	title: string;
}

export interface CaseStudy extends CaseStudyMeta, CaseStudyContent {}

const caseStudyMetricSchema = z.object({
	label: z.string().min(1),
	value: z.string().min(1),
});

const caseStudyTestimonialSchema = z
	.object({
		quote: z.string().min(1),
		author: z.string().min(1),
		role: z.string().min(1),
	})
	.nullable();

const caseStudyContentSchema = z.object({
	challenge: z.string().min(1),
	excerpt: z.string().min(1),
	liveUrlLabel: z.string().min(1).optional(),
	metrics: z.array(caseStudyMetricSchema).optional(),
	results: z.array(z.string().min(1)).optional(),
	solution: z.string().min(1),
	techStack: z.array(z.string().min(1)),
	testimonial: caseStudyTestimonialSchema,
	title: z.string().min(1),
});

const localizedCaseStudyFileSchema = caseStudyContentSchema
	.extend({
		industry: z.string().min(1).optional(),
	})
	.passthrough();

const sourceCaseStudyFileSchema = caseStudyContentSchema
	.extend({
		client: z.string().min(1),
		coverImage: z.string().min(1).optional(),
		date: z
			.string()
			.min(1)
			.refine((value) => !Number.isNaN(Date.parse(value)), {
				message: "Expected a parseable date",
			}),
		deliveryTime: z.string().min(1).optional(),
		fullPageImage: z.string().min(1).optional(),
		images: z.array(z.string().min(1)).optional(),
		industry: z.string().min(1),
		liveUrl: z.string().min(1).optional(),
		location: z.string().min(1).optional(),
		services: z.array(z.string().min(1)),
	})
	.strict();

type SourceCaseStudyFile = z.infer<typeof sourceCaseStudyFileSchema>;
type LocalizedCaseStudyFile = z.infer<typeof localizedCaseStudyFileSchema>;
type CaseStudyFile = SourceCaseStudyFile | LocalizedCaseStudyFile;

interface CaseStudyQuery {
	kind?: CaseStudyKind;
}

const contentDir = join(process.cwd(), "content/case-studies");

const isDev = process.env.NODE_ENV !== "production";
const cache = new Map<string, CaseStudyFile>();
const conceptCaseStudySlugs = new Set<string>(CASE_STUDY_COLLECTIONS.concept);

function cacheKey(slug: string, locale: string): string {
	return `${slug}:${locale}`;
}

function formatContentError(
	slug: string,
	locale: string,
	error: z.ZodError
): string {
	const details = error.issues
		.map((issue) => {
			const path = issue.path.length > 0 ? issue.path.join(".") : "root";
			return `${path}: ${issue.message}`;
		})
		.join("; ");
	return `Invalid case study content "${slug}/${locale}.json": ${details}`;
}

function readFile<T extends CaseStudyFile>(
	slug: string,
	locale: string,
	schema: z.ZodType<T>
): T | null {
	const key = cacheKey(slug, locale);
	if (!isDev) {
		const cached = cache.get(key) as T | undefined;
		if (cached) {
			return cached;
		}
	}

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) {
		return null;
	}

	const data = JSON.parse(readFileSync(filePath, "utf-8"));
	const parsed = schema.safeParse(data);
	if (!parsed.success) {
		throw new Error(formatContentError(slug, locale, parsed.error));
	}
	if (!isDev) {
		cache.set(key, parsed.data);
	}
	return parsed.data;
}

function getEnglishFile(slug: string): SourceCaseStudyFile | null {
	return readFile(slug, "en", sourceCaseStudyFileSchema);
}

function getLocalizedFile(
	slug: string,
	locale: string
): LocalizedCaseStudyFile | null {
	return readFile(slug, locale, localizedCaseStudyFileSchema);
}

function getSlugs(): string[] {
	if (!existsSync(contentDir)) {
		return [];
	}
	return readdirSync(contentDir)
		.filter((entry) => {
			const entryPath = join(contentDir, entry);
			return (
				statSync(entryPath).isDirectory() &&
				existsSync(join(entryPath, "en.json"))
			);
		})
		.sort((a, b) => a.localeCompare(b));
}

function getCaseStudyKind(slug: string): CaseStudyKind {
	return conceptCaseStudySlugs.has(slug) ? "concept" : "client";
}

function isCaseStudy(value: CaseStudy | undefined): value is CaseStudy {
	return value !== undefined;
}

function byMostRecentDate(a: CaseStudy, b: CaseStudy): number {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function byEditorialOrder(a: CaseStudy, b: CaseStudy): number {
	const aIndex = CASE_STUDY_ORDER.indexOf(
		a.slug as (typeof CASE_STUDY_ORDER)[number]
	);
	const bIndex = CASE_STUDY_ORDER.indexOf(
		b.slug as (typeof CASE_STUDY_ORDER)[number]
	);

	if (aIndex !== -1 && bIndex !== -1) {
		return aIndex - bIndex;
	}
	if (aIndex !== -1) {
		return -1;
	}
	if (bIndex !== -1) {
		return 1;
	}

	return byMostRecentDate(a, b);
}

function toCaseStudy(slug: string, locale: string): CaseStudy | null {
	const enFile = getEnglishFile(slug);
	if (!enFile) {
		return null;
	}

	const localeFile = locale === "en" ? null : getLocalizedFile(slug, locale);
	const content = localeFile ?? enFile;

	return {
		slug,
		kind: getCaseStudyKind(slug),
		client: enFile.client,
		industry: localeFile?.industry ?? enFile.industry,
		services: [...enFile.services],
		date: enFile.date,
		coverImage: enFile.coverImage,
		images: enFile.images ? [...enFile.images] : undefined,
		fullPageImage: enFile.fullPageImage,
		location: enFile.location,
		deliveryTime: enFile.deliveryTime,
		liveUrl: enFile.liveUrl,
		title: content.title,
		excerpt: content.excerpt,
		challenge: content.challenge,
		solution: content.solution,
		results: content.results ? [...content.results] : undefined,
		metrics: content.metrics
			? content.metrics.map((metric) => ({ ...metric }))
			: undefined,
		techStack: [...content.techStack],
		testimonial: content.testimonial,
		liveUrlLabel: content.liveUrlLabel,
	};
}

export function getCaseStudies(
	locale: string,
	query: CaseStudyQuery = {}
): CaseStudy[] {
	const caseStudies = getSlugs()
		.map((slug) => toCaseStudy(slug, locale))
		.filter((cs): cs is CaseStudy => cs !== null)
		.sort(byEditorialOrder);

	if (query.kind) {
		return caseStudies.filter((caseStudy) => caseStudy.kind === query.kind);
	}

	return caseStudies;
}

export function getCaseStudyBySlug(
	slug: string,
	locale: string
): CaseStudy | undefined {
	return toCaseStudy(slug, locale) ?? undefined;
}

export function getCaseStudyCollection(
	locale: string,
	collection: CaseStudyCollection
): CaseStudy[] {
	const caseStudiesBySlug = new Map(
		getCaseStudies(locale).map((caseStudy) => [caseStudy.slug, caseStudy])
	);
	return CASE_STUDY_COLLECTIONS[collection]
		.map((slug) => caseStudiesBySlug.get(slug))
		.filter(isCaseStudy);
}

export function getConceptCaseStudies(locale: string): CaseStudy[] {
	return getCaseStudyCollection(locale, "concept");
}

export function getFeaturedCaseStudies(locale: string): CaseStudy[] {
	return getCaseStudyCollection(locale, "featured");
}

export function getRelatedCaseStudies(
	slug: string,
	locale: string,
	limit = 2
): CaseStudy[] {
	return getCaseStudies(locale)
		.filter((caseStudy) => caseStudy.slug !== slug)
		.slice(0, Math.max(0, limit));
}
