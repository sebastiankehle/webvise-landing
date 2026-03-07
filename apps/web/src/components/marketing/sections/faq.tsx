"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";

const faqItems = [
	{ key: "0", category: "general" },
	{ key: "1", category: "general" },
	{ key: "2", category: "technical" },
	{ key: "3", category: "technical" },
	{ key: "4", category: "general" },
	{ key: "5", category: "general" },
	{ key: "6", category: "investment" },
	{ key: "7", category: "investment" },
	{ key: "8", category: "general" },
];

const categories = [
	{ key: "all", label: "All" },
	{ key: "general", label: "General" },
	{ key: "technical", label: "Technical" },
	{ key: "investment", label: "Investment" },
];

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [activeCategory, setActiveCategory] = useState("all");
	const t = useTranslations("faq");

	const filtered =
		activeCategory === "all"
			? faqItems
			: faqItems.filter((item) => item.category === activeCategory);

	return (
		<SectionWrapper id="faq" alternate>
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-8 flex gap-2" role="group" aria-label="Filter questions by category">
				{categories.map((cat) => (
					<button
						key={cat.key}
						type="button"
						aria-pressed={activeCategory === cat.key}
						onClick={() => {
							setActiveCategory(cat.key);
							setOpenIndex(null);
						}}
						className={`border px-3 py-1.5 text-sm transition-colors ${
							activeCategory === cat.key
								? "border-foreground bg-foreground text-background"
								: "border-border/40 text-muted-foreground hover:text-foreground"
						}`}
					>
						{cat.label}
					</button>
				))}
			</div>
			<div className="mt-6 max-w-3xl border border-border/40">
				{filtered.map((item, i) => {
					const isOpen = openIndex === i;
					return (
						<div
							key={item.key}
							className={`transition-colors [&:not(:last-child)]:border-border/40 [&:not(:last-child)]:border-b ${isOpen ? "bg-brand/[0.03]" : ""}`}
						>
							<button
								type="button"
								className="flex w-full items-center justify-between px-6 py-5 text-left"
								onClick={() => setOpenIndex(isOpen ? null : i)}
								aria-expanded={isOpen}
							>
								<span className="flex-1 font-medium text-sm">
									{t(`items.${item.key}.question`)}
								</span>
								<span
									aria-hidden="true"
									className={`ml-4 transition-all duration-200 ${isOpen ? "rotate-45 text-brand" : "text-muted-foreground/50"}`}
								>
									+
								</span>
							</button>
							<div
								className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
							>
								<div className="overflow-hidden">
									<p className="px-6 pb-5 font-light text-muted-foreground text-sm leading-relaxed">
										{t(`items.${item.key}.answer`)}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</SectionWrapper>
	);
}
