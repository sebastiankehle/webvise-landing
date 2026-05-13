"use client";

import { ExpandIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Body, Caption } from "@/components/ui/typography";
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

	if (!images || images.length === 0) {
		return null;
	}

	const items = images.slice(0, 3);

	return (
		<>
			<div className="grid items-start gap-3 md:grid-cols-3">
				{items.map((src, i) => (
					<button
						className="group relative cursor-zoom-in overflow-hidden border border-border/40"
						key={src}
						onClick={() => setLightboxSrc(src)}
						type="button"
					>
						<Image
							alt={`${alt} – screenshot ${i + 1}`}
							className="block h-auto w-full transition-opacity group-hover:opacity-90"
							decoding="async"
							height={766}
							loading="lazy"
							quality={95}
							sizes="(max-width: 768px) 100vw, (max-width: 1320px) 33vw, 440px"
							src={src}
							width={1512}
						/>
						<span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
							<Body className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-foreground text-sm ring-1 ring-border/40 backdrop-blur-sm">
								<ExpandIcon className="size-4" />
								Click to expand
							</Body>
						</span>
						<Caption className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-muted-foreground ring-1 ring-border/40 backdrop-blur-sm sm:hidden">
							<ExpandIcon className="size-3.5" />
							Tap to expand
						</Caption>
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
