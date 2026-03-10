"use client";

import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ReportIssue {
	title: string;
	displayValue?: string;
	savingsMs?: number;
}

interface ReportVital {
	label: string;
	displayValue: string;
	score: number | null;
}

interface ReportData {
	url: string;
	mobile: { score: number };
	desktop: { score: number };
	issues: ReportIssue[];
	vitals?: ReportVital[];
	projectedScore: number;
	securityFlags: string[];
	migrationEstimate: { min: number; max: number };
}

function scoreColor(score: number | null) {
	if (score === null)
		return { text: "text-muted-foreground", stroke: "stroke-muted-foreground" };
	if (score >= 90)
		return { text: "text-green-500", stroke: "stroke-green-500" };
	if (score >= 50)
		return { text: "text-yellow-500", stroke: "stroke-yellow-500" };
	return { text: "text-red-500", stroke: "stroke-red-500" };
}

function ScoreRing({
	score,
	label,
	size = 72,
}: {
	score: number;
	label: string;
	size?: number;
}) {
	const radius = (size - 6) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (score / 100) * circumference;
	const { text, stroke } = scoreColor(score);

	return (
		<div className="flex flex-col items-center gap-1.5">
			<div className="relative" style={{ width: size, height: size }}>
				<svg
					width={size}
					height={size}
					className="-rotate-90"
					aria-hidden="true"
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={3}
						className="text-border"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						strokeWidth={3}
						strokeLinecap="butt"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						className={cn("transition-all duration-1000", stroke)}
					/>
				</svg>
				<span
					className={cn(
						"absolute inset-0 flex items-center justify-center font-medium text-base",
						text,
					)}
				>
					{score}
				</span>
			</div>
			<span className="text-muted-foreground text-xs">{label}</span>
		</div>
	);
}

