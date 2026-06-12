"use client";

import { useForm } from "@tanstack/react-form";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import z from "zod";

import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import {
	Body,
	Caption,
	H1,
	H2,
	Label,
	Lead,
	Muted,
} from "@/components/ui/typography";
import { CAL_URL } from "@/lib/cal";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

interface ReportIssue {
	displayValue?: string;
	savingsMs?: number;
	title: string;
}

interface ReportVital {
	displayValue: string;
	label: string;
	score: number | null;
}

interface ReportData {
	desktop: { score: number };
	issues: ReportIssue[];
	mobile: { score: number };
	projectedScore: number;
	securityFlags: string[];
	url: string;
	vitals?: ReportVital[];
}

function scoreColor(score: number | null) {
	if (score === null) {
		return { text: "text-muted-foreground", stroke: "stroke-muted-foreground" };
	}
	if (score >= 90) {
		return { text: "text-success", stroke: "stroke-success" };
	}
	if (score >= 50) {
		return { text: "text-brand-readable", stroke: "stroke-brand" };
	}
	return { text: "text-destructive", stroke: "stroke-destructive" };
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
					aria-hidden="true"
					className="-rotate-90"
					height={size}
					width={size}
				>
					<circle
						className="text-border"
						cx={size / 2}
						cy={size / 2}
						fill="none"
						r={radius}
						stroke="currentColor"
						strokeWidth={3}
					/>
					<circle
						className={cn("transition-all duration-1000", stroke)}
						cx={size / 2}
						cy={size / 2}
						fill="none"
						r={radius}
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="butt"
						strokeWidth={3}
					/>
				</svg>
				<Body
					className={cn(
						"absolute inset-0 flex items-center justify-center font-medium text-base",
						text
					)}
				>
					{score}
				</Body>
			</div>
			<Caption>{label}</Caption>
		</div>
	);
}

