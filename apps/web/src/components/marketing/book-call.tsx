"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Caption,
	H3,
	inlineLinkClassName,
	Muted,
} from "@/components/ui/typography";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const CAL_NAMESPACE = "book";
const CAL_LINK = "webvise/30min";

const fitItems = ["offer", "decision", "project"] as const;
type FitItem = (typeof fitItems)[number];

const interestKeys = ["launch", "operate", "automate"] as const;

export default function BookCall() {
	const [step, setStep] = useState<"fit" | "calendar">("fit");
	const [checked, setChecked] = useState<Record<FitItem, boolean>>({
		offer: false,
		decision: false,
		project: false,
	});
	const [interests, setInterests] = useState<string[]>([]);
	const t = useTranslations("book");
	const ts = useTranslations("services");
	const locale = useLocale();
	const { resolvedTheme } = useTheme();

	const allConfirmed = fitItems.every((item) => checked[item]);

	useEffect(() => {
		if (step !== "calendar") {
			return;
		}
		(async () => {
			const cal = await getCalApi({ namespace: CAL_NAMESPACE });
			cal("ui", { hideEventTypeDetails: false });
			cal("on", {
				action: "bookingSuccessful",
				callback: () => track("book_call_booked"),
			});
		})();
	}, [step]);

	const interestLabels = [
		...interestKeys.map((key) => ({
			key,
			label: ts(`groups.${key}.title`),
		})),
		{ key: "other", label: t("interest.somethingElse") },
	];

	const toggleInterest = (key: string) => {
		setInterests((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	};

	const showCalendar = () => {
		track("book_fit_confirmed", {
			interests: interests.join(",") || null,
		});
		setStep("calendar");
	};

	const selectedInterestLabels = interestLabels
		.filter(({ key }) => interests.includes(key))
		.map(({ label }) => label);

	if (step === "calendar") {
		return (
			<section
				aria-label={t("calendar.title")}
				className="fade-in slide-in-from-bottom-2 mt-14 animate-in duration-300 ease-out motion-reduce:animate-none md:mt-20"
			>
				<button
					className="flex items-center gap-1.5 text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50"
					onClick={() => setStep("fit")}
					type="button"
				>
					<ArrowLeft aria-hidden="true" className="size-3.5" />
					{t("calendar.back")}
				</button>
				<Muted className="mt-4">{t("calendar.subtitle")}</Muted>
				<div className="mt-6 min-h-[620px]">
					<Cal
						calLink={CAL_LINK}
						config={{
							layout: "month_view",
							theme: resolvedTheme === "dark" ? "dark" : "light",
							...(selectedInterestLabels.length > 0 && {
								notes: `${t("interest.label")} ${selectedInterestLabels.join(", ")}`,
							}),
						}}
						namespace={CAL_NAMESPACE}
						style={{ width: "100%", height: "100%" }}
					/>
				</div>
			</section>
		);
	}

	return (
		<div className="fade-in slide-in-from-bottom-2 mt-14 max-w-3xl animate-in duration-300 ease-out motion-reduce:animate-none md:mt-20">
			<section aria-label={t("fit.title")} className="surface-card p-6 md:p-10">
				<H3>{t("fit.title")}</H3>
				<Muted className="mt-2">{t("fit.subtitle")}</Muted>

				<div className="mt-8 space-y-7">
					{fitItems.map((item) => (
						<label
							className="group flex cursor-pointer items-start gap-4"
							htmlFor={`fit-${item}`}
							key={item}
						>
							<Checkbox
								checked={checked[item]}
								className="mt-0.5"
								id={`fit-${item}`}
								onCheckedChange={(value) =>
									setChecked((prev) => ({ ...prev, [item]: value === true }))
								}
							/>
							<span>
								<span className="block font-medium text-foreground text-sm leading-6">
									{t(`fit.items.${item}.label`)}
								</span>
								<Muted className="mt-1">
									{item === "offer" ? (
										<>
											{t("fit.items.offer.descriptionBeforeLink")}{" "}
											<a
												className={inlineLinkClassName}
												href={homepageSectionHref("services", locale)}
											>
												{t("fit.items.offer.descriptionLink")}
											</a>{" "}
											{t("fit.items.offer.descriptionAfterLink")}
										</>
									) : (
										t(`fit.items.${item}.description`)
									)}
								</Muted>
							</span>
						</label>
					))}
				</div>

				<div className="mt-10 border-border/60 border-t pt-8">
					<div className="flex items-baseline gap-2">
						<span className="font-medium text-foreground text-sm">
							{t("interest.label")}
						</span>
						<Caption>({t("interest.optional")})</Caption>
					</div>
					<div className="mt-4 flex flex-wrap gap-2.5">
						{interestLabels.map(({ key, label }) => {
							const selected = interests.includes(key);
							return (
								<button
									aria-pressed={selected}
									className={cn(
										"border px-3.5 py-2 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
										selected
											? "border-primary bg-primary text-primary-foreground"
											: "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
									)}
									key={key}
									onClick={() => toggleInterest(key)}
									type="button"
								>
									{label}
								</button>
							);
						})}
					</div>
				</div>

				<Button
					className="mt-10"
					disabled={!allConfirmed}
					onClick={showCalendar}
					size="lg"
					variant="brand"
				>
					{t("continue")}
					<ArrowRight aria-hidden="true" className="size-4" />
				</Button>
			</section>

			<Muted className="mt-6">
				{t("aside.altTitle")} {t("aside.altText")}{" "}
				<a
					className={inlineLinkClassName}
					href={homepageSectionHref("contact", locale)}
				>
					{t("aside.altCta")}
				</a>
			</Muted>
		</div>
	);
}
