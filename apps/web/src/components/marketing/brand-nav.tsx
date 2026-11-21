"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface BrandNavItem {
	id: string;
	label: string;
}

/** The section bar under the header. It marks the section in view with a line
 * that slides to it, and keeps that link in sight when the bar scrolls. */
export function BrandNav({
	items,
	label,
}: {
	items: readonly BrandNavItem[];
	label: string;
}) {
	const [active, setActive] = useState<string | null>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const lineRef = useRef<HTMLLIElement>(null);

	// The section that crosses a band just below the bar is the current one.
	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") {
			return;
		}
		const sections = items
			.map(({ id }) => document.getElementById(id))
			.filter((node): node is HTMLElement => node !== null);
		const visible = new Map<string, boolean>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					visible.set(entry.target.id, entry.isIntersecting);
				}
				const first = items.find(({ id }) => visible.get(id));
				setActive(first ? first.id : null);
			},
			{ rootMargin: "-140px 0px -55% 0px" }
		);
		for (const section of sections) {
			observer.observe(section);
		}
		return () => observer.disconnect();
	}, [items]);

	// Move the line under the current link, and scroll the bar to show it.
	useLayoutEffect(() => {
		const list = listRef.current;
		const line = lineRef.current;
		if (!(list && line)) {
			return;
		}
		const link = active
			? list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`)
			: null;
		if (!link) {
			line.style.opacity = "0";
			return;
		}
		line.style.opacity = "1";
		line.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
		const { scrollLeft, clientWidth } = list;
		if (
			link.offsetLeft < scrollLeft ||
			link.offsetLeft + link.offsetWidth > scrollLeft + clientWidth
		) {
			list.scrollTo({ left: link.offsetLeft - 24, behavior: "smooth" });
		}
	}, [active]);

	return (
		<nav
			aria-label={label}
			className="sticky top-16 z-40 border-grid-line border-b bg-background lg:top-[72px]"
		>
			<div className="relative mx-auto max-w-[1320px] px-6">
				<ul
					className="relative flex h-12 items-center gap-6 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					ref={listRef}
				>
					{items.map(({ id, label: text }) => (
						<li className="shrink-0" key={id}>
							<a
								aria-current={active === id ? "location" : undefined}
								className={cn(
									"block py-3 outline-none transition-colors duration-150 focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4",
									active === id
										? "text-foreground"
										: "text-muted-foreground hover:text-foreground"
								)}
								href={`#${id}`}
							>
								{text}
							</a>
						</li>
					))}
					<li
						aria-hidden="true"
						className="pointer-events-none absolute bottom-0 left-0 h-px w-px origin-left bg-foreground opacity-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
						ref={lineRef}
					/>
				</ul>
			</div>
		</nav>
	);
}
