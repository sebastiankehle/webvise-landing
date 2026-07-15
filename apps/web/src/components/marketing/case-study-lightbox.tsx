"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { marketingSurfaceClassName } from "@/components/marketing/section-wrapper";
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

const imageDimensions: Record<string, { height: number; width: number }> = {
	"/images/case-studies/keel/fullpage.webp": { height: 9349, width: 1512 },
	"/images/case-studies/morrow/fullpage.webp": { height: 8131, width: 1600 },
	"/images/case-studies/mp-bau-construction/fullpage.webp": {
		height: 7061,
		width: 1511,
	},
	"/images/case-studies/ohyp-fintech/fullpage.webp": {
		height: 4594,
		width: 1600,
	},
	"/images/case-studies/old-world-labs/fullpage.webp": {
		height: 3575,
		width: 1512,
	},
	"/images/case-studies/rautenberg-pitch-engine/fullpage.webp": {
		height: 2772,
		width: 1512,
	},
	"/images/case-studies/relay/fullpage.webp": { height: 6037, width: 1512 },
	"/images/case-studies/webvise/fullpage.png": { height: 17_317, width: 1512 },
};

export default function CaseStudyLightbox({
	open,
	onOpenChange,
	src,
	alt,
}: CaseStudyLightboxProps) {
	const t = useTranslations("caseStudies");
	const dimensions = imageDimensions[src] ?? { height: 7150, width: 3024 };

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogPortal>
				<DialogOverlay
					className={`${marketingSurfaceClassName("inverted")} bg-background/90 backdrop-blur-sm`}
				/>
				<DialogContent
					className="data-open:zoom-in-97 data-closed:zoom-out-97 fixed inset-0 mx-auto max-w-3xl translate-x-0 translate-y-0 overflow-y-auto overscroll-contain bg-transparent p-0 ring-0 sm:inset-6 sm:max-w-3xl"
					showCloseButton={false}
				>
					<DialogTitle className="sr-only">{alt}</DialogTitle>
					<div className="flex min-h-full">
						<Image
							alt={alt}
							className="m-auto h-auto w-full"
							height={dimensions.height}
							quality={100}
							sizes="(max-width: 768px) 100vw, 768px"
							src={src}
							unoptimized
							width={dimensions.width}
						/>
					</div>
				</DialogContent>
				<DialogClose
					render={
						<button
							className={`${marketingSurfaceClassName("inverted")} fixed top-4 right-4 z-[60] flex size-10 items-center justify-center border border-border bg-card/80 text-foreground/80 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 sm:top-3 sm:right-3`}
							type="button"
						/>
					}
				>
					<XIcon className="size-5" />
					<span className="sr-only">{t("closeLightbox")}</span>
				</DialogClose>
			</DialogPortal>
		</Dialog>
	);
}
