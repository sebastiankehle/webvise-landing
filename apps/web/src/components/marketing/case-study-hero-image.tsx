"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CaseStudyImageAction } from "@/components/marketing/case-study-image-action";
import CaseStudyLightbox from "./case-study-lightbox";

interface CaseStudyHeroImageProps {
	alt: string;
	fullPageImage?: string;
	src: string;
}

export default function CaseStudyHeroImage({
	src,
	fullPageImage,
	alt,
}: CaseStudyHeroImageProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("caseStudies");
	const clickable = !!fullPageImage;

	return (
		<>
			<button
				aria-label={clickable ? t("expandImage") : undefined}
				className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:aspect-[1512/768] ${clickable ? "cursor-zoom-in" : "cursor-default"}`}
				disabled={!clickable}
				onClick={() => clickable && setOpen(true)}
				type="button"
			>
				<Image
					alt={alt}
					className="object-cover object-left-top"
					fill
					priority
					quality={90}
					sizes="(max-width: 1320px) 100vw, 1272px"
					src={src}
				/>
				{clickable && <CaseStudyImageAction />}
			</button>

			{fullPageImage && (
				<CaseStudyLightbox
					alt={alt}
					onOpenChange={setOpen}
					open={open}
					src={fullPageImage}
				/>
			)}
		</>
	);
}
