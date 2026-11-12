import { getLocale, getTranslations } from "next-intl/server";

import { ActionArrow, ArrowLink } from "@/components/marketing/action";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getBlogIndex } from "@/data/blog";
import { Link } from "@/i18n/navigation";

export default async function Journal() {
	const [tb, locale] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
	]);
	const posts = getBlogIndex(locale).slice(0, 4);

	if (posts.length === 0) {
		return null;
	}

	return (
		<SectionWrapper id="blog">
			<SectionHeading
				action={<ArrowLink href="/blog">{tb("viewAll")}</ArrowLink>}
				title={tb("title")}
			/>
			<StaggerChildren className="mt-8 md:mt-12">
				<ul>
					{posts.map((post) => (
						<li key={post.slug}>
							<Link
								className="group/arrow -mx-4 grid gap-x-6 gap-y-1 rounded-[10px] px-4 py-5 outline-none transition-colors duration-150 hover:bg-card focus-visible:bg-card md:grid-cols-12 md:items-baseline md:py-6"
								href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
							>
								<time
									className="text-muted-foreground text-sm tabular-nums md:col-span-2"
									dateTime={post.date}
								>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</time>
								<h3 className="font-display text-foreground text-lg leading-snug md:col-span-8">
									{post.title}
								</h3>
								<span className="flex items-center gap-3 text-muted-foreground text-sm tabular-nums md:col-span-2 md:justify-end">
									{post.readingTime} {tb("minRead")}
									<span className="text-foreground">
										<ActionArrow />
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</StaggerChildren>
		</SectionWrapper>
	);
}
