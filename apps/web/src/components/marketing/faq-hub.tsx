"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { FaqItem } from "@/components/marketing/faq-list";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface FaqTopic {
	/** The group chip this topic sits under. */
	group: string;
	id: string;
	items: FaqItem[];
	/** The service page the topic belongs to, if any. */
	slug?: string;
	title: string;
}

const chip =
	"inline-flex h-9 items-center rounded-sm px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/70";

/** Every question on the site in one place: type to search, or pick a group. */
export default function FaqHub({
	groups,
	labels,
	topics,
}: {
	groups: { key: string; title: string }[];
	labels: {
		all: string;
		ask: string;
		empty: string;
		emptyCta: string;
		search: string;
	};
	topics: FaqTopic[];
}) {
	const [query, setQuery] = useState("");
	const [group, setGroup] = useState("all");

	// How many questions each chip holds, before any search narrows them
	const counts = useMemo(() => {
		const byGroup: Record<string, number> = { all: 0 };
		for (const topic of topics) {
			byGroup.all += topic.items.length;
			byGroup[topic.group] = (byGroup[topic.group] ?? 0) + topic.items.length;
		}
		return byGroup;
	}, [topics]);
	const searching = query.trim().length > 0;

	const shown = useMemo(() => {
		const needle = query.trim().toLowerCase();
		return topics
			.filter((topic) => group === "all" || topic.group === group)
			.map((topic) => ({
				...topic,
				items: needle
					? topic.items.filter((item) =>
							`${item.question} ${item.answer}`.toLowerCase().includes(needle)
						)
					: topic.items,
			}))
			.filter((topic) => topic.items.length > 0);
	}, [group, query, topics]);

	return (
		<div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
			<div className="lg:col-span-4">
				<div className="lg:sticky lg:top-28">
					<label className="relative block">
						<span className="sr-only">{labels.search}</span>
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<input
							className="h-11 w-full rounded-sm bg-card pr-3 pl-10 text-base text-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.12)] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--ring)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
							onChange={(event) => setQuery(event.target.value)}
							placeholder={labels.search}
							type="search"
							value={query}
						/>
					</label>
					<div className="mt-4 flex flex-wrap gap-2">
						{[{ key: "all", title: labels.all }, ...groups].map((entry) => (
							<button
								aria-pressed={group === entry.key}
								className={cn(
									chip,
									group === entry.key
										? "border border-foreground bg-foreground text-background"
										: "border border-foreground/15 text-foreground hover:bg-foreground/[0.06]"
								)}
								key={entry.key}
								onClick={() => setGroup(entry.key)}
								type="button"
							>
								{entry.title}
								<span className="ml-1.5 tabular-nums opacity-60">
									{counts[entry.key] ?? 0}
								</span>
							</button>
						))}
					</div>
					{/* For the question this page does not answer */}
					<p className="mt-8 max-w-[34ch] text-base text-muted-foreground leading-[1.6]">
						{labels.ask}{" "}
						<Link
							className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-foreground focus-visible:decoration-foreground"
							href="/book"
						>
							{labels.emptyCta}
						</Link>
					</p>
				</div>
			</div>

			<div aria-live="polite" className="lg:col-span-7 lg:col-start-6">
				{shown.length === 0 ? (
					<p className="text-base text-foreground/75 leading-[1.6]">
						{labels.empty}{" "}
						<Link
							className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
							href="/book"
						>
							{labels.emptyCta}
						</Link>
					</p>
				) : (
					<div className="grid gap-16">
						{shown.map((topic) => (
							<section aria-labelledby={`faq-${topic.id}`} key={topic.id}>
								<h2
									className="font-display text-2xl text-foreground leading-snug"
									id={`faq-${topic.id}`}
								>
									{topic.slug ? (
										<Link
											className="outline-none hover:underline hover:underline-offset-4 focus-visible:underline"
											href={{
												pathname: "/services/[slug]",
												params: { slug: topic.slug },
											}}
										>
											{topic.title}
										</Link>
									) : (
										topic.title
									)}
								</h2>
								{/* Answers fold away so the list can be scanned; a search
								    opens what it finds. The text stays in the page either way. */}
								<div className="mt-5 border-foreground/[0.08] border-t">
									{topic.items.map((item) => (
										<details
											className="group/q border-foreground/[0.08] border-b"
											key={item.question}
											open={searching || undefined}
										>
											<summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 font-display text-foreground text-lg leading-snug outline-none focus-visible:underline focus-visible:underline-offset-4 [&::-webkit-details-marker]:hidden">
												{item.question}
												<Plus
													aria-hidden="true"
													className="mt-1 size-4 flex-none text-foreground/45 transition-transform duration-200 group-open/q:rotate-45"
												/>
											</summary>
											<p className="max-w-[62ch] pb-5 text-base text-foreground/75 leading-[1.6]">
												{item.answer}
											</p>
										</details>
									))}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
