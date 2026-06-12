"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CaseStudyImageAction } from "@/components/marketing/case-study-image-action";
import CaseStudyLightbox from "./case-study-lightbox";

interface CaseStudyGalleryProps {
	alt: string;
	images?: string[];
}

export default function CaseStudyGallery({
	images,
	alt,
}: CaseStudyGalleryProps) {
	const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
	const t = useTranslations("caseStudies");

	if (!images || images.length === 0) {
		return null;
	}

	const items = images.slice(0, 3);

	return (
		<>
			<div className="grid gap-5 md:grid-cols-3">
				{items.map((src, i) => (
					<button
						aria-label={t("expandImage")}
						className="surface-card media-frame group relative min-h-[220px] cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:min-h-[260px]"
						key={src}
						onClick={() => setLightboxSrc(src)}
						type="button"
					>
						<Image
							alt={`${alt} - screenshot ${i + 1}`}
							className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
							decoding="async"
							fill
							loading="lazy"
							quality={95}
							sizes="(max-width: 768px) 100vw, (max-width: 1320px) 33vw, 420px"
							src={src}
						/>
						<CaseStudyImageAction />
					</button>
				))}
			</div>

			{lightboxSrc && (
				<CaseStudyLightbox
					alt={alt}
					onOpenChange={(open) => !open && setLightboxSrc(null)}
					open={!!lightboxSrc}
					src={lightboxSrc}
				/>
			)}
		</>
	);
}
