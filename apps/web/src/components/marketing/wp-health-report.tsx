"use client";

import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import z from "zod";

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
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

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
	migrationEstimate: { min: number; max: number };
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
		return { text: "text-green-500", stroke: "stroke-green-500" };
	}
	if (score >= 50) {
		return { text: "text-yellow-500", stroke: "stroke-yellow-500" };
	}
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
			<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-border/40">
				<div className="flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.mobile")} score={data.mobile.score} />
				</div>
				<div className="flex flex-col items-center justify-center border-border/40 border-l p-4">
					<ScoreRing label={t("results.desktop")} score={data.desktop.score} />
				</div>
			</div>

			{/* Projected score - visually separated */}
			<div className="mt-4 border-2 border-brand bg-brand/5 p-5">
				<Caption className="mb-3 block text-center text-brand">
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
				<div className="mt-px border border-border/40 border-t-0">
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
				<div className="mt-px border border-border/40 border-t-0 p-5">
					<Caption className="block">{t("results.securityRisks")}</Caption>
					<ul className="mt-3 space-y-2">
						{data.securityFlags.map((flag) => (
							<li
								className="flex items-start gap-3 font-light text-sm"
								key={flag}
							>
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
								<Body className="text-foreground text-sm">{flag}</Body>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Migration estimate + CTA */}
			<div className="mt-px grid items-center gap-6 border border-border/40 border-t-2 border-t-brand p-6 md:grid-cols-[1fr_auto]">
				<div>
					<Caption className="block">{t("results.migrationEstimate")}</Caption>
					<Muted className="mt-2 leading-relaxed">
						{t.rich("results.migrationText", {
							strong: (chunks) => (
								<Label className="font-medium text-foreground">{chunks}</Label>
							),
							min: data.migrationEstimate.min.toLocaleString(),
							max: data.migrationEstimate.max.toLocaleString(),
						})}
					</Muted>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button
						className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
						onClick={() =>
							track("book_call_clicked", { location: "analyzer_results" })
						}
						render={
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							<a
								href="https://cal.com/webvise"
								rel="noopener noreferrer"
								target="_blank"
							/>
						}
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
						render={<Link href={{ pathname: "/", hash: "contact" }} />}
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
			<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-border/40">
				<div className="flex flex-col items-center justify-center p-4">
					<ScoreRing label={t("results.mobile")} score={data.mobile.score} />
				</div>
				<div className="flex flex-col items-center justify-center border-border/40 border-l p-4">
					<ScoreRing label={t("results.desktop")} score={data.desktop.score} />
				</div>
			</div>

			{/* Projected score */}
			<div className="mt-4 border-2 border-brand bg-brand/5 p-5">
				<Caption className="mb-3 block text-center text-brand">
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
				className="mt-6 border border-border/40 p-6"
				noValidate
				onSubmit={handleUnlock}
			>
				<Body className="font-medium text-sm">{t("gate.title")}</Body>
				<Caption className="mt-1 block">{t("gate.subtitle")}</Caption>
				<div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
					<Input
						className="h-10 text-base md:h-8 md:text-xs"
						onChange={(e) => setEmail(e.target.value)}
						placeholder={t("form.emailPlaceholder")}
						required
						type="email"
						value={email}
					/>
					<Input
						className="h-10 text-base md:h-8 md:text-xs"
						onChange={(e) => setFirstName(e.target.value)}
						placeholder={t("form.namePlaceholder")}
						value={firstName}
					/>
					<Button
						className="border-transparent bg-brand text-white md:h-8 md:text-xs [&]:hover:bg-brand/80"
						type="submit"
					>
						{t("gate.unlock")}
					</Button>
				</div>
				{emailError && (
					<Caption className="mt-2 block text-destructive">
						{emailError}
					</Caption>
				)}
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
				const res = await fetch("/api/wp-health-report", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url }),
				});

				if (res.ok) {
					const result = await res.json();
					setReport(result);
					setPhase("teaser");
					track("analyzer_success", {
						url,
						mobile_score: result.mobile?.score ?? null,
						desktop_score: result.desktop?.score ?? null,
						projected_score: result.projectedScore ?? null,
					});
				} else {
					const err = await res.json().catch(() => null);
					setErrorMessage(err?.error || t("errors.analyzeFailed"));
					track("analyzer_error", { url, reason: "server_error" });
				}
			} catch {
				setErrorMessage(t("errors.networkError"));
				track("analyzer_error", { url, reason: "network_error" });
			}
		},
	});

	function handleUnlock(email: string, firstName: string) {
		setPhase("full");
		track("analyzer_unlocked", { url: report?.url ?? "", email });

		// Fire-and-forget: re-submit with email to trigger notification emails
		if (report) {
			fetch("/api/wp-health-report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					url: report.url,
					email,
					firstName: firstName || undefined,
				}),
			}).catch(() => {
				// fire-and-forget
			});
		}
	}

	return (
		<section className="py-16 md:py-32" id="wp-health-report">
			<div className="mx-auto max-w-[1200px] px-6">
				{phase === "form" && (
					<>
						<div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
							<div>
								<H1>
									{t.rich("hero.title", {
										brand: (chunks) => (
											<span className="text-brand">{chunks}</span>
										),
									})}
								</H1>
								<Lead className="mt-4 font-light text-lg">
									{t("hero.subtitle")}
								</Lead>

								<ul className="mt-6 space-y-2">
									{[0, 1, 2, 3].map((i) => (
										<li className="flex items-start gap-3 text-sm" key={i}>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
											<Body className="text-sm">{t(`hero.benefits.${i}`)}</Body>
										</li>
									))}
								</ul>

								<Caption className="mt-6 block">{t("hero.trustLine")}</Caption>
							</div>

							<form
								aria-label={t("form.ariaLabel")}
								autoComplete="off"
								className="space-y-4 border border-border/40 p-5 md:p-8"
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
											className="w-full border-transparent bg-brand text-white md:h-8 md:text-xs [&]:hover:bg-brand/80"
											disabled={!canSubmit}
											isSubmitting={isSubmitting}
											size="lg"
										>
											{t("form.submit")}
										</SubmitButton>
									)}
								</form.Subscribe>
								<Caption className="block text-center">
									{t("form.noSignup")}
								</Caption>
								<div aria-atomic="true" aria-live="polite">
									{errorMessage && (
										<Body className="text-destructive text-sm" role="alert">
											{errorMessage}
										</Body>
									)}
								</div>
							</form>
						</div>

						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) =>
								isSubmitting ? (
									<div className="mt-12 flex flex-col items-center gap-3">
										<div className="h-6 w-6 animate-spin border-2 border-brand border-t-transparent" />
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
			</div>

			{/* Trust footer */}
			<div className="mx-auto mt-12 max-w-[1200px] border-border/40 border-t px-6 pt-8 text-center">
				<Caption>{t("trust")}</Caption>
			</div>
		</section>
	);
}
