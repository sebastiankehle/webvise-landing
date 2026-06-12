import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import CardHoverIcon, {
	type AnimatedIcon,
} from "@/components/marketing/card-hover-icon";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H2, H3, Muted } from "@/components/ui/typography";
import {
	getOfferingIcon,
	getOfferingTranslationKey,
	type Offering,
	type OfferingGroup,
	type OfferingGroupKey,
	offeringGroups,
} from "@/data/offerings";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const groupVisuals: Record<
	OfferingGroupKey,
	{
		altKey: string;
		className: string;
		height: number;
		shellClassName: string;
		src: string;
		width: number;
	}
> = {
	launch: {
		altKey: "groups.launch.imageAlt",
		className: "",
		height: 766,
		shellClassName: "lg:grid-cols-[0.42fr_0.58fr]",
		src: "/images/case-studies/old-world-labs/hero.webp",
		width: 1512,
	},
	operate: {
		altKey: "groups.operate.imageAlt",
		className: "lg:order-2",
		height: 768,
		shellClassName: "lg:grid-cols-[0.58fr_0.42fr]",
		src: "/images/case-studies/relay/delivery-board.webp",
		width: 1512,
	},
	automate: {
		altKey: "groups.automate.imageAlt",
		className: "",
		height: 859,
		shellClassName: "lg:grid-cols-[0.42fr_0.58fr]",
		src: "/images/case-studies/morrow/agent-safe-answer.webp",
		width: 1600,
	},
};

interface OfferingCopy {
	description: string;
	icon: AnimatedIcon;
	title: string;
}

function OfferingLink({
	description,
	icon,
	offering,
	title,
}: {
	description: string;
	icon: AnimatedIcon;
	offering: Offering;
	title: string;
}) {
	return (
		<Link
			className="surface-card group flex min-h-[180px] flex-col p-5 outline-none transition-colors hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring/50 md:p-6"
			href={{
				pathname: "/services/[slug]",
				params: { slug: offering.slug },
			}}
		>
			<div className="flex items-start justify-between gap-4">
				<CardHoverIcon
					className="shrink-0 text-brand-icon"
					icon={icon}
					size={20}
				/>
				<ArrowRight className="h-4 w-4 shrink-0 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
			</div>
			<H3 className="mt-5 text-base">{title}</H3>
			<Muted className="mt-3 line-clamp-3 leading-relaxed">{description}</Muted>
		</Link>
	);
}

function GroupImage({
	alt,
	className,
	height,
	src,
	width,
}: {
	alt: string;
	className?: string;
	height: number;
	src: string;
	width: number;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn("surface-card media-frame relative self-center", className)}
		>
			<Image
				alt={alt}
				className="h-auto w-full"
				height={height}
				quality={100}
				sizes="(min-width: 1024px) 42vw, 100vw"
				src={src}
				width={width}
			/>
		</div>
	);
}

function ServiceGroupSection({
	getCopy,
	group,
	t,
}: {
	getCopy: (offering: Offering) => OfferingCopy;
	group: OfferingGroup;
	t: (key: string) => string;
}) {
	const visual = groupVisuals[group.key];

	return (
		<section
			aria-labelledby={`services-${group.key}-heading`}
			className={cn(
				group.key !== "launch" && "border-grid-line border-t pt-9 md:pt-12"
			)}
			id={`services-${group.key}`}
		>
			<div>
				{group.key !== "launch" && (
					<Caption className="mb-3 block text-brand-readable">
						{t(`groups.${group.key}.title`)}
					</Caption>
				)}
				<H2
					className="max-w-[980px] text-balance md:text-4xl"
					id={`services-${group.key}-heading`}
				>
					{t(`groups.${group.key}.description`)}
				</H2>
			</div>

			<div
				className={cn(
					"mt-7 grid gap-5 lg:items-stretch",
					visual.shellClassName
				)}
			>
				<GroupImage
					alt={t(visual.altKey)}
					className={visual.className}
					height={visual.height}
					src={visual.src}
					width={visual.width}
				/>
				<div
					className={cn(
						"grid gap-5 md:grid-cols-2",
						group.key === "operate" && "lg:order-1"
					)}
				>
					{group.items.map((offering) => {
						const copy = getCopy(offering);

						return (
							<OfferingLink
								description={copy.description}
								icon={copy.icon}
								key={offering.slug}
								offering={offering}
								title={copy.title}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default async function Services() {
	const [t, tc] = await Promise.all([
		getTranslations("services"),
		getTranslations("customSystems"),
	]);
	const getCopy = (offering: Offering) => {
		const translationKey = getOfferingTranslationKey(offering);

		return {
			description:
				offering.kind === "service"
					? t(`${translationKey}.tagline`)
					: tc(`items.${translationKey}.description`),
			icon: getOfferingIcon(offering),
			title:
				offering.kind === "service"
					? t(`${translationKey}.title`)
					: tc(`items.${translationKey}.title`),
		};
	};

	return (
		<SectionWrapper className="md:py-32" id="services">
			<StaggerChildren className="space-y-12 md:space-y-16">
				{offeringGroups.map((group) => (
					<ServiceGroupSection
						getCopy={getCopy}
						group={group}
						key={group.key}
						t={t}
					/>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
