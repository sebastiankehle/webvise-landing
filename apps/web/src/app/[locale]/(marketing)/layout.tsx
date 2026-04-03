import { getLocale } from "next-intl/server";

import ChatWidget from "@/components/marketing/chat-widget";
import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import { getBlogPosts } from "@/data/blog";

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

	return (
		<>
			<a
				href="#main-content"
				className="sr-only fixed top-4 left-4 z-100 border border-border bg-background px-4 py-2 font-medium text-sm focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to content
			</a>
			<Navbar recentPosts={recentPosts} />
			<main id="main-content">{children}</main>
			<Footer ctaBanner={cta} />
			<ChatWidget />
		</>
	);
}
