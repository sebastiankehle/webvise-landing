import Image from "next/image";

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
		<div className="grid gap-3 md:grid-cols-3">
			{items.map((src, i) => (
				<div
					key={src}
					className="relative aspect-[4/3] w-full overflow-hidden border border-border/40"
				>
					<Image
						src={src}
						alt={`${alt} – screenshot ${i + 1}`}
						fill
						className="object-cover object-top"
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				</div>
			))}
		</div>
	);
}
