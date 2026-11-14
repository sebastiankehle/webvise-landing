"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";

const DEBOUNCE_MS = 300;

/** Filters the blog list as the visitor types. A plain GET form underneath
 * keeps search working without script. */
export function BlogSearch({
	label,
	search,
	topic,
}: {
	label: string;
	search: string;
	topic?: string;
}) {
	const router = useRouter();
	const [value, setValue] = useState(search);
	const pushed = useRef(search);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	// A query this field did not send came from a link ("Show all articles")
	// or the back button, so show it.
	useEffect(() => {
		if (search !== pushed.current) {
			pushed.current = search;
			setValue(search);
		}
	}, [search]);

	useEffect(() => () => clearTimeout(timer.current), []);

	const apply = (next: string) => {
		clearTimeout(timer.current);
		const q = next.trim().slice(0, 80);
		if (q === pushed.current) {
			return;
		}
		pushed.current = q;
		router.replace(
			{
				pathname: "/blog",
				query: { ...(topic ? { topic } : {}), ...(q ? { q } : {}) },
			},
			{ scroll: false }
		);
	};

	return (
		<form
			className="relative w-full sm:w-64"
			onSubmit={(event) => {
				event.preventDefault();
				apply(value);
			}}
		>
			{topic && <input name="topic" type="hidden" value={topic} />}
			<label className="sr-only" htmlFor="blog-search">
				{label}
			</label>
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<input
				className="h-10 w-full rounded-sm bg-card pr-3 pl-10 text-base text-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.12)] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--ring)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
				id="blog-search"
				name="q"
				onChange={(event) => {
					const next = event.target.value;
					setValue(next);
					clearTimeout(timer.current);
					timer.current = setTimeout(() => apply(next), DEBOUNCE_MS);
				}}
				placeholder={label}
				type="search"
				value={value}
			/>
		</form>
	);
}
