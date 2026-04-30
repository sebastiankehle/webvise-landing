"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from "@/components/ui/dialog";

interface CaseStudyLightboxProps {
	alt: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	src: string;
}

export default function CaseStudyLightbox({
	open,
	onOpenChange,
	src,
	alt,
}: CaseStudyLightboxProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogPortal>
				<DialogOverlay className="bg-black/90 backdrop-blur-sm" />
				<DialogContent
					className="data-open:zoom-in-100 data-closed:zoom-out-100 fixed inset-0 mx-auto max-w-3xl translate-x-0 translate-y-0 overflow-y-auto overscroll-contain bg-transparent p-0 ring-0 sm:inset-6 sm:max-w-3xl"
					showCloseButton={false}
				>
					<DialogTitle className="sr-only">{alt}</DialogTitle>
					<Image
						alt={alt}
						className="h-auto w-full"
						height={7150}
						quality={100}
						sizes="(max-width: 768px) 100vw, 768px"
						src={src}
						unoptimized
						width={3024}
					/>
				</DialogContent>
				<DialogClose
					render={
						<button
							className="fixed top-4 right-4 z-[60] flex size-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white sm:top-3 sm:right-3"
							type="button"
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