function ReportResults({ data }: { data: ReportData }) {
	const locale = useLocale();
	const t = useTranslations("wpHealthReport");

	return (
		<div>
			{/* Header */}
			<div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
				<H2>{t("results.title")}</H2>
				<Muted>
					{t("results.resultsFor")}{" "}
					<Label className="font-medium text-foreground">{data.url}</Label>
				</Muted>
			</div>

			{/* Scores row */}
			<div className="mt-8 grid grid-cols-2 gap-4">
				<div className="surface-card flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.mobile")} score={data.mobile.score} />
				</div>
				<div className="surface-card flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.desktop")} score={data.desktop.score} />
				</div>
			</div>

			{/* Projected score - visually separated */}
			<div className="surface-card mt-4 p-5">
				<Caption className="mb-3 block text-center text-brand-readable">
					{t("results.projectedLabel")}
				</Caption>
				<div className="flex justify-center">
					<ScoreRing
						label={t("results.afterNextjs")}
						score={data.projectedScore}
						size={88}
					/>
				</div>
				<Caption className="mt-3 block text-center">
					{t("results.projectedHint")}
				</Caption>
			</div>

			{/* Core Web Vitals with explanations */}
			{data.vitals && data.vitals.length > 0 && (
				<div className="surface-card mt-4 overflow-hidden">
					<div className="border-border/40 border-b px-5 py-3">
						<Caption className="block">{t("results.webVitalsTitle")}</Caption>
						<Caption className="mt-1 block">
							{t("results.webVitalsSubtitle")}
						</Caption>
					</div>
					<div className="divide-y divide-border/40">
						{data.vitals.map((vital) => {
							const { text } = scoreColor(vital.score);
							const explanationKey =
								`results.vitalExplanations.${vital.label}` as const;
							return (
								<div
									className="flex items-start gap-4 px-5 py-3"
									key={vital.label}
								>
									<div
										className="flex shrink-0 flex-col items-center gap-0.5"
										style={{ minWidth: 48 }}
									>
										<Body className={cn("font-medium text-sm", text)}>
											{vital.displayValue}
										</Body>
										<Caption>{vital.label}</Caption>
									</div>
									<Caption className="leading-relaxed">
										{t.has(explanationKey)
											? t(explanationKey)
											: t("results.vitalExplanations.default")}
									</Caption>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Security flags - only show if present */}
			{data.securityFlags.length > 0 && (
				<div className="surface-card mt-4 p-5">
					<Caption className="block">{t("results.securityRisks")}</Caption>
					<ul className="mt-3 space-y-2">
						{data.securityFlags.map((flag) => (
							<li
								className="flex items-start gap-3 font-light text-sm"
								key={flag}
							>
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
								<Body className="text-foreground text-sm">{flag}</Body>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Scope review + CTA */}
			<div className="surface-card mt-4 grid items-center gap-6 p-6 md:grid-cols-[1fr_auto]">
				<div>
					<Caption className="block">{t("results.scopeReview")}</Caption>
					<Muted className="mt-2 leading-relaxed">
						{t("results.migrationText")}
					</Muted>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button
						onClick={() =>
							track("book_call_clicked", { location: "analyzer_results" })
						}
						render={
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							<a href={CAL_URL} rel="noopener noreferrer" target="_blank" />
						}
						variant="brand"
					>
						{t("results.bookCall")}
					</Button>
					<Button
						className=""
						onClick={() =>
							track("cta_clicked", {
								location: "analyzer_results",
								variant: "contact",
							})
						}
						render={
							<NextLink
								aria-label={t("results.getInTouch")}
								href={homepageSectionHref("contact", locale)}
							/>
						}
						variant="outline"
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

function TeaserResults({
	data,
	onUnlock,
}: {
	data: ReportData;
	onUnlock: (email: string, firstName: string) => void;
}) {
	const t = useTranslations("wpHealthReport");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [emailError, setEmailError] = useState("");
	const emailInputId = "wp-health-gate-email";
	const firstNameInputId = "wp-health-gate-name";

	function handleUnlock(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = email.trim();
		if (!(trimmed && z.string().email().safeParse(trimmed).success)) {
			setEmailError(t("errors.emailInvalid"));
			return;
		}
		setEmailError("");
		onUnlock(trimmed, firstName.trim());
	}

	return (
		<div>
			<div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
				<H2>{t("results.title")}</H2>
				<Muted>
					{t("results.resultsFor")}{" "}
					<Label className="font-medium text-foreground">{data.url}</Label>
				</Muted>
			</div>

			{/* Scores row */}
			<div className="mt-8 grid grid-cols-2 gap-4">
				<div className="surface-card flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.mobile")} score={data.mobile.score} />
				</div>
				<div className="surface-card flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.desktop")} score={data.desktop.score} />
				</div>
			</div>

			{/* Projected score */}
			<div className="surface-card mt-4 p-5">
				<Caption className="mb-3 block text-center text-brand-readable">
					{t("results.projectedLabel")}
				</Caption>
				<div className="flex justify-center">
					<ScoreRing
						label={t("results.afterNextjs")}
						score={data.projectedScore}
						size={88}
					/>
				</div>
				<Caption className="mt-3 block text-center">
					{t("results.projectedHint")}
				</Caption>
			</div>

			{/* Email gate */}
			<form
				className="surface-card mt-6 p-6"
				noValidate
				onSubmit={handleUnlock}
			>
				<Body className="font-medium text-sm">{t("gate.title")}</Body>
				<Caption className="mt-1 block">{t("gate.subtitle")}</Caption>
				<div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
					<FormItem>
						<FormLabel className="sr-only" htmlFor={emailInputId}>
							{t("form.email")}
						</FormLabel>
						<Input
							aria-invalid={!!emailError}
							className="h-10 text-base md:h-8 md:text-xs"
							id={emailInputId}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={t("form.emailPlaceholder")}
							required
							type="email"
							value={email}
						/>
						<FormMessage errors={emailError ? [emailError] : []} />
					</FormItem>
					<FormItem>
						<FormLabel className="sr-only" htmlFor={firstNameInputId}>
							{t("form.name")}
						</FormLabel>
						<Input
							className="h-10 text-base md:h-8 md:text-xs"
							id={firstNameInputId}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder={t("form.namePlaceholder")}
							value={firstName}
						/>
					</FormItem>
					<Button className="md:h-8 md:text-xs" type="submit" variant="brand">
						{t("gate.viewReport")}
					</Button>
				</div>
				<Caption className="mt-3 block">{t("gate.privacy")}</Caption>
			</form>
		</div>
	);
}

export default function WpHealthReport() {
	const t = useTranslations("wpHealthReport");
	const [phase, setPhase] = useState<"form" | "teaser" | "full">("form");
	const [report, setReport] = useState<ReportData | null>(null);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		defaultValues: { url: "" },
		validators: {
			onSubmit: z.object({
				url: z.string().min(1, t("errors.urlRequired")),
			}),
		},
		onSubmit: async ({ value }) => {
			setErrorMessage("");

			let url = value.url.trim();
			if (!url.startsWith("http")) {
				url = `https://${url}`;
			}

			track("analyzer_submitted", { url });

			try {
				const result = await trpcClient.wpHealth.run.mutate({ url });
				setReport(result);
				setPhase("teaser");
				track("analyzer_success", {
					url,
					mobile_score: result.mobile?.score ?? null,
					desktop_score: result.desktop?.score ?? null,
					projected_score: result.projectedScore ?? null,
				});
			} catch (err) {
				const message =
					err instanceof Error && err.message
						? err.message
						: t("errors.analyzeFailed");
				setErrorMessage(message);
				track("analyzer_error", { url, reason: "server_error" });
			}
		},
	});

	function handleUnlock(email: string, firstName: string) {
		setPhase("full");
		track("analyzer_unlocked", { url: report?.url ?? "", email });

		// Fire-and-forget: re-submit with email to trigger notification emails
		if (report) {
			trpcClient.wpHealth.run
				.mutate({
					url: report.url,
					email,
					firstName: firstName || undefined,
				})
				.catch(() => {
					// fire-and-forget
				});
		}
	}

	return (
		<section
			className="section-inverted relative border-grid-line border-t py-16 md:py-32"
			id="wp-health-report"
		>
			<ConstructedGrid variant="section" />
			<GridContainer width="media">
				{phase === "form" && (
					<>
						<div className="grid items-stretch gap-12 md:grid-cols-2 md:gap-16">
							<div>
								<H1>
									{t.rich("hero.title", {
										brand: (chunks) => (
											<span className="text-brand-readable">{chunks}</span>
										),
									})}
								</H1>
								<Lead className="mt-4">{t("hero.subtitle")}</Lead>
							</div>

							<div className="flex flex-col justify-center self-stretch lg:pt-2">
								<form
									aria-label={t("form.ariaLabel")}
									autoComplete="off"
									className="space-y-4"
									noValidate
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
								>
									<form.Field
										name="url"
										validators={{
											onSubmit: ({ value }) => {
												if (!value.trim()) {
													return t("errors.urlRequired");
												}
												if (!isValidUrl(value)) {
													return t("errors.urlInvalid");
												}
												return;
											},
										}}
									>
										{(field) => (
											<FormItem>
												<FormLabel htmlFor={field.name}>
													{t("form.url")}
												</FormLabel>
												<Input
													aria-invalid={field.state.meta.errors.length > 0}
													autoComplete="off"
													className="h-10 text-base md:h-8 md:text-xs"
													id={field.name}
													name={field.name}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.urlPlaceholder")}
													type="url"
													value={field.state.value}
												/>
												<FormMessage errors={field.state.meta.errors} />
											</FormItem>
										)}
									</form.Field>
									<form.Subscribe
										selector={(state) => [state.canSubmit, state.isSubmitting]}
									>
										{([canSubmit, isSubmitting]) => (
											<SubmitButton
												className="w-full md:h-8 md:text-xs"
												disabled={!canSubmit}
												isSubmitting={isSubmitting}
												size="lg"
												variant="brand"
											>
												{t("form.submit")}
											</SubmitButton>
										)}
									</form.Subscribe>
									<div aria-atomic="true" aria-live="polite">
										{errorMessage && (
											<Body className="text-destructive text-sm" role="alert">
												{errorMessage}
											</Body>
										)}
									</div>
								</form>
							</div>
						</div>

						<div className="mt-14 grid gap-5 md:grid-cols-3">
							{[0, 1, 2].map((i) => (
								<div className="surface-card p-6 md:p-7" key={i}>
									<Caption className="block text-brand-readable">
										{String(i + 1).padStart(2, "0")}
									</Caption>
									<Body className="mt-5 font-medium text-foreground text-sm">
										{t(`hero.steps.${i}.title`)}
									</Body>
									<Muted className="mt-1.5 text-sm leading-relaxed">
										{t(`hero.steps.${i}.description`)}
									</Muted>
								</div>
							))}
						</div>

						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) =>
								isSubmitting ? (
									<div className="mt-12 flex flex-col items-center gap-3">
										<div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
										<Muted>{t("loading")}</Muted>
									</div>
								) : null
							}
						</form.Subscribe>
					</>
				)}

				{phase === "teaser" && report && (
					<TeaserResults data={report} onUnlock={handleUnlock} />
				)}

				{phase === "full" && report && <ReportResults data={report} />}
			</GridContainer>
		</section>
	);
}
