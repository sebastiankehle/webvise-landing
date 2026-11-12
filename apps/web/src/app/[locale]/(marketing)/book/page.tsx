import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ActionArrow } from "@/components/marketing/action";
import BookCall from "@/components/marketing/book-call";
import BookNext from "@/components/marketing/book-next";
import { FaqList } from "@/components/marketing/faq-list";
import { QuoteAuthor } from "@/components/marketing/quote-author";
import { QuoteSlider } from "@/components/marketing/quote-slider";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H1, H2, inlineLinkClassName, Lead } from "@/components/ui/typography";
import { socials } from "@/data/socials";
import {
	HOME_TESTIMONIAL_KEYS,
	testimonialProjects,
} from "@/data/testimonials";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([getTranslations("book"), getLocale()]);

	return {
		title: t("meta.title"),
		description: t("meta.description"),
		alternates: generateAlternates("/book", locale),
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			siteName: "webvise",
			url: localizedUrl("/book", locale),
		},
	};
}

const factKeys = ["0", "1", "2"] as const;

/** Keys into `faq.items`: price, build plan, timeline, who does the work. */
const questionKeys = ["2", "1", "0", "5"] as const;

export default async function BookPage({ params }: { params: LocaleParams }) {
	await pinLocale(params);
	const [t, tt, tf, tfoot, ta, th] = await Promise.all([
		getTranslations("book"),
		getTranslations("testimonials"),
		getTranslations("faq"),
		getTranslations("footer"),
		getTranslations("about"),
		getTranslations("home"),
	]);
	const email = tfoot("address.email");
	const linkedin = socials.find((social) => social.name === "LinkedIn");

	return (
		<>
			<section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
				<ConstructedGrid variant="page" />
				<GridContainer>
					{/* CSS-only entrance: the first screen never waits for script */}
					<div className="stagger-visible">
						<div className="grid gap-x-6 gap-y-8 lg:grid-cols-12 lg:items-end">
							<div className="lg:col-span-7">
								<H1>{t("title")}</H1>
								<p className="mt-6 max-w-[54ch] text-foreground text-lg leading-[1.6]">
									{t("subtitle")}
								</p>
							</div>
							<div className="lg:col-span-4 lg:col-start-9">
								{/* The person the call is with */}
								<div className="mb-5 flex items-center gap-3">
									<span className="relative shrink-0">
										<Image
											alt=""
											className="size-12 rounded-full object-cover"
											height={48}
											priority
											src="/images/founder.jpeg"
											width={48}
										/>
										{/* Live dot on the photo, the same one the process section uses */}
										<span
											aria-hidden="true"
											className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-background"
										>
											<span className="relative flex size-2.5">
												<span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
												<span className="relative size-2.5 rounded-full bg-success" />
											</span>
										</span>
									</span>
									<span className="min-w-0">
										<span className="block font-medium text-base text-foreground leading-6">
											{ta("intro.name")}
										</span>
										<span className="block text-muted-foreground text-sm leading-5">
											{ta("intro.role")}
										</span>
									</span>
								</div>
								<ul className="border-foreground/[0.08] border-t">
									{factKeys.map((key) => (
										<li
											className="border-foreground/[0.08] border-b py-2.5 text-base text-foreground"
											key={key}
										>
											{t(`facts.${key}`)}
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="mt-12 md:mt-16">
							<BookCall />
						</div>

						{/* Clients in their own words. Each card names the company
						    first, so nobody reads a client's title as webvise's. */}
						<div className="mt-16 md:mt-24">
							<QuoteSlider
								heading={
									<>
										<H2>{tt("title")}</H2>
										<Lead className="mt-4 max-w-[52ch]">{tt("subtitle")}</Lead>
									</>
								}
								next={tt("next")}
								previous={tt("previous")}
							>
								{HOME_TESTIMONIAL_KEYS.map((key) => {
									const author = tt(`items.${key}.author`);
									const company = tt(`items.${key}.company`);
									const project = testimonialProjects[author];
									return (
										<li
											className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
											key={key}
										>
											<figure className="surface-card flex h-full flex-col justify-between gap-8 p-6 md:p-7">
												<div>
													<div className="flex items-center justify-between gap-4">
														<span
															aria-hidden="true"
															className="block select-none font-display text-3xl text-brand-icon leading-none"
														>
															&ldquo;
														</span>
														<span className="text-muted-foreground text-sm">
															{company}
														</span>
													</div>
													<blockquote className="mt-3 text-[1.0625rem] text-foreground leading-[1.55]">
														{tt(`items.${key}.quote`)}
													</blockquote>
												</div>
												<div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
													<QuoteAuthor
														author={author}
														detail={`${tt(`items.${key}.role`)}, ${company}`}
													/>
													{project && (
														<Link
															className="group/arrow inline-flex items-center gap-1.5 text-foreground text-sm outline-none focus-visible:underline focus-visible:underline-offset-4"
															href={{
																pathname: "/case-studies/[slug]",
																params: { slug: project },
															}}
														>
															{th("stage.link")}
															<ActionArrow />
														</Link>
													)}
												</div>
											</figure>
										</li>
									);
								})}
							</QuoteSlider>
						</div>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper id="next" surface="alternate">
				<BookNext />
			</SectionWrapper>

			<SectionWrapper id="questions">
				<div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<div className="lg:sticky lg:top-28">
							<H2>{t("direct.title")}</H2>
							<Lead className="mt-4">{t("direct.body")}</Lead>
							<ul className="mt-6 grid gap-2 text-base">
								<li>
									<a className={inlineLinkClassName} href={`mailto:${email}`}>
										{email}
									</a>
								</li>
								{linkedin && (
									<li>
										<a
											className={inlineLinkClassName}
											href={linkedin.href}
											rel="noopener noreferrer"
											target="_blank"
										>
											{linkedin.name}
										</a>
									</li>
								)}
							</ul>
						</div>
					</div>
					<StaggerChildren className="lg:col-span-7 lg:col-start-6">
						<FaqList
							items={questionKeys.map((key) => ({
								question: tf(`items.${key}.question`),
								answer: tf(`items.${key}.answer`),
							}))}
						/>
						<Link
							className={`${inlineLinkClassName} mt-8 inline-flex`}
							href="/faq"
						>
							{tf("hub.linkAll")}
						</Link>
					</StaggerChildren>
				</div>
			</SectionWrapper>
		</>
	);
}
