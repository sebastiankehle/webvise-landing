import type {
	EmailLocale,
	WelcomeSource,
	WelcomeTopic,
} from "@webvise-app/api/email/newsletter";
import { getBlogPostBySlug } from "@/data/blog";

const BLOG_SLUG_RE = /\/blog\/([^/?#]+)/;

// First matching tag wins, so specific topics come before broad ones.
const TOPIC_BY_TAG: [string, WelcomeTopic][] = [
	["AI Agents", "ai-agents"],
	["Automation", "ai-automation"],
	["Process", "ai-automation"],
	["Performance", "web"],
	["SEO", "web"],
	["Web Development", "web"],
	["Web Design", "web"],
	["Next.js", "web"],
	["WordPress", "web"],
	["AI", "ai-automation"],
];

function pickTopic(tags: string[]): WelcomeTopic | undefined {
	for (const [tag, topic] of TOPIC_BY_TAG) {
		if (tags.includes(tag)) {
			return topic;
		}
	}
	return;
}

export function welcomeSourceFromPath(
	path: string | null | undefined,
	locale: EmailLocale = "en"
): WelcomeSource | undefined {
	const slug = path?.match(BLOG_SLUG_RE)?.[1];
	if (!slug) {
		return;
	}

	const post = getBlogPostBySlug(slug, "en");
	if (!post) {
		return;
	}

	const topic = pickTopic(post.tags ?? []);
	if (!topic) {
		return;
	}

	// The topic map reads the English tags; the title follows the reader's language.
	const postTitle =
		locale === "en"
			? post.title
			: (getBlogPostBySlug(slug, locale)?.title ?? post.title);

	return { topic, postTitle };
}
