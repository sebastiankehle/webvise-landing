"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { H2, Label, Lead, Muted } from "@/components/ui/typography";

const defaultFaqItems = [
	{ key: "0", category: "general" },
	{ key: "1", category: "general" },
	{ key: "2", category: "investment" },
	{ key: "3", category: "general" },
	{ key: "4", category: "technical" },
	{ key: "5", category: "technical" },
	{ key: "6", category: "general" },
	{ key: "7", category: "investment" },
	{ key: "8", category: "general" },
];

function ChevronIcon({ open }: { open: boolean }) {
	return (
		<svg
			aria-hidden="true"
			className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
			fill="none"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 6L8 10L12 6"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

/* ── Reusable FAQ accordion ──────────────────────────────── */

export interface FaqItem {
	answer: string;
	question: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div>
			{items.map((item, i) => {
				const isOpen = openIndex === i;
				return (
					<div
						className={`border-border/40 border-b transition-colors duration-200 ${isOpen ? "border-l-2 border-l-foreground" : "border-l-2 border-l-transparent"}`}
						key={item.question}
					>
						<button
							aria-expanded={isOpen}
							className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-150 hover:bg-muted/30"
							onClick={() => setOpenIndex(isOpen ? null : i)}
							type="button"
						>
							<Label className="flex-1 font-medium text-[15px] text-foreground leading-snug tracking-[-0.011em]">
								{item.question}
							</Label>
							<span
								className={`ml-4 ${isOpen ? "text-foreground" : "text-muted-foreground/50"}`}
							>
								<ChevronIcon open={isOpen} />
							</span>
						</button>
						<div
							className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
						>
							<div className="overflow-hidden">
								<Muted className="px-6 pb-6 leading-[1.65]">
									{item.answer}
								</Muted>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

/* ── Landing page FAQ section (default export) ───────────── */

export default function FAQ() {
	const t = useTranslations("faq");

	const items: FaqItem[] = defaultFaqItems.map((item) => ({
		question: t(`items.${item.key}.question`),
		answer: t(`items.${item.key}.answer`),
	}));

	return (
		<SectionWrapper id="faq">
			<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-4 max-w-[520px]">{t("subtitle")}</Lead>
				</div>
				<FaqAccordion items={items} />
			</div>
		</SectionWrapper>
	);
}
