import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { InlineLink } from "@/components/ui/typography";

/** The case study whose pictures show stills from Blender Foundation open
 * movies, and the anchor of their credits on its page. The footer links
 * there, because the pictures also appear on the home page, on service
 * pages and in the banner behind every page's call to action. */
export const FILM_CREDITS_SLUG = "screencurve";
export const FILM_CREDITS_ID = "film-credits";

const LICENCE = "https://creativecommons.org/licenses/by/3.0/";

/** The films in screencurve's demo analyses, credited as each project asks
 * (screencurve `docs/validation/demo-material.md`). */
const FILMS = [
	{
		title: "Tears of Steel",
		year: 2012,
		credit: "(CC) Blender Foundation |",
		source: "mango.blender.org",
	},
	{
		title: "Sintel",
		year: 2010,
		credit: "© copyright Blender Foundation |",
		source: "durian.blender.org",
	},
	{
		title: "Cosmos Laundromat",
		year: 2015,
		credit: "(CC) Blender Foundation |",
		source: "gooseberry.blender.org",
	},
	{
		title: "Big Buck Bunny",
		year: 2008,
		credit: "(c) copyright 2008, Blender Foundation /",
		source: "www.bigbuckbunny.org",
	},
];

function Licence({ children }: { children: ReactNode }) {
	return (
		<InlineLink
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

/** Title, year, credit line, source and licence of every film the pictures
 * show, and that Blender has nothing to do with the analyses. Renders only
 * on the case study it belongs to. */
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
			<ul className="mt-2">
				{FILMS.map((film) => (
					<li key={film.title}>
						{film.title} ({film.year}), {film.credit}{" "}
						<InlineLink
							href={`https://${film.source}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							{film.source}
						</InlineLink>
						, <Licence>CC BY 3.0</Licence>
					</li>
				))}
			</ul>
			<p className="mt-2 max-w-[72ch]">{t("notice")}</p>
		</div>
	);
}
