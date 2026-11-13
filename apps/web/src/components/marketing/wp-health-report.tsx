"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Loader2, X } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import z from "zod";

import { ArrowLink, actionVariants } from "@/components/marketing/action";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Body, H1, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { CAL_URL } from "@/lib/cal";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

// The site's form controls: 44 px fields with 16 px text, and a button of the
// same height beside them.
const fieldClassName =
	"h-11 rounded-sm bg-background px-3.5 text-base md:text-base";
const submitClassName = actionVariants({ size: "md", className: "h-11" });

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

interface ReportGeo {
	aiCrawlers: "allowed" | "partly-blocked" | "blocked" | "unknown";
	blockedCrawlers: string[];
	jsonLdTypes: string[];
	llmsTxt: boolean;
}

interface ReportData {
	desktop: { score: number };
	geo: ReportGeo;
	issues: ReportIssue[];
	mobile: { score: number };
	projectedScore: number;
	securityFlags: string[];
	seo: { score: number | null };
	url: string;
	vitals?: ReportVital[];
}

// Panels, headings and ruled rows as the rest of the site draws them.
const panelClassName = "surface-card p-6 md:p-8";
const ruleClassName = "border-foreground/[0.08]";

// Text and ring follow the surface, so the colours hold on light and dark.
function scoreTone(score: number | null) {
	if (score === null) {
		return "text-muted-foreground";
	}
	if (score >= 90) {
		return "text-success";
	}
	if (score >= 50) {
		return "text-brand-readable";
	}
	return "text-destructive";
}

// Lighthouse's own gauge: radius 56 in a 120 box.
const RING = 2 * Math.PI * 56;

function ScoreRing({
	large = false,
	label,
	score,
}: {
	large?: boolean;
	label: string;
	score: number;
}) {
	const count = useMotionValue(0);
	const rounded = useTransform(count, (v) => Math.round(v));

	useEffect(() => {
		const controls = animate(count, score, {
			duration: 1,
			ease: [0.16, 1, 0.3, 1],
		});
		return () => controls.stop();
	}, [count, score]);

	return (
		<div className="flex flex-col items-center gap-3">
			<span
				className={cn(
					"relative grid place-items-center",
					large ? "size-32" : "size-20 sm:size-28",
					scoreTone(score)
				)}
			>
				<svg
					aria-hidden="true"
					className="absolute inset-0 size-full -rotate-90"
					viewBox="0 0 120 120"
				>
					<circle
						cx="60"
						cy="60"
						fill="currentColor"
						fillOpacity="0.1"
						r="56"
					/>
					<motion.circle
						animate={{ strokeDashoffset: RING - (RING * score) / 100 }}
						cx="60"
						cy="60"
						fill="none"
						initial={{ strokeDashoffset: RING }}
						r="56"
						stroke="currentColor"
						strokeDasharray={RING}
						strokeLinecap="round"
						strokeWidth="8"
						transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
					/>
				</svg>
				<motion.span
					className={cn(
						"font-display tabular-nums leading-none tracking-[-0.03em]",
						large ? "text-4xl" : "text-2xl sm:text-3xl"
					)}
				>
					{rounded}
				</motion.span>
			</span>
			<span className="text-base text-foreground">{label}</span>
		</div>
	);
}

/** The report's title and the address it ran on. */
function ReportHeader({ url }: { url: string }) {
	const t = useTranslations("wpHealthReport");
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
			<H2>{t("results.title")}</H2>
			<p className="text-base text-muted-foreground">
				{t("results.resultsFor")} <span className="text-foreground">{url}</span>
			</p>
		</div>
	);
}

/** One tile per measured score, side by side. */
function ScoreTiles({
	scores,
}: {
	scores: { label: string; score: number }[];
}) {
	return (
		<div
			className={cn(
				"grid gap-3 sm:gap-5",
				scores.length === 3 ? "grid-cols-3" : "grid-cols-2"
			)}
		>
			{scores.map((item) => (
				<div
					className="surface-card flex justify-center px-2 py-6 sm:px-4 sm:py-7"
					key={item.label}
				>
					<ScoreRing label={item.label} score={item.score} />
				</div>
			))}
		</div>
	);
}

