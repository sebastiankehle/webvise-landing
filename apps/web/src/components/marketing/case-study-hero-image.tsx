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
				className={`surface-card group relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${clickable ? "cursor-zoom-in" : "cursor-default"}`}
				disabled={!clickable}
				onClick={() => clickable && setOpen(true)}
				type="button"
			>
				<Image
					alt={alt}
					className="h-auto w-full transition-opacity group-hover:opacity-90"
					height={766}
					priority
					quality={95}
					sizes="(max-width: 768px) 100vw, 880px"
					src={src}
					width={1512}
				/>
				{clickable && (
					<CaseStudyImageAction
						clickLabel={t("expandImage")}
						tapLabel={t("tapImage")}
					/>
				)}
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
