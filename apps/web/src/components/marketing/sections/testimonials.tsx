import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Marquee } from "@/components/magicui/marquee";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import {
	Body,
	Caption,
	H2,
	Lead,
	Muted,
	QuoteMark,
} from "@/components/ui/typography";

const testimonialKeys = ["0", "1", "2", "3", "4", "5", "6"] as const;
const whitespacePattern = /\s+/;
const firstRowKeys = ["0", "1", "4", "5"] as const;
const secondRowKeys = ["2", "3", "6"] as const;

const testimonialImages: Partial<
	Record<(typeof testimonialKeys)[number], string>
> = {
	"0": "/images/testimonials/philipp-berger.jpeg",
	"1": "/images/testimonials/anna-maria-von-platen.png",
	"2": "/images/testimonials/felix-rautenberg.jpeg",
	"3": "/images/testimonials/joshua-kunisch.png",
	"4": "/images/testimonials/lennart-brauer.webp",
	"5": "/images/testimonials/sebastian-kundoch.jpeg",
	"6": "/images/testimonials/richard-heinbach.jpeg",
};

export default async function Testimonials() {
	const t = await getTranslations("testimonials");
	const renderTestimonialCard = (key: (typeof testimonialKeys)[number]) => {
		const author = t(`items.${key}.author`);
		const company = t(`items.${key}.company`);
		const image = testimonialImages[key];
		const initials = author
			.split(whitespacePattern)
			.map((part) => part[0])
			.join("")
			.slice(0, 2);

		return (
			<article
				className="surface-card flex h-full w-[82vw] shrink-0 flex-col justify-between p-6 md:w-[420px] md:p-7 lg:w-[460px]"
				key={key}
			>
				<div>
					<QuoteMark className="block" />
					<Muted className="mt-3 text-sm leading-6">
						{t(`items.${key}.quote`)}
					</Muted>
				</div>
				<div className="mt-8 flex items-center gap-3">
					{image ? (
						<Image
							alt=""
							className="size-10 shrink-0 rounded-full object-cover"
							height={40}
							src={image}
							width={40}
						/>
					) : (
						<div
							aria-hidden="true"
							className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs"
						>
							{initials}
						</div>
					)}
					<div className="min-w-0">
						<Body className="text-sm leading-6">{author}</Body>
						<Caption className="mt-0.5 block">
							{t(`items.${key}.role`)}
							{company && `, ${company}`}
						</Caption>
					</div>
				</div>
			</article>
		);
	};

	return (
		<SectionWrapper hatch id="testimonials">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-10 flex flex-col gap-5 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] md:mt-16 md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)]">
				<Marquee className="[--duration:55s]" repeat={3}>
					{firstRowKeys.map(renderTestimonialCard)}
				</Marquee>
				<Marquee className="[--duration:55s]" repeat={4} reverse>
					{secondRowKeys.map(renderTestimonialCard)}
				</Marquee>
			</StaggerChildren>
		</SectionWrapper>
	);
}
