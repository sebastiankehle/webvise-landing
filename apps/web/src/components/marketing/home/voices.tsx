import { getTranslations } from "next-intl/server";

import { Marquee } from "@/components/magicui/marquee";
import { ActionArrow } from "@/components/marketing/action";
import { QuoteAuthor } from "@/components/marketing/quote-author";
import { QuoteStack } from "@/components/marketing/quote-stack";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	HOME_TESTIMONIAL_KEYS,
	testimonialProjects,
} from "@/data/testimonials";
import { Link } from "@/i18n/navigation";

type QuoteKey = (typeof HOME_TESTIMONIAL_KEYS)[number];

const half = Math.ceil(HOME_TESTIMONIAL_KEYS.length / 2);
const firstRow = HOME_TESTIMONIAL_KEYS.slice(0, half);
const secondRow = HOME_TESTIMONIAL_KEYS.slice(half);

/** Client quotes. From tablets up, two rows of cards drift past each other;
 * on a phone, where moving text cannot be read, they stand one under the
 * other. Where the work has a case study, the card leads to it. */
export default async function Voices() {
	const [tt, th] = await Promise.all([
		getTranslations("testimonials"),
		getTranslations("home"),
	]);

	const card = (key: QuoteKey, width: string) => {
		const author = tt(`items.${key}.author`);
		const project = testimonialProjects[author];
		return (
			<figure
				className={`surface-card flex h-full shrink-0 flex-col justify-between gap-8 p-6 md:p-7 ${width}`}
				key={key}
			>
				<div>
					<span
						aria-hidden="true"
						className="block select-none font-display text-3xl text-brand-icon leading-none"
					>
						&ldquo;
					</span>
					<blockquote className="mt-3 text-[1.0625rem] text-foreground leading-[1.55]">
						{tt(`items.${key}.quote`)}
					</blockquote>
				</div>
				<div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
					<QuoteAuthor
						author={author}
						detail={`${tt(`items.${key}.role`)}, ${tt(`items.${key}.company`)}`}
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
		);
	};

	return (
		<SectionWrapper id="voices" surface="alternate">
			<SectionHeading description={tt("subtitle")} title={tt("title")} />
			<div className="mt-10 md:hidden">
				<QuoteStack
					items={HOME_TESTIMONIAL_KEYS.map((key) => card(key, "w-full"))}
					more={tt("more")}
				/>
			</div>
			<StaggerChildren className="mt-14 hidden flex-col gap-5 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] md:flex">
				<Marquee className="[--duration:55s]" repeat={3}>
					{firstRow.map((key) => card(key, "w-[420px] lg:w-[460px]"))}
				</Marquee>
				<Marquee className="[--duration:55s]" repeat={3} reverse>
					{secondRow.map((key) => card(key, "w-[420px] lg:w-[460px]"))}
				</Marquee>
			</StaggerChildren>
		</SectionWrapper>
	);
}