function ReportResults({ data }: { data: ReportData }) {
	const t = useTranslations("wpHealthReport");

	return (
		<div>
			{/* Header */}
				<div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{t("results.title")}
					</h2>
					<p className="font-light text-muted-foreground text-sm">
						{t("results.resultsFor")}{" "}
						<span className="font-medium text-foreground">{data.url}</span>
					</p>
				</div>

				{/* Scores row */}
				<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-border/40">
					<div className="flex flex-col items-center justify-center p-4">
						<ScoreRing score={data.mobile.score} label={t("results.mobile")} />
					</div>
					<div className="flex flex-col items-center justify-center border-border/40 border-l p-4">
						<ScoreRing
							score={data.desktop.score}
							label={t("results.desktop")}
						/>
					</div>
				</div>

				{/* Projected score - visually separated */}
				<div className="mt-4 border-2 border-brand bg-brand/5 p-5">
					<p className="mb-3 text-center font-medium text-brand text-xs uppercase tracking-wider">
						{t("results.projectedLabel")}
					</p>
					<div className="flex justify-center">
						<ScoreRing
							score={data.projectedScore}
							label={t("results.afterNextjs")}
							size={88}
						/>
					</div>
					<p className="mt-3 text-center text-muted-foreground text-xs">
						{t("results.projectedHint")}
					</p>
				</div>

				{/* Core Web Vitals with explanations */}
				{data.vitals && data.vitals.length > 0 && (
					<div className="mt-px border border-border/40 border-t-0">
						<div className="border-border/40 border-b px-5 py-3">
							<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								{t("results.webVitalsTitle")}
							</h3>
							<p className="mt-1 text-muted-foreground text-xs">
								{t("results.webVitalsSubtitle")}
							</p>
						</div>
						<div className="divide-y divide-border/40">
							{data.vitals.map((vital) => {
								const { text } = scoreColor(vital.score);
								const explanationKey =
									`results.vitalExplanations.${vital.label}` as const;
								return (
									<div
										key={vital.label}
										className="flex items-start gap-4 px-5 py-3"
									>
										<div
											className="flex shrink-0 flex-col items-center gap-0.5"
											style={{ minWidth: 48 }}
										>
											<span className={cn("font-medium text-sm", text)}>
												{vital.displayValue}
											</span>
											<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
												{vital.label}
											</span>
										</div>
										<p className="font-light text-muted-foreground text-xs leading-relaxed">
											{t.has(explanationKey)
												? t(explanationKey)
												: t("results.vitalExplanations.default")}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Security flags - only show if present */}
				{data.securityFlags.length > 0 && (
					<div className="mt-px border border-border/40 border-t-0 p-5">
						<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
							{t("results.securityRisks")}
						</h3>
						<ul className="mt-3 space-y-2">
							{data.securityFlags.map((flag) => (
								<li
									key={flag}
									className="flex items-start gap-3 font-light text-sm"
								>
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
									<span className="text-foreground">{flag}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Migration estimate + CTA */}
				<div className="mt-px grid items-center gap-6 border border-border/40 border-t-2 border-t-brand p-6 md:grid-cols-[1fr_auto]">
					<div>
						<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
							{t("results.migrationEstimate")}
						</h3>
						<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
							{t.rich("results.migrationText", {
								strong: (chunks) => (
									<span className="font-medium text-foreground">{chunks}</span>
								),
								min: data.migrationEstimate.min.toLocaleString(),
								max: data.migrationEstimate.max.toLocaleString(),
							})}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
							render={
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								<a
									href="https://cal.com/webvise"
									target="_blank"
									rel="noopener noreferrer"
								/>
							}
						>
							{t("results.bookCall")}
						</Button>
						<Button
							variant="outline"
							render={<Link href={{ pathname: "/", hash: "contact" }} />}
						>
							{t("results.getInTouch")}
						</Button>
					</div>
				</div>
		</div>
	);
}

function isValidUrl(value: string): boolean {
	const normalized = value.startsWith("http") ? value : `https://${value}`;
	try {
		const parsed = new URL(normalized);
		return parsed.hostname.includes(".");
	} catch {
		return false;
	}
}

export default function WpHealthReport() {
	const t = useTranslations("wpHealthReport");
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [report, setReport] = useState<ReportData | null>(null);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		defaultValues: {
			url: "",
			email: "",
			firstName: "",
		},
		validators: {
			onSubmit: z.object({
				url: z.string().min(1, t("errors.urlRequired")),
				email: z.email(t("errors.emailInvalid")),
				firstName: z.string(),
			}),
		},
		onSubmit: async ({ value }) => {
			setErrorMessage("");
			setSubmitStatus("idle");

			let url = value.url.trim();
			if (!url.startsWith("http")) {
				url = `https://${url}`;
			}

			try {
				const res = await fetch("/api/wp-health-report", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						url,
						email: value.email.trim(),
						firstName: value.firstName,
					}),
				});

				if (res.ok) {
					const result = await res.json();
					setReport(result);
					setSubmitStatus("success");
				} else {
					const err = await res.json().catch(() => null);
					setErrorMessage(err?.error || t("errors.analyzeFailed"));
					setSubmitStatus("error");
				}
			} catch {
				setErrorMessage(t("errors.networkError"));
				setSubmitStatus("error");
			}
		},
	});

	return (
		<section id="wp-health-report" className="py-16 md:py-32">
			<div className="mx-auto max-w-[1200px] px-6">
				{submitStatus !== "success" ? (
					<>
					<div>
						<div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
								<div>
									<h1 className="font-normal text-3xl leading-[1.15] tracking-tight md:text-[48px]">
										{t.rich("hero.title", {
											brand: (chunks) => (
												<span className="text-brand">{chunks}</span>
											),
										})}
									</h1>
									<p className="mt-4 font-light text-lg text-muted-foreground leading-relaxed">
										{t("hero.subtitle")}
									</p>

									<ul className="mt-6 space-y-2">
										{[0, 1, 2, 3].map((i) => (
											<li key={i} className="flex items-start gap-3 text-sm">
												<span className="mt-1 h-1.5 w-1.5 shrink-0 bg-brand" />
												<span>{t(`hero.benefits.${i}`)}</span>
											</li>
										))}
									</ul>

									<p className="mt-6 text-muted-foreground text-xs">
										{t("hero.trustLine")}
									</p>
								</div>

								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
									className="space-y-4 border border-border/40 p-5 md:p-8"
									aria-label={t("form.ariaLabel")}
									noValidate
									autoComplete="off"
								>
									<form.Field
										name="url"
										validators={{
											onSubmit: ({ value }) => {
												if (!value.trim()) return t("errors.urlRequired");
												if (!isValidUrl(value)) return t("errors.urlInvalid");
												return undefined;
											},
										}}
									>
										{(field) => (
											<FormItem>
												<FormLabel htmlFor={field.name}>
													{t("form.url")}
												</FormLabel>
												<Input
													id={field.name}
													name={field.name}
													type="url"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.urlPlaceholder")}
													autoComplete="off"
													aria-invalid={field.state.meta.errors.length > 0}
													className="h-10 text-base md:h-8 md:text-xs"
												/>
												<FormMessage errors={field.state.meta.errors} />
											</FormItem>
										)}
									</form.Field>
									<div className="grid gap-4 md:grid-cols-2">
										<form.Field name="email">
											{(field) => (
												<FormItem>
													<FormLabel htmlFor={field.name}>
														{t("form.email")}
													</FormLabel>
													<Input
														id={field.name}
														name={field.name}
														type="email"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) =>
															field.handleChange(e.target.value)
														}
														placeholder={t("form.emailPlaceholder")}
														autoComplete="off"
														aria-invalid={
															field.state.meta.errors.length > 0
														}
														className="h-10 text-base md:h-8 md:text-xs"
													/>
													<FormMessage errors={field.state.meta.errors} />
												</FormItem>
											)}
										</form.Field>
										<form.Field name="firstName">
											{(field) => (
												<FormItem>
													<FormLabel htmlFor={field.name}>
														{t("form.name")}{" "}
														<span className="text-muted-foreground">
															{t("form.nameOptional")}
														</span>
													</FormLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) =>
															field.handleChange(e.target.value)
														}
														placeholder={t("form.namePlaceholder")}
														autoComplete="off"
														className="h-10 text-base md:h-8 md:text-xs"
													/>
												</FormItem>
											)}
										</form.Field>
									</div>
									<form.Subscribe
										selector={(state) => [
											state.canSubmit,
											state.isSubmitting,
										]}
									>
										{([_canSubmit, isSubmitting]) => (
											<SubmitButton
												isSubmitting={isSubmitting}
												size="lg"
												className="w-full border-transparent bg-brand text-white md:h-8 md:text-xs [&]:hover:bg-brand/80"
											>
												{t("form.submit")}
											</SubmitButton>
										)}
									</form.Subscribe>
									<p className="text-center text-muted-foreground text-xs">
										{t("form.noSignup")}
									</p>
									<div aria-live="polite" aria-atomic="true">
										{submitStatus === "error" && (
											<p role="alert" className="text-destructive text-sm">
												{errorMessage}
											</p>
										)}
									</div>
								</form>
							</div>
						</div>

						<form.Subscribe
							selector={(state) => state.isSubmitting}
						>
							{(isSubmitting) =>
								isSubmitting ? (
									<div className="mt-12 flex flex-col items-center gap-3">
										<div className="h-6 w-6 animate-spin border-2 border-brand border-t-transparent" />
										<p className="text-muted-foreground text-sm">
											{t("loading")}
										</p>
									</div>
								) : null
							}
						</form.Subscribe>
					</>
				) : (
					report && <ReportResults data={report} />
				)}
			</div>

			{/* Trust footer */}
			<div className="mx-auto mt-12 max-w-[1200px] border-border/40 border-t px-6 pt-8 text-center">
				<p className="text-muted-foreground text-xs">{t("trust")}</p>
			</div>
		</section>
	);
}
