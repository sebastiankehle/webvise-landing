/** Portraits for quoted clients, keyed by the author's name as it appears in
 * the messages and case study files. */
export const testimonialAvatars: Record<string, string> = {
	"Anna-Maria von Platen": "/images/testimonials/anna-maria-von-platen.png",
	"Felix von Rautenberg": "/images/testimonials/felix-rautenberg.jpeg",
	"Joshua Kunisch": "/images/testimonials/joshua-kunisch.png",
	"Lennart Brauer": "/images/testimonials/lennart-brauer.webp",
	"Nick Liverman": "/images/testimonials/nick-liverman.jpg",
	"Philipp Berger": "/images/testimonials/philipp-berger.jpeg",
	"Richard Heinbach": "/images/testimonials/richard-heinbach.jpeg",
	"Sebastian Kundoch": "/images/testimonials/sebastian-kundoch.jpeg",
};

/** The case study behind a quote, keyed by the author's name. Quotes from
 * work without a public case study have no entry. */
export const testimonialProjects: Record<string, string> = {
	"Anna-Maria von Platen": "von-platen-coaching",
	"Felix von Rautenberg": "rautenberg-pitch-engine",
	"Richard Heinbach": "finanzierungszertifikat",
	"Sebastian Kundoch": "maerkische-projekt-bau",
};

/** Keys into `testimonials.items` in the message files, in the order the
 * homepage shows them. The seventh quote closes the page. */
export const HOME_TESTIMONIAL_KEYS = ["5", "6", "1", "3", "4", "0"] as const;
export const CLOSING_TESTIMONIAL_KEY = "2";

const whitespacePattern = /\s+/;

export function testimonialInitials(author: string): string {
	return author
		.split(whitespacePattern)
		.map((part) => part[0])
		.join("")
		.slice(0, 2);
}
