import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export interface CaseStudyMeta {
	slug: string;
	client: string;
	industry: string;
	services: string[];
	date: string;
	coverImage?: string;
	images?: string[];
}

export interface CaseStudyMetric {
	value: string;
	label: string;
}

export interface CaseStudyContent {
	title: string;
	excerpt: string;
	challenge: string;
	solution: string;
	results: string[];
	metrics?: CaseStudyMetric[];
	techStack: string[];
	testimonial: {
		quote: string;
		author: string;
		role: string;
	} | null;
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
	locale: string,
): MetaFile | CaseStudyContent | null {
	const key = cacheKey(slug, locale);
	const cached = cache.get(key);
	if (cached) return cached;

	const filePath = join(contentDir, slug, `${locale}.json`);
	if (!existsSync(filePath)) return null;

	const data = JSON.parse(readFileSync(filePath, "utf-8"));
	cache.set(key, data);
	return data;
}

function getEnglishFile(slug: string): MetaFile | null {
	return readFile(slug, "en") as MetaFile | null;
}

function getSlugs(): string[] {
	if (!existsSync(contentDir)) return [];
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
	if (!enFile) return null;

	const localeFile = locale !== "en" ? readFile(slug, locale) : null;
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
	locale: string,
): CaseStudy | undefined {
	return toCaseStudy(slug, locale) ?? undefined;
}
