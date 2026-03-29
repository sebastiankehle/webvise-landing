"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";

const faqItems = [
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
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
			aria-hidden="true"
		>
			<path
				d="M4 6L8 10L12 6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const t = useTranslations("faq");

	return (
		<SectionWrapper id="faq">
			<div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
				<div>
					<h2 className="font-display text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
				</div>
				<div>
					{faqItems.map((item, i) => {
						const isOpen = openIndex === i;
						return (
							<div
								key={item.key}
								className={`border-border/40 border-b transition-colors duration-200 ${isOpen ? "border-l-2 border-l-brand" : "border-l-2 border-l-transparent"}`}
							>
								<button
									type="button"
									className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-150 hover:bg-muted/30"
									onClick={() => setOpenIndex(isOpen ? null : i)}
									aria-expanded={isOpen}
								>
									<span className="flex-1 text-[15px] leading-snug">
										{t(`items.${item.key}.question`)}
									</span>
									<span
										className={`ml-4 ${isOpen ? "text-brand" : "text-muted-foreground/50"}`}
									>
										<ChevronIcon open={isOpen} />
									</span>
								</button>
								<div
									className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
								>
									<div className="overflow-hidden">
										<p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
											{t(`items.${item.key}.answer`)}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</SectionWrapper>
	);
}
