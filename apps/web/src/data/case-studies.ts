import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export interface CaseStudyMeta {
	client: string;
	coverImage?: string;
	date: string;
	deliveryTime?: string;
	fullPageImage?: string;
	images?: string[];
	industry: string;
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

interface MetaFile extends CaseStudyMeta, CaseStudyContent {}

const contentDir = join(process.cwd(), "content/case-studies");

const cache = new Map<string, MetaFile | CaseStudyContent>();

function cacheKey(slug: string, locale: string): string {
	return `${slug}:${locale}`;
}

function readFile(
	slug: string,
	locale: string
): MetaFile | CaseStudyContent | null {
	const key = cacheKey(slug, locale);
	const cached = cache.get(key);
	if (cached) {
		return cached;
	}

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) {
		return null;
	}

	const data = JSON.parse(readFileSync(filePath, "utf-8"));
	cache.set(key, data);
	return data;
}

function getEnglishFile(slug: string): MetaFile | null {
	return readFile(slug, "en") as MetaFile | null;
}

function getSlugs(): string[] {
	if (!existsSync(contentDir)) {
		return [];
	}
	return readdirSync(contentDir).filter((entry) => {
		const entryPath = join(contentDir, entry);
		return (
			statSync(entryPath).isDirectory() &&
			existsSync(join(entryPath, "en.json"))
		);
	});
}

function toCaseStudy(slug: string, locale: string): CaseStudy | null {
	const enFile = getEnglishFile(slug);
	if (!enFile) {
		return null;
	}

	const localeFile = locale === "en" ? null : readFile(slug, locale);
	const content = (localeFile as CaseStudyContent | null) ?? enFile;

	return {
		slug,
		client: enFile.client,
		industry:
			((localeFile as Record<string, unknown> | null)?.industry as string) ??
			enFile.industry,
		services: enFile.services,
		date: enFile.date,
		coverImage: enFile.coverImage,
		images: enFile.images,
		fullPageImage: enFile.fullPageImage,
		location: enFile.location,
		deliveryTime: enFile.deliveryTime,
		liveUrl: enFile.liveUrl,
		title: content.title,
		excerpt: content.excerpt,
		challenge: content.challenge,
		solution: content.solution,
		results: content.results,
		metrics: content.metrics,
		techStack: content.techStack,
		testimonial: content.testimonial,
	};
}

export function getCaseStudies(locale: string): CaseStudy[] {
	return getSlugs()
		.map((slug) => toCaseStudy(slug, locale))
		.filter((cs): cs is CaseStudy => cs !== null)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudyBySlug(
	slug: string,
	locale: string
): CaseStudy | undefined {
	return toCaseStudy(slug, locale) ?? undefined;
}

const FEATURED_CASE_STUDY_SLUGS = [
	"old-world-labs",
	"ohyp-fintech",
	"mp-bau-construction",
] as const;

export function getFeaturedCaseStudies(locale: string): CaseStudy[] {
	const all = getCaseStudies(locale);
	return FEATURED_CASE_STUDY_SLUGS.map((slug) =>
		all.find((cs) => cs.slug === slug)
	).filter((cs): cs is CaseStudy => cs != null);
}