/** What the same site would score once rebuilt. */
function ProjectedScore({ score }: { score: number }) {
	const t = useTranslations("wpHealthReport");
	return (
		<div
			className={cn(
				panelClassName,
				"grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12"
			)}
		>
			<div>
				<H3 className="text-xl">{t("results.projectedLabel")}</H3>
				<p className="mt-2 max-w-[52ch] text-base text-muted-foreground leading-[1.6]">
					{t("results.projectedHint")}
				</p>
			</div>
			<div className="justify-self-center md:px-6">
				<ScoreRing label={t("results.afterNextjs")} large score={score} />
			</div>
		</div>
	);
}

function GeoRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
	const Icon = ok ? Check : X;
	return (
		<li
			className={cn(
				"flex items-start gap-3 border-b py-3 text-base text-foreground leading-[1.6]",
				ruleClassName
			)}
		>
			<Icon
				aria-hidden="true"
				className={cn(
					"mt-1 size-4 shrink-0",
					ok ? "text-success" : "text-destructive"
				)}
			/>
			{children}
		</li>
	);
}

function GeoBlock({ geo }: { geo: ReportGeo }) {
	const t = useTranslations("wpHealthReport");
	const bots = geo.blockedCrawlers.join(", ");
	const crawlerText = {
		allowed: t("results.geoCrawlersAllowed"),
		"partly-blocked": t("results.geoCrawlersPartly", { bots }),
		blocked: t("results.geoCrawlersBlocked"),
		unknown: t("results.geoCrawlersUnknown"),
	}[geo.aiCrawlers];

	return (
		<div className={panelClassName}>
			<H3 className="text-xl">{t("results.geoTitle")}</H3>
			<ul className={cn("mt-5 border-t", ruleClassName)}>
				<GeoRow ok={geo.llmsTxt}>
					{geo.llmsTxt ? t("results.geoLlmsTxtYes") : t("results.geoLlmsTxtNo")}
				</GeoRow>
				<GeoRow ok={geo.aiCrawlers === "allowed"}>{crawlerText}</GeoRow>
				<GeoRow ok={geo.jsonLdTypes.length > 0}>
					{geo.jsonLdTypes.length > 0
						? t("results.geoJsonLdFound", { types: geo.jsonLdTypes.join(", ") })
						: t("results.geoJsonLdNone")}
				</GeoRow>
			</ul>
			<ArrowLink
				className="mt-6"
				href={{ pathname: "/services/[slug]", params: { slug: "seo-geo" } }}
			>
				{t("results.geoCta")}
			</ArrowLink>
		</div>
	);
}

