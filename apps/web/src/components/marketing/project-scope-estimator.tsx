"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import {
	ActionLink,
	ArrowLink,
	actionVariants,
} from "@/components/marketing/action";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { H1, H2, H3, Lead } from "@/components/ui/typography";
import {
	type Answers,
	answerLabel,
	BANDS,
	driverText,
	type Estimate,
	estimate,
	INTEGRATION_EXCLUSIVE,
	INTEGRATIONS,
	isAnswered,
	isComplete,
	PROJECT_TYPES,
	type ProjectType,
	QUESTION_ORDER,
	type QuestionId,
	questionOptions,
	type SingleQuestionId,
	summaryText,
	toggleIntegration,
} from "@/lib/project-scope";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

export interface ServiceLink {
	slug: string;
	tagline: string;
	title: string;
	/** Full URL, for the copied text. */
	url: string;
}

// Panels and ruled rows as the WP Health Report draws them.
const panelClassName = "surface-card p-6 md:p-8";
const ruleClassName = "border-foreground/[0.08]";
const buttonClassName = actionVariants({ size: "md", className: "h-11" });
const quietButtonClassName = actionVariants({
	size: "md",
	variant: "quiet",
	className: "h-11",
});
// A selectable answer: the inner card corner, outlined in brand once chosen.
const optionClassName =
	"flex cursor-pointer items-start gap-3 rounded-[0.875rem] border border-foreground/[0.1] p-4 transition-colors hover:border-foreground/25 has-[[data-checked]]:border-brand has-[[data-checked]]:bg-brand/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50";
const headingClassName = "scroll-mt-28 outline-none";

const PROJECT_GROUPS = ["launch", "operate", "automate"] as const;
const COPIED_MS = 2000;

/** Three bars, filled up to the band. */
export function BandMeter({
	labels,
	level,
}: {
	labels?: readonly string[];
	level: number;
}) {
	return (
		<div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
			{BANDS.map((band, i) => (
				<div className="flex flex-col gap-2" key={band}>
					<span
						className={cn(
							"h-2 rounded-full",
							i <= level ? "bg-brand" : "bg-foreground/10"
						)}
					/>
					{labels && (
						<span
							className={cn(
								"text-sm",
								i === level ? "text-foreground" : "text-muted-foreground"
							)}
						>
							{labels[i]}
						</span>
					)}
				</div>
			))}
		</div>
	);
}

function OptionCard({
	control,
	description,
	label,
}: {
	control: React.ReactNode;
	description?: string;
	label: string;
}) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: the Base UI control inside renders its own input
		<label className={optionClassName}>
			<span className="mt-1 flex">{control}</span>
			<span className="flex flex-col gap-1">
				<span className="font-medium text-base text-foreground leading-snug">
					{label}
				</span>
				{description && (
					<span className="text-muted-foreground text-sm leading-[1.5]">
						{description}
					</span>
				)}
			</span>
		</label>
	);
}

function SingleChoice({
	answers,
	labelledBy,
	onChange,
	question,
}: {
	answers: Answers;
	labelledBy: string;
	onChange: (value: string) => void;
	question: SingleQuestionId;
}) {
	const t = useTranslations("projectScope");
	const option = (value: string) => {
		const key = `questions.${question}.options.${value}`;
		return (
			<OptionCard
				control={<RadioGroupItem value={value} />}
				description={
					t.has(`${key}.description`) ? t(`${key}.description`) : undefined
				}
				key={value}
				label={t(`${key}.label`)}
			/>
		);
	};

	return (
		<RadioGroup
			aria-labelledby={labelledBy}
			className="gap-3"
			onValueChange={(value) => onChange(String(value))}
			value={answers[question] ?? null}
		>
			{question === "project" ? (
				<>
					<div className="grid gap-x-5 gap-y-8 md:grid-cols-3">
						{PROJECT_GROUPS.map((group) => (
							<div className="grid content-start gap-3" key={group}>
								<p className="text-muted-foreground text-sm">
									{t(`questions.project.groups.${group}`)}
								</p>
								{(Object.keys(PROJECT_TYPES) as ProjectType[])
									.filter((type) => PROJECT_TYPES[type].group === group)
									.map(option)}
							</div>
						))}
					</div>
					<div className="mt-5 grid gap-3">
						<p className="text-muted-foreground text-sm">
							{t("questions.project.groups.other")}
						</p>
						{option("other")}
					</div>
				</>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{questionOptions(question).map(option)}
				</div>
			)}
		</RadioGroup>
	);
}

