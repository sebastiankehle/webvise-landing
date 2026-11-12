import { getLocale, getTranslations } from "next-intl/server";

import { QuoteAuthor } from "@/components/marketing/quote-author";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TopicPicker } from "@/components/marketing/topic-picker";
import { H2 } from "@/components/ui/typography";
import { BOOKING_TOPICS, type BookingTopic } from "@/data/booking";
import { CLOSING_TESTIMONIAL_KEY } from "@/data/testimonials";
import { getPathname } from "@/i18n/navigation";

/** The strongest client voice sits right beside the one action of the page. */
export default async function Closing() {
	const [t, tc, tb, tt, tf, locale] = await Promise.all([
		getTranslations("home"),
		getTranslations("contact"),
		getTranslations("book"),
		getTranslations("testimonials"),
		getTranslations("footer"),
		getLocale(),
	]);
	const quote = `items.${CLOSING_TESTIMONIAL_KEY}` as const;
	const topics = Object.fromEntries(
		BOOKING_TOPICS.map((topic) => [topic, tb(`topics.${topic}`)])
	) as Record<BookingTopic, string>;
	const email = tf("address.email");

	return (
		<SectionWrapper id="contact" surface="inverted">
			<StaggerChildren className="grid gap-x-6 gap-y-14 md:grid-cols-12">
				<div className="md:col-span-6">
					<H2>{tc("title")}</H2>
					<p className="mt-5 max-w-[48ch] text-foreground/80 text-lg leading-[1.6]">
						{tc("subtitle")}
					</p>
					<p className="mt-4 text-muted-foreground text-sm">{tc("promise")}</p>
					<TopicPicker
						action={getPathname({ href: "/book", locale })}
						className="mt-10"
						cta={tc("booking.cta")}
						label={t("closing.topicLabel")}
						location="home_closing"
						topics={topics}
					/>
					<p className="mt-8 text-base text-muted-foreground">
						{t("closing.mail")}{" "}
						<a
							className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors duration-150 hover:decoration-foreground focus-visible:decoration-foreground"
							href={`mailto:${email}`}
						>
							{email}
						</a>
					</p>
				</div>
				<figure className="surface-card flex flex-col justify-between gap-10 self-start p-6 md:col-span-5 md:col-start-8 md:p-8">
					<blockquote className="text-foreground text-lg leading-[1.6]">
						{tt(`${quote}.quote`)}
					</blockquote>
					<QuoteAuthor
						author={tt(`${quote}.author`)}
						detail={`${tt(`${quote}.role`)}, ${tt(`${quote}.company`)}`}
					/>
				</figure>
			</StaggerChildren>
		</SectionWrapper>
	);
}
