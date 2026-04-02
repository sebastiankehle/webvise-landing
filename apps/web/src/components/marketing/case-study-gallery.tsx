interface CaseStudyGalleryProps {
	images?: string[];
	alt: string;
}

export default function CaseStudyGallery({
	images,
	alt,
}: CaseStudyGalleryProps) {
	if (!images || images.length === 0) return null;

	const items = images.slice(0, 3);

	return (
		<div className="grid items-start gap-3 md:grid-cols-3">
			{items.map((src, i) => (
				<div
					key={src}
					className="overflow-hidden border border-border/40"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={src}
						alt={`${alt} – screenshot ${i + 1}`}
						className="block h-auto w-full"
						loading="lazy"
						decoding="async"
					/>
				</div>
			))}
		</div>
	);
}
