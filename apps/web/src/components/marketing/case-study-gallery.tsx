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
			<div className="grid items-start gap-5 md:grid-cols-3">
				{items.map((src, i) => (
					<button
						className="surface-card group relative cursor-zoom-in overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
						key={src}
						onClick={() => setLightboxSrc(src)}
						type="button"
					>
						<Image
							alt={`${alt} - screenshot ${i + 1}`}
							className="block h-auto w-full transition-opacity group-hover:opacity-90"
							decoding="async"
							height={766}
							loading="lazy"
							quality={95}
							sizes="(max-width: 768px) 100vw, (max-width: 1320px) 33vw, 440px"
							src={src}
							width={1512}
						/>
						<CaseStudyImageAction
							clickLabel={t("expandImage")}
							tapLabel={t("tapImage")}
						/>
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
