"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CaseStudyImageAction } from "@/components/marketing/case-study-image-action";
import CaseStudyLightbox from "./case-study-lightbox";

interface CaseStudyGalleryProps {
	alt: string;
	/** Alt texts in the order of `images`; `alt` covers the rest. */
	alts?: string[];
	images?: string[];
	/** Which view each picture shows, set under it. */
	labels?: string[];
}

export default function CaseStudyGallery({
	images,
	alt,
	alts,
	labels,
}: CaseStudyGalleryProps) {
	const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
	const t = useTranslations("caseStudies");

	if (!images || images.length === 0) {
		return null;
	}

	const items = images.slice(0, 3);

	return (
		<>
			<div className="grid gap-x-6 gap-y-6 md:grid-cols-3">
				{items.map((src, i) => (
					<figure className="m-0" key={src}>
						<button
							aria-label={`${t("expandImage")}: ${alts?.[i] ?? `${alt} - screenshot ${i + 1}`}`}
							className="group relative aspect-[1512/768] w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-card outline-none ring-1 ring-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
							onClick={() => setLightboxSrc(src)}
							type="button"
						>
							<Image
								alt={alts?.[i] ?? `${alt} - screenshot ${i + 1}`}
								className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
								decoding="async"
								fill
								loading="lazy"
								quality={95}
								sizes="(max-width: 768px) 100vw, (max-width: 1320px) 33vw, 420px"
								src={src}
							/>
							<CaseStudyImageAction />
						</button>
						{labels?.[i] && (
							<figcaption className="mt-2.5 text-muted-foreground text-sm">
								{labels[i]}
							</figcaption>
						)}
					</figure>
				))}
			</div>

			{lightboxSrc && (
				<CaseStudyLightbox
					alt={alts?.[items.indexOf(lightboxSrc)] ?? alt}
					onOpenChange={(open) => !open && setLightboxSrc(null)}
					open={!!lightboxSrc}
					src={lightboxSrc}
				/>
			)}
		</>
	);
}
