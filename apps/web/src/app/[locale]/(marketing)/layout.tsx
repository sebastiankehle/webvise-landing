import { getLocale } from "next-intl/server";

import ChatWidgetMount from "@/components/marketing/chat-widget-mount";
import Footer from "@/components/marketing/footer";
import HashLinkScrollManager from "@/components/marketing/hash-link-scroll-manager";
import Navbar from "@/components/marketing/navbar";
import ThemeSwitcher from "@/components/marketing/theme-switcher";
import { getBlogIndex } from "@/data/blog";
import { getFeaturedCaseStudies } from "@/data/case-studies";

export default async function MarketingLayout({
	children,
	cta,
}: {
	children: React.ReactNode;
	cta: React.ReactNode;
}) {
	const locale = await getLocale();
	const recentPosts = getBlogIndex(locale)
		.slice(0, 3)
		.map(({ slug, title, date, excerpt, tags, readingTime }) => ({
			slug,
			title,
			date,
			excerpt,
			tags,
			readingTime,
		}));

	const featuredCaseStudies = getFeaturedCaseStudies(locale).map(
		({ slug, client, title, excerpt, kind, services, coverImage }) => ({
			slug,
			client,
			title,
			excerpt,
			kind,
			services,
			coverImage,
		})
	);

	return (
		<>
			<a
				className="sr-only fixed top-4 left-4 z-100 border border-border bg-background px-4 py-2 font-medium text-sm focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
				href="#main-content"
			>
				Skip to content
			</a>
			<Navbar
				featuredCaseStudies={featuredCaseStudies}
				recentPosts={recentPosts}
			/>
			<HashLinkScrollManager />
			<main className="border-grid-line border-x" id="main-content">
				{children}
			</main>
			<Footer ctaBanner={cta} />
			<ThemeSwitcher />
			<ChatWidgetMount />
		</>
	);
}
