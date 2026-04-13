"use client";

import { ExpandIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Body, Caption } from "@/components/ui/typography";
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
				className={`group relative w-full ${clickable ? "cursor-zoom-in" : "cursor-default"}`}
			>
				<Image
					src={src}
					alt={alt}
					width={1512}
					height={766}
					className="h-auto w-full border border-border/40 transition-opacity group-hover:opacity-90"
					sizes="(max-width: 768px) 100vw, 880px"
					quality={90}
					priority
				/>
				{clickable && (
					<>
						<span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
							<Body className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-foreground text-sm ring-1 ring-border/40 backdrop-blur-sm">
								<ExpandIcon className="size-4" />
								Click to expand
							</Body>
						</span>
						<Caption className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-muted-foreground ring-1 ring-border/40 backdrop-blur-sm sm:hidden">
							<ExpandIcon className="size-3.5" />
							Tap to expand
						</Caption>
					</>
				)}
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
