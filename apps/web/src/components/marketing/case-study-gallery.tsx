"use client";

import { ExpandIcon } from "lucide-react";
import { useState } from "react";
import CaseStudyLightbox from "./case-study-lightbox";

interface CaseStudyGalleryProps {
	images?: string[];
	alt: string;
}

export default function CaseStudyGallery({
	images,
	alt,
}: CaseStudyGalleryProps) {
	const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

	if (!images || images.length === 0) return null;

	const items = images.slice(0, 3);

	return (
		<>
			<div className="grid items-start gap-3 md:grid-cols-3">
				{items.map((src, i) => (
					<button
						key={src}
						type="button"
						onClick={() => setLightboxSrc(src)}
						className="group relative cursor-zoom-in overflow-hidden border border-border/40"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={src}
							alt={`${alt} – screenshot ${i + 1}`}
							className="block h-auto w-full transition-opacity group-hover:opacity-90"
							loading="lazy"
							decoding="async"
						/>
						<span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
							<span className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm text-foreground ring-1 ring-border/40 backdrop-blur-sm">
								<ExpandIcon className="size-4" />
								Click to expand
							</span>
						</span>
						<span className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border/40 backdrop-blur-sm sm:hidden">
							<ExpandIcon className="size-3.5" />
							Tap to expand
						</span>
					</button>
				))}
			</div>

			{lightboxSrc && (
				<CaseStudyLightbox
					open={!!lightboxSrc}
					onOpenChange={(open) => !open && setLightboxSrc(null)}
					src={lightboxSrc}
					alt={alt}
				/>
			)}
		</>
	);
}
