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

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const t = useTranslations("faq");

	return (
		<SectionWrapper id="faq" alternate>
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-8 max-w-3xl border border-border/40">
				{faqItems.map((item, i) => {
					const isOpen = openIndex === i;
					return (
						<div
							key={item.key}
							className="[&:not(:last-child)]:border-border/40 [&:not(:last-child)]:border-b"
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
