import Image from "next/image";

import { cn } from "@/lib/utils";

import "./page-scroll.css";

/** A site's whole page inside a card, scrolled the way a visitor scrolls it:
 * a stretch at a time with a pause to read, a longer look at the end, then
 * back to the top. `width` and `height` are the screenshot's own size. A
 * `long` page takes seven stretches instead of four, so none of it rushes
 * past. */
export default function PageScroll({
	height,
	long = false,
	sizes,
	src,
	width,
}: {
	height: number;
	long?: boolean;
	sizes: string;
	src: string;
	width: number;
}) {
	return (
		<div className="ps absolute inset-0 overflow-hidden">
			<div
				className={cn("absolute inset-x-0 top-0 ps-page", long && "ps-long")}
				style={{ aspectRatio: `${width} / ${height}` }}
			>
				<Image alt="" className="object-cover" fill sizes={sizes} src={src} />
			</div>
		</div>
	);
}
