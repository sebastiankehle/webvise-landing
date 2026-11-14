import type { RefObject } from "react";
import { useEffect, useState } from "react";

/** True while the element is on screen. Stays true when the browser has no
 * IntersectionObserver. Starts false on the server and in the browser alike,
 * so the first render matches the server HTML. */
export function useInView<T extends Element>(
	ref: RefObject<T | null>,
	options?: IntersectionObserverInit
): boolean {
	const [inView, setInView] = useState(false);
	const threshold = options?.threshold;
	const rootMargin = options?.rootMargin;

	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}
		const node = ref.current;
		if (!node) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				const last = entries.at(-1);
				if (last) {
					setInView(last.isIntersecting);
				}
			},
			{ rootMargin, threshold }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [ref, rootMargin, threshold]);

	return inView;
}
