import { describe, expect, it } from "vitest";
import { type BlogPost, searchBlogPosts } from "@/data/blog";

function post(slug: string, fields: Partial<BlogPost>): BlogPost {
	return {
		slug,
		date: "2026-01-01",
		excerpt: "",
		keyword: "",
		readingTime: 5,
		title: slug,
		blocks: [],
		...fields,
	};
}

const posts = [
	post("chatgpt", {
		blocks: [
			{ type: "p", text: "A conversation can create a promise." },
			{
				type: "p",
				text: "See the [checklist](/blog/landing-page-conversion-tracking).",
			},
		],
	}),
	post("tracking", { title: "Landing Page Conversion Tracking" }),
	post("speed", {
		blocks: [{ type: "ul", items: ["Faster pages lift conversions."] }],
	}),
];

const slugs = (query: string) =>
	searchBlogPosts(posts, query).map((entry) => entry.slug);

describe("searchBlogPosts", () => {
	it("finds a word that appears only in the article body", () => {
		expect(slugs("Conversation")).toEqual(["chatgpt"]);
	});

	it("lists title matches before body matches", () => {
		expect(slugs("conversion")).toEqual(["tracking", "speed"]);
	});

	it("ignores markdown link targets", () => {
		expect(slugs("landing-page")).toEqual([]);
	});

	it("returns every post for an empty query", () => {
		expect(slugs("")).toEqual(["chatgpt", "tracking", "speed"]);
	});
});
