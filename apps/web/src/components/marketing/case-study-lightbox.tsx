"use client";

import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from "@/components/ui/dialog";

interface CaseStudyLightboxProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	src: string;
	alt: string;
}

export default function CaseStudyLightbox({
	open,
	onOpenChange,
	src,
	alt,
}: CaseStudyLightboxProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogPortal>
				<DialogOverlay className="bg-black/90 backdrop-blur-sm" />
				<DialogContent
					className="fixed inset-4 top-4 right-4 bottom-4 left-4 max-w-3xl mx-auto translate-x-0 translate-y-0 overflow-y-auto overscroll-contain bg-transparent p-0 ring-0 sm:max-w-3xl data-open:zoom-in-100 data-closed:zoom-out-100"
				>
					<DialogTitle className="sr-only">{alt}</DialogTitle>
					<Image
						src={src}
						alt={alt}
						width={3024}
						height={7150}
						className="w-full h-auto"
						quality={100}
						sizes="(max-width: 768px) 100vw, 768px"
						unoptimized
					/>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
