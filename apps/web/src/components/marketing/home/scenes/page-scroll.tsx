import Image from "next/image";

import "./page-scroll.css";

/** A site's whole page inside a card, scrolled the way a visitor scrolls it:
 * a stretch at a time with a pause to read, a longer look at the end, then
 * back to the top. `width` and `height` are the screenshot's own size. */
export default function PageScroll({
	height,
	sizes,
	src,
	width,
}: {
	height: number;
	sizes: string;
	src: string;
	width: number;
}) {
	return (
		<div className="ps absolute inset-0 overflow-hidden">
			<div
				className="absolute inset-x-0 top-0 ps-page"
				style={{ aspectRatio: `${width} / ${height}` }}
			>
				<Image alt="" className="object-cover" fill sizes={sizes} src={src} />
			</div>
		</div>
	);
}
