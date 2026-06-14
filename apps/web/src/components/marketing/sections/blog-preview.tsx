import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	Caption,
	H2,
	H3,
	inlineLinkClassName,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";

export default async function BlogPreview() {
	const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
	const posts = getBlogPosts(locale).slice(0, 6);

	if (posts.length === 0) {
		return null;
	}

	return (
		<SectionWrapper hatch hideOnMobile id="blog" surface="inverted">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href="/blog"
					>
						{t("viewAll")}
					</Link>
				</div>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-3">
				{posts.map((post, index) => (
					<Link
						className={`surface-card group flex flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:p-7 ${index > 2 ? "max-md:hidden" : ""}`}
						href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
						key={post.slug}
					>
						<div className="flex items-center justify-between gap-4">
							<Caption className="text-brand-readable">
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</time>
							</Caption>
							<Caption className="tabular-nums">
								{post.readingTime} {t("minRead")}
							</Caption>
						</div>
						<H3 className="mt-5">{post.title}</H3>
						<Muted className="mt-3 line-clamp-3">{post.excerpt}</Muted>
						<div className="mt-auto flex items-center justify-end pt-6">
							<ArrowRight className="h-4 w-4 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
