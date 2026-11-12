/** The reader's topics, each gathering the tags the articles carry. The tags
 * themselves are English working labels; readers only ever see the topics. */
export const BLOG_TOPICS = [
	{ key: "ai", tags: ["AI", "AI Agents"] },
	{ key: "automation", tags: ["Automation", "Process"] },
	{
		key: "websites",
		tags: ["Web Development", "WordPress", "Performance", "SEO"],
	},
	{ key: "cost", tags: ["Cost Guide"] },
	{ key: "security", tags: ["Security"] },
	{
		key: "strategy",
		tags: ["Business Strategy", "Small Business", "Lead Generation"],
	},
] as const;

export type BlogTopicKey = (typeof BLOG_TOPICS)[number]["key"];

/** The topics an article belongs to, in the order of the filter. */
export function topicsForTags(tags: readonly string[]): BlogTopicKey[] {
	return BLOG_TOPICS.filter((topic) =>
		topic.tags.some((tag) => tags.includes(tag))
	).map((topic) => topic.key);
}