function IntegrationChoice({
	answers,
	labelledBy,
	onChange,
}: {
	answers: Answers;
	labelledBy: string;
	onChange: (value: Answers["integrations"]) => void;
}) {
	const t = useTranslations("projectScope");
	const current = answers.integrations ?? [];
	return (
		<fieldset
			aria-labelledby={labelledBy}
			className="grid min-w-0 gap-3 sm:grid-cols-2"
		>
			{[...INTEGRATIONS, ...INTEGRATION_EXCLUSIVE].map((value) => (
				<OptionCard
					control={
						<Checkbox
							checked={current.includes(value)}
							onCheckedChange={() =>
								onChange(toggleIntegration(current, value))
							}
						/>
					}
					key={value}
					label={t(`questions.integrations.options.${value}.label`)}
				/>
			))}
		</fieldset>
	);
}

function Questionnaire({
	answers,
	headingRef,
	onAnswer,
	onBack,
	onNext,
	onShowResult,
	step,
}: {
	answers: Answers;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
	onAnswer: (next: Answers) => void;
	onBack: () => void;
	onNext: () => void;
	onShowResult: () => void;
	step: number;
}) {
	const t = useTranslations("projectScope");
	const question = QUESTION_ORDER[step] as QuestionId;
	const total = QUESTION_ORDER.length;
	const isLast = step === total - 1;
	const headingId = `scope-question-${question}`;
	const hintKey = `questions.${question}.hint`;

	return (
		<form
			aria-label={t("form.ariaLabel")}
			className={cn(panelClassName, "md:p-10")}
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				if (isAnswered(answers, question)) {
					onNext();
				}
			}}
		>
			<Progress className="gap-2" value={((step + 1) / total) * 100}>
				<ProgressLabel className="text-muted-foreground text-sm tabular-nums">
					{t("form.progress", { current: step + 1, total })}
				</ProgressLabel>
			</Progress>

			<H2
				className={cn("mt-8 md:text-[2rem]", headingClassName)}
				id={headingId}
				ref={headingRef}
				tabIndex={-1}
			>
				{t(`questions.${question}.title`)}
			</H2>
			{t.has(hintKey) && (
				<p className="mt-2 text-base text-muted-foreground leading-[1.6]">
					{t(hintKey)}
				</p>
			)}

			<div className="mt-8" key={question}>
				{question === "integrations" ? (
					<IntegrationChoice
						answers={answers}
						labelledBy={headingId}
						onChange={(integrations) => onAnswer({ ...answers, integrations })}
					/>
				) : (
					<SingleChoice
						answers={answers}
						labelledBy={headingId}
						onChange={(value) => onAnswer({ ...answers, [question]: value })}
						question={question}
					/>
				)}
			</div>

			<div
				className={cn(
					"mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6",
					ruleClassName
				)}
			>
				{step > 0 ? (
					<button
						className={quietButtonClassName}
						onClick={onBack}
						type="button"
					>
						{t("form.back")}
					</button>
				) : (
					<span />
				)}
				<div className="flex flex-wrap gap-3">
					{!isLast && isComplete(answers) && (
						<button
							className={quietButtonClassName}
							onClick={onShowResult}
							type="button"
						>
							{t("form.finish")}
						</button>
					)}
					<button
						className={buttonClassName}
						disabled={!isAnswered(answers, question)}
						type="submit"
					>
						{isLast ? t("form.finish") : t("form.next")}
					</button>
				</div>
			</div>
		</form>
	);
}

function RuledList({ items }: { items: string[] }) {
	return (
		<ul className={cn("mt-5 border-t", ruleClassName)}>
			{items.map((item) => (
				<li
					className={cn(
						"border-b py-3 text-base text-foreground leading-[1.6]",
						ruleClassName
					)}
					key={item}
				>
					{item}
				</li>
			))}
		</ul>
	);
}

