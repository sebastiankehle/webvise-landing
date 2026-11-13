import type { RefObject } from "react";
import { useEffect, useState } from "react";

/** True while the element is on screen. Stays true when the browser has no
 * IntersectionObserver. */
export function useInView<T extends Element>(
	ref: RefObject<T | null>,
	options?: IntersectionObserverInit
): boolean {
	const [inView, setInView] = useState(
		() => typeof IntersectionObserver === "undefined"
	);
	const threshold = options?.threshold;
	const rootMargin = options?.rootMargin;

	useEffect(() => {
		const node = ref.current;
		if (!node || typeof IntersectionObserver === "undefined") {
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
