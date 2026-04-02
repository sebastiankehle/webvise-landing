"use client";

import Image from "next/image";
import { useState } from "react";
import CaseStudyLightbox from "./case-study-lightbox";

interface CaseStudyHeroImageProps {
	src: string;
	fullPageImage?: string;
	alt: string;
}

export default function CaseStudyHeroImage({
	src,
	fullPageImage,
	alt,
}: CaseStudyHeroImageProps) {
	const [open, setOpen] = useState(false);
	const clickable = !!fullPageImage;

	return (
		<>
			<button
				type="button"
				disabled={!clickable}
				onClick={() => clickable && setOpen(true)}
				className={`w-full ${clickable ? "cursor-zoom-in" : "cursor-default"}`}
			>
				<Image
					src={src}
					alt={alt}
					width={1512}
					height={766}
					className="h-auto w-full border border-border/40"
					sizes="(max-width: 768px) 100vw, 880px"
					quality={90}
					priority
				/>
			</button>

			{fullPageImage && (
				<CaseStudyLightbox
					open={open}
					onOpenChange={setOpen}
					src={fullPageImage}
					alt={alt}
				/>
			)}
		</>
	);
}
