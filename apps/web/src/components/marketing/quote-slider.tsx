"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

/** Client quotes as a row that slides: swipe or scroll it, or step through
 * with the two buttons. A button rests once its end is reached. */
export function QuoteSlider({
	children,
	heading,
	next,
	previous,
}: {
	children: ReactNode;
	heading: ReactNode;
	next: string;
	previous: string;
}) {
	const track = useRef<HTMLUListElement>(null);
	const [ends, setEnds] = useState({ end: false, start: true });

	useEffect(() => {
		const el = track.current;
		if (!el) {
			return;
		}
		const read = () =>
			setEnds({
				end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
				start: el.scrollLeft < 8,
			});
		read();
		el.addEventListener("scroll", read, { passive: true });
		window.addEventListener("resize", read);
		return () => {
			el.removeEventListener("scroll", read);
			window.removeEventListener("resize", read);
		};
	}, []);

	// One card further; the track's own scroll behaviour decides the motion.
	const step = (direction: 1 | -1) => {
		const el = track.current;
		const card = el?.firstElementChild;
		if (!(el && card)) {
			return;
		}
		const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
		el.scrollBy({
			left: direction * (card.getBoundingClientRect().width + gap),
		});
	};

	return (
		<div>
			<div className="flex items-end justify-between gap-6">
				<div className="min-w-0">{heading}</div>
				<div className="flex flex-none gap-2">
					<Button
						aria-label={previous}
						disabled={ends.start}
						onClick={() => step(-1)}
						size="icon-lg"
						variant="outline"
					>
						<ChevronLeft aria-hidden="true" />
					</Button>
					<Button
						aria-label={next}
						disabled={ends.end}
						onClick={() => step(1)}
						size="icon-lg"
						variant="outline"
					>
						<ChevronRight aria-hidden="true" />
					</Button>
				</div>
			</div>
			<ul
				className="-mx-6 mt-8 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] motion-reduce:scroll-auto md:mt-10 [&::-webkit-scrollbar]:hidden"
				ref={track}
			>
				{children}
			</ul>
		</div>
	);
}
