import { getLocale } from "next-intl/server";

import ChatWidget from "@/components/marketing/chat-widget";
import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import { getBlogPosts } from "@/data/blog";
import { getCaseStudies } from "@/data/case-studies";

export default async function MarketingLayout({
	children,
	cta,
}: {
	children: React.ReactNode;
	cta: React.ReactNode;
}) {
	const locale = await getLocale();
	const recentPosts = getBlogPosts(locale)
		.slice(0, 3)
		.map(({ slug, title, date, readingTime }) => ({
			slug,
			title,
			date,
			readingTime,
		}));

	const allCaseStudies = getCaseStudies(locale);
	const featuredSlugs = ["old-world-labs", "ohyp-fintech", "mp-bau-construction"];
	const featuredCaseStudies = featuredSlugs
		.map((s) => allCaseStudies.find((cs) => cs.slug === s))
		.filter((cs): cs is NonNullable<typeof cs> => cs != null)
		.map(({ slug, client, title, excerpt, coverImage }) => ({ slug, client, title, excerpt, coverImage }));

	return (
		<>
			<a
				href="#main-content"
				className="sr-only fixed top-4 left-4 z-100 border border-border bg-background px-4 py-2 font-medium text-sm focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to content
			</a>
			<Navbar recentPosts={recentPosts} featuredCaseStudies={featuredCaseStudies} />
			<main id="main-content">{children}</main>
			<Footer ctaBanner={cta} />
			<ChatWidget />
		</>
	);
}