function ReportResults({ data }: { data: ReportData }) {
	const locale = useLocale();
	const t = useTranslations("wpHealthReport");

	return (
		<div className="stagger-visible">
			<ReportHeader url={data.url} />

			<div className="mt-10 grid gap-5">
				<ScoreTiles
					scores={[
						{ label: t("results.mobile"), score: data.mobile.score },
						{ label: t("results.desktop"), score: data.desktop.score },
						...(data.seo.score === null
							? []
							: [{ label: t("results.seo"), score: data.seo.score }]),
					]}
				/>

				<ProjectedScore score={data.projectedScore} />

				{/* Core Web Vitals, each with what it means for a visitor */}
				{data.vitals && data.vitals.length > 0 && (
					<div className={panelClassName}>
						<H3 className="text-xl">{t("results.webVitalsTitle")}</H3>
						<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
							{t("results.webVitalsSubtitle")}
						</p>
						<dl className={cn("mt-6 border-t", ruleClassName)}>
							{data.vitals.map((vital) => {
								const explanationKey =
									`results.vitalExplanations.${vital.label}` as const;
								return (
									<div
										className={cn(
											"grid gap-x-8 gap-y-2 border-b py-5 md:grid-cols-[9rem_1fr]",
											ruleClassName
										)}
										key={vital.label}
									>
										<dt className="flex flex-col-reverse gap-1.5">
											<span className="text-muted-foreground text-sm">
												{vital.label}
											</span>
											<span
												className={cn(
													"font-display text-2xl tabular-nums leading-none",
													scoreTone(vital.score)
												)}
											>
												{vital.displayValue}
											</span>
										</dt>
										<dd className="text-base text-foreground/75 leading-[1.6]">
											{t.has(explanationKey)
												? t(explanationKey)
												: t("results.vitalExplanations.default")}
										</dd>
									</div>
								);
							})}
						</dl>
					</div>
				)}

				{/* Security flags - only show if present */}
				{data.securityFlags.length > 0 && (
					<div className={panelClassName}>
						<H3 className="text-xl">{t("results.securityRisks")}</H3>
						<ul className={cn("mt-5 border-t", ruleClassName)}>
							{data.securityFlags.map((flag) => (
								<li
									className={cn(
										"border-b py-3 text-base text-foreground leading-[1.6]",
										ruleClassName
									)}
									key={flag}
								>
									{flag}
								</li>
							))}
						</ul>
					</div>
				)}

				<GeoBlock geo={data.geo} />

				{/* Scope review + CTA */}
				<div
					className={cn(
						panelClassName,
						"grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-12"
					)}
				>
					<div>
						<H3 className="text-xl">{t("results.scopeReview")}</H3>
						<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
							{t("results.migrationText")}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<a
							className={actionVariants({ size: "md" })}
							href={CAL_URL}
							onClick={() =>
								track("book_call_clicked", { location: "analyzer_results" })
							}
							rel="noopener noreferrer"
							target="_blank"
						>
							{t("results.bookCall")}
						</a>
						<NextLink
							className={actionVariants({ size: "md", variant: "quiet" })}
							href={homepageSectionHref("contact", locale)}
							onClick={() =>
								track("cta_clicked", {
									location: "analyzer_results",
									variant: "contact",
								})
							}
						>
							{t("results.getInTouch")}
						</NextLink>
					</div>
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
		<div className="stagger-visible">
			<ReportHeader url={data.url} />

			<div className="mt-10 grid gap-5">
				<ScoreTiles
					scores={[
						{ label: t("results.mobile"), score: data.mobile.score },
						{ label: t("results.desktop"), score: data.desktop.score },
					]}
				/>

				<ProjectedScore score={data.projectedScore} />

				{/* Email gate */}
				<form className={panelClassName} noValidate onSubmit={handleUnlock}>
					<H3 className="text-xl">{t("gate.title")}</H3>
					<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
						{t("gate.subtitle")}
					</p>
					<div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start">
						<FormItem>
							<FormLabel className="sr-only" htmlFor={emailInputId}>
								{t("form.email")}
							</FormLabel>
							<Input
								aria-invalid={!!emailError}
								className={fieldClassName}
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
								className={fieldClassName}
								id={firstNameInputId}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder={t("form.namePlaceholder")}
								value={firstName}
							/>
						</FormItem>
						<button className={submitClassName} type="submit">
							{t("gate.viewReport")}
						</button>
					</div>
					<p className="mt-4 text-muted-foreground text-sm">
						{t("gate.privacy")}
					</p>
				</form>
			</div>
		</div>
	);
}

export default function WpHealthReport() {
	const t = useTranslations("wpHealthReport");
	const locale = useLocale();
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
					locale: locale === "de" ? "de" : "en",
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
									className="grid gap-3"
									noValidate
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
								>
									<FormLabel
										className="font-medium text-base text-foreground"
										htmlFor="url"
									>
										{t("form.url")}
									</FormLabel>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
												<FormItem className="flex-1">
													<Input
														aria-invalid={field.state.meta.errors.length > 0}
														autoComplete="off"
														className={fieldClassName}
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
											selector={(state) => [
												state.canSubmit,
												state.isSubmitting,
											]}
										>
											{([canSubmit, isSubmitting]) => (
												<button
													className={submitClassName}
													disabled={!canSubmit || isSubmitting}
													type="submit"
												>
													{isSubmitting && (
														<Loader2
															aria-hidden="true"
															className="size-4 animate-spin"
														/>
													)}
													{t("form.submit")}
												</button>
											)}
										</form.Subscribe>
									</div>
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

						{/* Three steps as ruled columns, numbered like the build list on
						    a case study */}
						<ol className="mt-16 grid gap-x-6 md:mt-20 md:grid-cols-3">
							{[0, 1, 2].map((i) => (
								<li
									className={cn("border-t pt-5 pb-8 md:pb-0", ruleClassName)}
									key={i}
								>
									<span
										aria-hidden="true"
										className="text-muted-foreground text-sm tabular-nums"
									>
										{String(i + 1).padStart(2, "0")}
									</span>
									<H3 className="mt-3 text-xl">{t(`hero.steps.${i}.title`)}</H3>
									<p className="mt-2 max-w-[38ch] text-base text-muted-foreground leading-[1.6]">
										{t(`hero.steps.${i}.description`)}
									</p>
								</li>
							))}
						</ol>

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
