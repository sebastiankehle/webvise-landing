"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import {
	Dialog,
	DialogClose,
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
					showCloseButton={false}
					className="fixed inset-0 sm:inset-6 max-w-3xl mx-auto translate-x-0 translate-y-0 overflow-y-auto overscroll-contain bg-transparent p-0 ring-0 sm:max-w-3xl data-open:zoom-in-100 data-closed:zoom-out-100"
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
				<DialogClose
					render={
						<button
							type="button"
							className="fixed top-4 right-4 z-[60] flex size-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:top-3 sm:right-3"
						/>
					}
				>
					<XIcon className="size-5" />
					<span className="sr-only">Close</span>
				</DialogClose>
			</DialogPortal>
		</Dialog>
	);
}
