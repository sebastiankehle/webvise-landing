"use client";

import { useForm } from "@tanstack/react-form";
import { TRPCClientError } from "@trpc/client";
import { Check, Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
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
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

type CheckResult = Awaited<
	ReturnType<typeof trpcClient.aiVisibility.run.mutate>
>;
type Answer = CheckResult["answers"][number];

const ASSISTANT_NAMES = {
	chatgpt: "ChatGPT",
	gemini: "Gemini",
	perplexity: "Perplexity",
} as const;
const MAX_CITATIONS_SHOWN = 5;
const WWW_RE = /^www\./;

// The site's form controls and panels, as on the WP Health Report.
const fieldClassName =
	"h-11 rounded-sm bg-background px-3.5 text-base md:text-base";
const panelClassName = "surface-card p-6 md:p-8";
const ruleClassName = "border-foreground/[0.08]";

function withScheme(value: string): string {
	const trimmed = value.trim();
	return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value: string): boolean {
	try {
		return new URL(withScheme(value)).hostname.includes(".");
	} catch {
		return false;
	}
}

function optional(value: string): string | undefined {
	return value.trim() || undefined;
}

/** The message for a failed check: rate limit, unreachable site, or anything else. */
function errorKey(err: unknown) {
	const code =
		err instanceof TRPCClientError
			? (err.data as { code?: string } | undefined)?.code
			: undefined;
	if (code === "TOO_MANY_REQUESTS") {
		return "errors.rateLimited";
	}
	return code === "BAD_REQUEST" ? "errors.siteInvalid" : "errors.checkFailed";
}

/** A yes/no line with a tick or a cross. */
function Mark({ ok, children }: { ok: boolean; children: ReactNode }) {
	const Icon = ok ? Check : X;
	return (
		<span className="inline-flex items-center gap-1.5 text-foreground text-sm">
			<Icon
				aria-hidden="true"
				className={cn(
					"size-4 shrink-0",
					ok ? "text-success" : "text-destructive"
				)}
			/>
			{children}
		</span>
	);
}

/** A yes/no mark for one verdict; nothing when the question was not asked. */
function Verdict({
	value,
	yes,
	no,
}: {
	value: boolean | null;
	yes: string;
	no: string;
}) {
	if (value === null) {
		return null;
	}
	return <Mark ok={value}>{value ? yes : no}</Mark>;
}

function displayUrl(url: string): string {
	const { hostname, pathname } = new URL(url);
	return `${hostname.replace(WWW_RE, "")}${pathname === "/" ? "" : pathname}`;
}

function AnswerRow({ answer }: { answer: Answer }) {
	const t = useTranslations("aiVisibilityCheck");
	return (
		<div
			className={cn(
				"grid gap-x-8 gap-y-3 border-b py-5 md:grid-cols-[9rem_1fr]",
				ruleClassName
			)}
		>
			<dt className="font-medium text-base text-foreground">
				{ASSISTANT_NAMES[answer.assistant]}
			</dt>
			<dd className="grid gap-3">
				{answer.ok ? (
					<>
						<div className="flex flex-wrap gap-x-5 gap-y-1">
							<Mark ok={answer.mentioned}>
								{answer.mentioned
									? t("results.namedYes")
									: t("results.namedNo")}
							</Mark>
							<Mark ok={answer.cited}>
								{answer.cited ? t("results.citedYes") : t("results.citedNo")}
							</Mark>
						</div>
						{answer.snippet && (
							<q className="block text-base text-foreground/75 leading-[1.6]">
								{answer.snippet}
							</q>
						)}
						{answer.citations.length > 0 && (
							<div>
								<p className="text-muted-foreground text-sm">
									{t("results.sources")}
								</p>
								<ul className="mt-1 grid gap-1">
									{answer.citations
										.slice(0, MAX_CITATIONS_SHOWN)
										.map((citation) => (
											<li
												className="flex min-w-0 items-center gap-1.5 text-sm"
												key={citation.url}
											>
												{citation.own && (
													<Check
														aria-hidden="true"
														className="size-3.5 shrink-0 text-success"
													/>
												)}
												<a
													className={cn(
														"truncate underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground",
														citation.own
															? "font-medium text-foreground"
															: "text-muted-foreground"
													)}
													href={citation.url}
													rel="nofollow noopener noreferrer"
													target="_blank"
												>
													{displayUrl(citation.url)}
												</a>
											</li>
										))}
								</ul>
							</div>
						)}
					</>
				) : (
					<Muted>{t("results.failed")}</Muted>
				)}
			</dd>
		</div>
	);
}

function GeoRow({ ok, children }: { ok: boolean; children: ReactNode }) {
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

function GeoBlock({ geo }: { geo: CheckResult["geo"] }) {
	const t = useTranslations("aiVisibilityCheck");
	const crawlerText = {
		allowed: t("results.geoCrawlersAllowed"),
		"partly-blocked": t("results.geoCrawlersPartly", {
			bots: geo.blockedCrawlers.join(", "),
		}),
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

function Results({
	data,
	onReset,
}: {
	data: CheckResult;
	onReset: () => void;
}) {
	const t = useTranslations("aiVisibilityCheck");
	const { summary } = data;
	const hasRecommend = data.prompts.some((p) => p.id === "recommend");

	return (
		<div className="stagger-visible">
			<div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
				<H2>{t("results.title", { brand: data.brand })}</H2>
				<p className="text-base text-muted-foreground">
					{t("results.resultsFor")}{" "}
					<span className="text-foreground">{data.host}</span>
				</p>
			</div>
			<Lead className="mt-4">
				{[
					t("results.summaryKnows", { ...summary.knows, brand: data.brand }),
					summary.recommends.of > 0 &&
						t("results.summaryRecommends", summary.recommends),
					summary.citesSite.of > 0 &&
						t("results.summaryCites", summary.citesSite),
				]
					.filter(Boolean)
					.join(" ")}
			</Lead>

			<div className="mt-10 grid gap-5">
				<div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
					{summary.models.map((m) => (
						<div
							className="surface-card grid content-start gap-3 p-6"
							key={m.model}
						>
							<H3 className="text-xl">{ASSISTANT_NAMES[m.model]}</H3>
							{m.citesSite === null ? (
								<Muted>{t("results.failed")}</Muted>
							) : (
								<>
									<Verdict
										no={t("results.knowsNo")}
										value={m.knows}
										yes={t("results.knowsYes")}
									/>
									<Verdict
										no={t("results.recommendsNo")}
										value={m.recommends}
										yes={t("results.recommendsYes")}
									/>
									<Verdict
										no={t("results.citedNo")}
										value={m.citesSite}
										yes={t("results.citedYes")}
									/>
								</>
							)}
						</div>
					))}
				</div>

				<div className={panelClassName}>
					<H3 className="text-xl">{t("results.caveatTitle")}</H3>
					<p className="mt-2 max-w-[70ch] text-base text-muted-foreground leading-[1.6]">
						{t("results.caveat", {
							models: data.models.map((m) => m.model).join(", "),
						})}
					</p>
				</div>

				{data.prompts.map((prompt) => (
					<div className={panelClassName} key={prompt.id}>
						<H3 className="text-xl">{t(`results.prompts.${prompt.id}`)}</H3>
						<q className="mt-2 block text-base text-muted-foreground">
							{prompt.question}
						</q>
						<dl className={cn("mt-5 border-t", ruleClassName)}>
							{data.answers
								.filter((a) => a.prompt === prompt.id)
								.map((answer) => (
									<AnswerRow answer={answer} key={answer.assistant} />
								))}
						</dl>
					</div>
				))}

				{!hasRecommend && (
					<Muted className="px-1">{t("results.noCategoryHint")}</Muted>
				)}

				<GeoBlock geo={data.geo} />

				<div
					className={cn(
						panelClassName,
						"grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-12"
					)}
				>
					<div>
						<H3 className="text-xl">{t("results.ctaTitle")}</H3>
						<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
							{t("results.ctaText")}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<a
							className={actionVariants({ size: "md" })}
							href={CAL_URL}
							onClick={() =>
								track("book_call_clicked", {
									location: "ai_visibility_results",
								})
							}
							rel="noopener noreferrer"
							target="_blank"
						>
							{t("results.bookCall")}
						</a>
						<button
							className={actionVariants({ size: "md", variant: "quiet" })}
							onClick={onReset}
							type="button"
						>
							{t("results.again")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function OptionalLabel({
	htmlFor,
	children,
}: {
	htmlFor: string;
	children: ReactNode;
}) {
	const t = useTranslations("aiVisibilityCheck");
	return (
		<FormLabel
			className="font-medium text-base text-foreground"
			htmlFor={htmlFor}
		>
			{children}{" "}
			<span className="font-normal text-muted-foreground">
				{t("form.optional")}
			</span>
		</FormLabel>
	);
}

export default function AiVisibilityCheck() {
	const t = useTranslations("aiVisibilityCheck");
	const locale = useLocale();
	const [result, setResult] = useState<CheckResult | null>(null);

	// Results and form differ in height; bring the top of the tool into view.
	function show(next: CheckResult | null) {
		setResult(next);
		document.getElementById("ai-visibility-check")?.scrollIntoView();
	}
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm({
		defaultValues: {
			brand: "",
			url: "",
			category: "",
			city: "",
			email: "",
			firstName: "",
		},
		onSubmit: async ({ value }) => {
			setErrorMessage("");
			const url = withScheme(value.url);
			track("ai_visibility_submitted", { url });

			try {
				const data = await trpcClient.aiVisibility.run.mutate({
					brand: value.brand.trim(),
					url,
					category: optional(value.category),
					city: optional(value.city),
					email: optional(value.email),
					firstName: optional(value.firstName),
					locale: locale === "de" ? "de" : "en",
				});
				show(data);
				track("ai_visibility_success", {
					url,
					knows: data.summary.knows.yes,
					recommends: data.summary.recommends.yes,
					cites_site: data.summary.citesSite.yes,
				});
			} catch (err) {
				const key = errorKey(err);
				setErrorMessage(t(key));
				track("ai_visibility_error", { url, reason: key });
			}
		},
	});

	return (
		<section
			className="section-inverted relative border-grid-line border-t py-16 md:py-32"
			id="ai-visibility-check"
		>
			<ConstructedGrid variant="section" />
			<GridContainer width="media">
				{result ? (
					<Results data={result} onReset={() => show(null)} />
				) : (
					<>
						<div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
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

							<form
								aria-label={t("form.ariaLabel")}
								className="grid gap-4 lg:pt-2"
								noValidate
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
							>
								<form.Field
									name="brand"
									validators={{
										onSubmit: ({ value }) =>
											value.trim() ? undefined : t("errors.brandRequired"),
									}}
								>
									{(field) => (
										<FormItem>
											<FormLabel
												className="font-medium text-base text-foreground"
												htmlFor="ai-brand"
											>
												{t("form.brand")}
											</FormLabel>
											<Input
												aria-invalid={field.state.meta.errors.length > 0}
												autoComplete="organization"
												className={fieldClassName}
												id="ai-brand"
												maxLength={100}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder={t("form.brandPlaceholder")}
												value={field.state.value}
											/>
											<FormMessage errors={field.state.meta.errors} />
										</FormItem>
									)}
								</form.Field>

								<form.Field
									name="url"
									validators={{
										onSubmit: ({ value }) => {
											if (!value.trim()) {
												return t("errors.urlRequired");
											}
											return isValidUrl(value)
												? undefined
												: t("errors.urlInvalid");
										},
									}}
								>
									{(field) => (
										<FormItem>
											<FormLabel
												className="font-medium text-base text-foreground"
												htmlFor="ai-url"
											>
												{t("form.url")}
											</FormLabel>
											<Input
												aria-invalid={field.state.meta.errors.length > 0}
												autoComplete="url"
												className={fieldClassName}
												id="ai-url"
												maxLength={2000}
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

								<div className="grid gap-4 sm:grid-cols-2">
									<form.Field name="category">
										{(field) => (
											<FormItem>
												<OptionalLabel htmlFor="ai-category">
													{t("form.category")}
												</OptionalLabel>
												<Input
													className={fieldClassName}
													id="ai-category"
													maxLength={80}
													name={field.name}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.categoryPlaceholder")}
													value={field.state.value}
												/>
											</FormItem>
										)}
									</form.Field>
									<form.Field name="city">
										{(field) => (
											<FormItem>
												<OptionalLabel htmlFor="ai-city">
													{t("form.city")}
												</OptionalLabel>
												<Input
													autoComplete="address-level2"
													className={fieldClassName}
													id="ai-city"
													maxLength={80}
													name={field.name}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.cityPlaceholder")}
													value={field.state.value}
												/>
											</FormItem>
										)}
									</form.Field>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<form.Field
										name="email"
										validators={{
											onSubmit: ({ value }) =>
												!value.trim() ||
												z.string().email().safeParse(value.trim()).success
													? undefined
													: t("errors.emailInvalid"),
										}}
									>
										{(field) => (
											<FormItem>
												<OptionalLabel htmlFor="ai-email">
													{t("form.email")}
												</OptionalLabel>
												<Input
													aria-describedby="ai-email-hint"
													aria-invalid={field.state.meta.errors.length > 0}
													autoComplete="email"
													className={fieldClassName}
													id="ai-email"
													maxLength={200}
													name={field.name}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.emailPlaceholder")}
													type="email"
													value={field.state.value}
												/>
												<FormMessage errors={field.state.meta.errors} />
											</FormItem>
										)}
									</form.Field>
									<form.Field name="firstName">
										{(field) => (
											<FormItem>
												<OptionalLabel htmlFor="ai-first-name">
													{t("form.firstName")}
												</OptionalLabel>
												<Input
													autoComplete="given-name"
													className={fieldClassName}
													id="ai-first-name"
													maxLength={100}
													name={field.name}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={t("form.firstNamePlaceholder")}
													value={field.state.value}
												/>
											</FormItem>
										)}
									</form.Field>
								</div>
								<p className="text-muted-foreground text-sm" id="ai-email-hint">
									{t("form.emailHint")}
								</p>

								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<div className="grid gap-3">
											<button
												className={actionVariants({
													size: "md",
													className: "h-11 justify-self-start",
												})}
												disabled={isSubmitting}
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
											<div aria-atomic="true" aria-live="polite">
												{isSubmitting && <Muted>{t("loading")}</Muted>}
												{errorMessage && (
													<Body
														className="text-destructive text-sm"
														role="alert"
													>
														{errorMessage}
													</Body>
												)}
											</div>
										</div>
									)}
								</form.Subscribe>
							</form>
						</div>

						{/* Three steps as ruled columns, as on the WP Health Report */}
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
					</>
				)}
			</GridContainer>
		</section>
	);
}