function Result({
	answers,
	headingRef,
	onEdit,
	onRestart,
	result,
	services,
	servicesUrl,
	toolUrl,
}: {
	answers: Answers;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
	onEdit: () => void;
	onRestart: () => void;
	result: Estimate;
	services: Partial<Record<ProjectType, ServiceLink>>;
	servicesUrl: string;
	toolUrl: string;
}) {
	const t = useTranslations("projectScope");
	const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
		"idle"
	);
	const project = answers.project as ProjectType;
	const service = result.service ? services[project] : undefined;
	const group = PROJECT_TYPES[project].group;
	const summary = summaryText({
		answers,
		result,
		service: service ?? { title: t("result.serviceOther"), url: servicesUrl },
		t,
		toolUrl,
	});

	async function copy() {
		try {
			await navigator.clipboard.writeText(summary);
			setCopyState("copied");
			track("scope_estimate_copied", { band: result.band });
			window.setTimeout(() => setCopyState("idle"), COPIED_MS);
		} catch {
			setCopyState("failed");
		}
	}

	return (
		<div className="stagger-visible">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<H2 className={headingClassName} ref={headingRef} tabIndex={-1}>
					{t("result.title")}
				</H2>
				<div className="flex flex-wrap gap-3">
					<button
						className={quietButtonClassName}
						onClick={onEdit}
						type="button"
					>
						{t("result.edit")}
					</button>
					<button
						className={quietButtonClassName}
						onClick={onRestart}
						type="button"
					>
						{t("result.restart")}
					</button>
				</div>
			</div>

			<div className="mt-10 grid gap-5">
				<div
					className={cn(
						panelClassName,
						"grid gap-8 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center md:gap-12"
					)}
				>
					<div>
						<p className="text-muted-foreground text-sm">
							{t("result.bandLabel")}
						</p>
						<p className="mt-2 font-display text-4xl text-brand-readable leading-none tracking-[-0.03em] md:text-5xl">
							{t(`bands.${result.band}.title`)}
						</p>
						<p className="mt-4 max-w-[52ch] text-base text-muted-foreground leading-[1.6]">
							{t(`bands.${result.band}.description`)}
						</p>
					</div>
					<BandMeter
						labels={BANDS.map((band) => t(`bands.${band}.title`))}
						level={BANDS.indexOf(result.band)}
					/>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					<div className={panelClassName}>
						<H3 className="text-xl">{t("result.driversTitle")}</H3>
						<RuledList
							items={
								result.drivers.length > 0
									? result.drivers.map((q) => driverText(answers, q, t))
									: [t("drivers.none")]
							}
						/>
					</div>
					<div className={panelClassName}>
						<H3 className="text-xl">{t("result.clarifyTitle")}</H3>
						<RuledList
							items={[
								t("clarify.goals"),
								...result.openQuestions.map((q) => t(`clarify.${q}`)),
							]}
						/>
					</div>
				</div>

				<div className={panelClassName}>
					<H3 className="text-xl">{t("result.serviceTitle")}</H3>
					{group && (
						<p className="mt-2 text-muted-foreground text-sm">
							{t(`questions.project.groups.${group}`)}
						</p>
					)}
					<p className="mt-4 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
						{service?.tagline ?? t("result.serviceOtherText")}
					</p>
					<ArrowLink
						className="mt-5"
						href={
							service
								? {
										pathname: "/services/[slug]",
										params: { slug: service.slug },
									}
								: "/services"
						}
					>
						{service?.title ?? t("result.serviceOther")}
					</ArrowLink>
				</div>

				<div
					className={cn(
						panelClassName,
						"grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-12"
					)}
				>
					<div>
						<H3 className="text-xl">{t("result.ctaTitle")}</H3>
						<p className="mt-2 max-w-[60ch] text-base text-muted-foreground leading-[1.6]">
							{t("result.ctaText")}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							className={quietButtonClassName}
							onClick={copy}
							type="button"
						>
							{copyState === "copied" ? (
								<Check aria-hidden="true" className="size-4" />
							) : (
								<Copy aria-hidden="true" className="size-4" />
							)}
							{copyState === "copied" ? t("result.copied") : t("result.copy")}
						</button>
						<ActionLink
							className="h-11"
							href="/book"
							location="scope_estimate_result"
							size="md"
						>
							{t("result.book")}
						</ActionLink>
					</div>
					<div aria-live="polite" className="empty:hidden md:col-span-2">
						{copyState === "failed" && (
							<>
								<p className="text-base text-foreground">
									{t("result.copyFailed")}
								</p>
								<Textarea
									className="mt-3 min-h-64 text-sm md:text-sm"
									onFocus={(e) => e.currentTarget.select()}
									readOnly
									value={summary}
								/>
							</>
						)}
					</div>
				</div>

				<div className={panelClassName}>
					<H3 className="text-xl">{t("result.answersTitle")}</H3>
					<dl className={cn("mt-5 border-t", ruleClassName)}>
						{QUESTION_ORDER.map((question) => (
							<div
								className={cn(
									"grid gap-x-8 gap-y-1 border-b py-3 sm:grid-cols-[12rem_1fr]",
									ruleClassName
								)}
								key={question}
							>
								<dt className="text-muted-foreground text-sm sm:text-base">
									{t(`questions.${question}.short`)}
								</dt>
								<dd className="text-base text-foreground">
									{answerLabel(answers, question, t)}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}

export default function ProjectScopeEstimator({
	services,
	servicesUrl,
	toolUrl,
}: {
	services: Partial<Record<ProjectType, ServiceLink>>;
	/** Full URL of the services overview, for the copied text. */
	servicesUrl: string;
	/** Full URL of this page, for the copied text. */
	toolUrl: string;
}) {
	const t = useTranslations("projectScope");
	const [answers, setAnswers] = useState<Answers>({});
	const [step, setStep] = useState(0);
	const [showResult, setShowResult] = useState(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	// Focus follows the visitor from question to question, but not on load.
	const hasMoved = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: refocus whenever the step or view changes
	useEffect(() => {
		if (hasMoved.current) {
			headingRef.current?.focus();
		}
	}, [step, showResult]);

	function go(next: () => void) {
		hasMoved.current = true;
		next();
	}

	function finish() {
		go(() => setShowResult(true));
		const result = estimate(answers);
		track("scope_estimate_completed", {
			band: result.band,
			project: answers.project ?? null,
		});
	}

	const result = showResult && isComplete(answers) ? estimate(answers) : null;

	return (
		<section
			className="section-inverted relative border-grid-line border-t py-16 md:py-32"
			id="project-scope"
		>
			<ConstructedGrid variant="section" />
			<GridContainer width="media">
				{result ? (
					<Result
						answers={answers}
						headingRef={headingRef}
						onEdit={() =>
							go(() => {
								setStep(0);
								setShowResult(false);
							})
						}
						onRestart={() =>
							go(() => {
								setAnswers({});
								setStep(0);
								setShowResult(false);
							})
						}
						result={result}
						services={services}
						servicesUrl={servicesUrl}
						toolUrl={toolUrl}
					/>
				) : (
					<>
						<div className="grid gap-12 md:grid-cols-2 md:gap-16">
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
							<ul
								className={cn(
									"hidden self-end border-t md:block",
									ruleClassName
								)}
							>
								{[0, 1, 2, 3].map((i) => (
									<li
										className={cn(
											"border-b py-3 text-base text-foreground",
											ruleClassName
										)}
										key={i}
									>
										{t(`hero.includes.${i}`)}
									</li>
								))}
							</ul>
						</div>

						<div className="mt-12 md:mt-16">
							<Questionnaire
								answers={answers}
								headingRef={headingRef}
								onAnswer={setAnswers}
								onBack={() => go(() => setStep((s) => Math.max(0, s - 1)))}
								onNext={() =>
									step === QUESTION_ORDER.length - 1
										? finish()
										: go(() => setStep((s) => s + 1))
								}
								onShowResult={finish}
								step={step}
							/>
						</div>
					</>
				)}
			</GridContainer>
		</section>
	);
}
