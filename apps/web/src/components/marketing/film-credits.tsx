import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { InlineLink, inlineLinkClassName } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** The case study whose pictures show stills from a CC BY short film, and
 * the anchor of its credits on its page. Wherever else a still shows, a
 * caption names the film and links here: under the home page's wall of
 * screens, under a service page's screens and on every card of the project.
 * The footer links here too. */
export const FILM_CREDITS_SLUG = "screencurve";
export const FILM_CREDITS_ID = "film-credits";

const LICENCE = "https://creativecommons.org/licenses/by/3.0/";

/** The film the pictures show, credited as its maker's page asks: title,
 * year, author, source and licence (screencurve's demo-film note). */
const FILM = {
	title: "The Car Spotter (Bilskådaren)",
	year: 2022,
	author: "Martin Sandin",
	source: "vimeo.com/759806477",
};

function Licence({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<InlineLink
			className={className}
			href={LICENCE}
			rel="license noopener noreferrer"
			target="_blank"
		>
			{children}
		</InlineLink>
	);
}

/** One line under the first pictures: what they show, and where the credits
 * are. Renders only on the case study it belongs to. */
export async function FilmCreditsCaption({ slug }: { slug: string }) {
	if (slug !== FILM_CREDITS_SLUG) {
		return null;
	}
	const t = await getTranslations("caseStudies.filmCredits");
	return (
		<p className="mt-6 text-muted-foreground text-sm leading-5">
			{t.rich("caption", {
				licence: (chunks) => <Licence>{chunks}</Licence>,
				credits: (chunks) => (
					<InlineLink href={`#${FILM_CREDITS_ID}`}>{chunks}</InlineLink>
				),
			})}
		</p>
	);
}

/** One line under Screencurve screens shown away from the case study: whose
 * stills they are, their licence and where the credits are. */
export async function FilmStillsNote({
	className,
	slug,
}: {
	className?: string;
	slug: string;
}) {
	if (slug !== FILM_CREDITS_SLUG) {
		return null;
	}
	const t = await getTranslations("caseStudies.filmCredits");
	// The links keep the sentence's size and colour; the underline marks them
	const link = "text-inherit text-xs";
	return (
		<p className={cn("text-muted-foreground text-xs leading-5", className)}>
			{t.rich("screens", {
				licence: (chunks) => <Licence className={link}>{chunks}</Licence>,
				credits: (chunks) => (
					<Link
						className={cn(inlineLinkClassName, link)}
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: FILM_CREDITS_SLUG },
							hash: FILM_CREDITS_ID,
						}}
					>
						{chunks}
					</Link>
				),
			})}
		</p>
	);
}

/** Title, year, author, source and licence of the film the pictures show,
 * and that its maker has nothing to do with the analysis. Renders only on
 * the case study it belongs to. */
export async function FilmCredits({ slug }: { slug: string }) {
	if (slug !== FILM_CREDITS_SLUG) {
		return null;
	}
	const t = await getTranslations("caseStudies.filmCredits");
	return (
		<div
			className="mt-10 scroll-mt-28 border-foreground/[0.08] border-t pt-6 text-muted-foreground text-sm leading-6 md:mt-14"
			id={FILM_CREDITS_ID}
		>
			<h3 className="text-foreground">{t("title")}</h3>
			<p className="mt-2 max-w-[72ch]">{t("intro")}</p>
			<p className="mt-2">
				{FILM.title}, {FILM.year}, {FILM.author},{" "}
				<InlineLink
					href={`https://${FILM.source}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					{FILM.source}
				</InlineLink>
				, <Licence>CC BY 3.0</Licence>
			</p>
			<p className="mt-2 max-w-[72ch]">{t("notice")}</p>
		</div>
	);
}
