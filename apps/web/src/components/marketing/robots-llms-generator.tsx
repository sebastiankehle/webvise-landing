"use client";

import { TRPCClientError } from "@trpc/client";
import {
	type CrawlerKind,
	GENERATOR_CRAWLERS,
} from "@webvise-app/api/services/robots-llms/crawlers";
import type { PrefillResult } from "@webvise-app/api/services/robots-llms/prefill";
import { Check, Copy, Download, Loader2, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { actionVariants } from "@/components/marketing/action";
import SectionWrapper, {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Body, H1, H2, H3, Lead, Muted } from "@/components/ui/typography";
import {
	type Access,
	type AccessPreset,
	accessFromBlocked,
	buildLlmsTxt,
	buildRobotsTxt,
	CRAWLER_KINDS,
	type CrawlerAccess,
	type LlmsLinkInput,
	type LlmsSectionInput,
	normalizeSiteUrl,
	parsePathList,
	presetAccess,
	sectionsFromUrls,
} from "@/lib/robots-llms";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

// The site's form controls, as on the health report: 44 px fields with 16 px
// text. Editor rows use a denser field.
const fieldClassName =
	"h-11 rounded-sm bg-background px-3.5 text-base md:text-base";
const smallFieldClassName =
	"h-10 rounded-sm bg-background px-3 text-sm md:text-sm";
const textareaClassName =
	"rounded-sm bg-background px-3.5 py-2.5 text-base md:text-base";
const pathsClassName =
	"min-h-28 rounded-sm bg-background px-3.5 py-2.5 font-mono normal-case text-sm md:text-sm";
const submitClassName = actionVariants({ size: "md", className: "h-11" });
const quietClassName = actionVariants({ size: "md", variant: "quiet" });
const ruleClassName = "border-foreground/[0.08]";
const hintClassName = "text-muted-foreground text-sm leading-[1.6]";
const labelClassName = "font-medium text-base text-foreground";

const PRESETS: readonly AccessPreset[] = [
	"allowAll",
	"blockTraining",
	"blockAi",
];

type Crawler = (typeof GENERATOR_CRAWLERS)[number];

interface EditableLink extends LlmsLinkInput {
	id: number;
}

interface EditableSection extends LlmsSectionInput {
	id: number;
	links: EditableLink[];
}

// Keys for editor rows. They never reach the DOM, so server and client may
// count differently.
let lastId = 0;
function newId(): number {
	lastId += 1;
	return lastId;
}

function emptyLink(): EditableLink {
	return { id: newId(), title: "", url: "", note: "" };
}

function toEditable(section: LlmsSectionInput): EditableSection {
	return {
		id: newId(),
		title: section.title,
		links: section.links.map((link) => ({ ...link, id: newId() })),
	};
}

interface PrefillSummary {
	host: string;
	linkCount: number;
	metaFound: boolean;
	robotsFound: boolean;
	sitemapFound: boolean;
}

function StatusRow({
	ok,
	children,
}: {
	ok: boolean;
	children: React.ReactNode;
}) {
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

function PrefillStatus({ summary }: { summary: PrefillSummary }) {
	const t = useTranslations("robotsLlmsGenerator");
	let sitemapText = t("prefill.sitemapMissing");
	if (summary.sitemapFound) {
		sitemapText =
			summary.linkCount > 0
				? t("prefill.sitemapFound", { count: summary.linkCount })
				: t("prefill.sitemapEmpty");
	}
	return (
		<div className="mt-3">
			<p className={hintClassName}>
				{t("prefill.resultsFor", { host: summary.host })}
			</p>
			<ul className={cn("mt-2 border-t", ruleClassName)}>
				<StatusRow ok={summary.robotsFound}>
					{summary.robotsFound
						? t("prefill.robotsFound")
						: t("prefill.robotsMissing")}
				</StatusRow>
				<StatusRow ok={summary.linkCount > 0}>{sitemapText}</StatusRow>
				<StatusRow ok={summary.metaFound}>
					{summary.metaFound
						? t("prefill.metaFound")
						: t("prefill.metaMissing")}
				</StatusRow>
			</ul>
		</div>
	);
}

/** Allow or Block, as one radio group per crawler. */
function AccessToggle({
	label,
	onChange,
	value,
}: {
	label: string;
	onChange: (value: Access) => void;
	value: Access;
}) {
	const t = useTranslations("robotsLlmsGenerator");
	const name = useId();
	return (
		<fieldset className="inline-flex shrink-0 self-start rounded-sm bg-foreground/[0.06] p-1 sm:self-center">
			<legend className="sr-only">{label}</legend>
			{(["allow", "block"] as const).map((option) => {
				const checked = value === option;
				let tone = "text-muted-foreground hover:text-foreground";
				if (checked) {
					tone =
						option === "block"
							? "bg-background text-destructive shadow-xs"
							: "bg-background text-foreground shadow-xs";
				}
				return (
					<label
						className={cn(
							"cursor-pointer select-none rounded-[4px] px-3.5 py-1.5 font-medium text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70",
							tone
						)}
						key={option}
					>
						<input
							checked={checked}
							className="sr-only"
							name={name}
							onChange={() => onChange(option)}
							type="radio"
							value={option}
						/>
						{t(`robots.${option}`)}
					</label>
				);
			})}
		</fieldset>
	);
}

function CrawlerRow({
	crawler,
	onChange,
	value,
}: {
	crawler: Crawler;
	onChange: (value: Access) => void;
	value: Access;
}) {
	const t = useTranslations("robotsLlmsGenerator");
	return (
		<li
			className={cn(
				"flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
				ruleClassName
			)}
		>
			<div className="min-w-0">
				<p className="flex flex-wrap items-baseline gap-x-2">
					<span className="font-mono text-foreground text-sm normal-case">
						{crawler.name}
					</span>
					<span className="text-muted-foreground text-sm">{crawler.owner}</span>
				</p>
				<p className={cn("mt-1 max-w-[56ch]", hintClassName)}>
					{t(`robots.crawlers.${crawler.name}`)}
				</p>
			</div>
			<AccessToggle label={crawler.name} onChange={onChange} value={value} />
		</li>
	);
}

function TextField({
	hint,
	label,
	multiline = false,
	onChange,
	placeholder,
	rows,
	textareaClass = textareaClassName,
	value,
}: {
	hint?: string;
	label: string;
	multiline?: boolean;
	onChange: (value: string) => void;
	placeholder?: string;
	rows?: number;
	textareaClass?: string;
	value: string;
}) {
	const id = useId();
	const hintId = `${id}-hint`;
	const shared = {
		"aria-describedby": hint ? hintId : undefined,
		id,
		onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			onChange(e.target.value),
		placeholder,
		value,
	};
	return (
		<FormItem>
			<FormLabel className={labelClassName} htmlFor={id}>
				{label}
			</FormLabel>
			{multiline ? (
				<Textarea
					className={textareaClass}
					rows={rows}
					spellCheck={textareaClass !== pathsClassName}
					{...shared}
				/>
			) : (
				<Input className={fieldClassName} {...shared} />
			)}
			{hint && (
				<p className={hintClassName} id={hintId}>
					{hint}
				</p>
			)}
		</FormItem>
	);
}

function IconButton({
	children,
	label,
	onClick,
}: {
	children: React.ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			aria-label={label}
			className="grid size-10 shrink-0 place-items-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
			onClick={onClick}
			title={label}
			type="button"
		>
			{children}
		</button>
	);
}

function SectionEditor({
	onChange,
	onRemove,
	section,
}: {
	onChange: (section: EditableSection) => void;
	onRemove: () => void;
	section: EditableSection;
}) {
	const t = useTranslations("robotsLlmsGenerator");
	const titleId = useId();

	function updateLink(id: number, patch: Partial<LlmsLinkInput>) {
		onChange({
			...section,
			links: section.links.map((link) =>
				link.id === id ? { ...link, ...patch } : link
			),
		});
	}

	return (
		<div className="surface-card p-5">
			<div className="flex items-end gap-3">
				<FormItem className="flex-1">
					<FormLabel
						className="text-muted-foreground text-sm"
						htmlFor={titleId}
					>
						{t("llms.sectionTitle")}
					</FormLabel>
					<Input
						className={fieldClassName}
						id={titleId}
						onChange={(e) => onChange({ ...section, title: e.target.value })}
						value={section.title}
					/>
				</FormItem>
				<IconButton label={t("llms.removeSection")} onClick={onRemove}>
					<Trash2 aria-hidden="true" className="size-4" />
				</IconButton>
			</div>
			<ul className="mt-4 grid gap-3">
				{section.links.map((link) => (
					<li
						className={cn(
							"grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t pt-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]",
							ruleClassName
						)}
						key={link.id}
					>
						<Input
							aria-label={t("llms.linkTitle")}
							className={cn(smallFieldClassName, "col-start-1 row-start-1")}
							onChange={(e) => updateLink(link.id, { title: e.target.value })}
							placeholder={t("llms.linkTitle")}
							value={link.title}
						/>
						<Input
							aria-label={t("llms.linkUrl")}
							className={cn(
								smallFieldClassName,
								"col-span-2 font-mono normal-case sm:col-span-1 sm:col-start-2 sm:row-start-1"
							)}
							onChange={(e) => updateLink(link.id, { url: e.target.value })}
							placeholder="https://"
							spellCheck={false}
							type="url"
							value={link.url}
						/>
						<Input
							aria-label={t("llms.linkNote")}
							className={cn(smallFieldClassName, "col-span-2 sm:col-start-1")}
							onChange={(e) => updateLink(link.id, { note: e.target.value })}
							placeholder={t("llms.linkNote")}
							value={link.note}
						/>
						<div className="col-start-2 row-start-1 sm:col-start-3">
							<IconButton
								label={t("llms.removeLink")}
								onClick={() =>
									onChange({
										...section,
										links: section.links.filter((l) => l.id !== link.id),
									})
								}
							>
								<X aria-hidden="true" className="size-4" />
							</IconButton>
						</div>
					</li>
				))}
			</ul>
			<button
				className={cn(quietClassName, "mt-4")}
				onClick={() =>
					onChange({ ...section, links: [...section.links, emptyLink()] })
				}
				type="button"
			>
				<Plus aria-hidden="true" className="size-4" />
				{t("llms.addLink")}
			</button>
		</div>
	);
}

/** A generated file with copy and download. */
function OutputPanel({
	fileName,
	hint,
	text,
}: {
	fileName: "robots.txt" | "llms.txt";
	hint?: string;
	text: string;
}) {
	const t = useTranslations("robotsLlmsGenerator");
	const [copied, setCopied] = useState(false);
	const codeRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!copied) {
			return;
		}
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			track("robots_llms_copied", { file: fileName });
		} catch {
			// Clipboard blocked: select the file so the visitor can copy it.
			const selection = window.getSelection();
			if (codeRef.current && selection) {
				selection.selectAllChildren(codeRef.current);
			}
		}
	}

	function handleDownload() {
		const href = URL.createObjectURL(
			new Blob([text], { type: "text/plain;charset=utf-8" })
		);
		const link = document.createElement("a");
		link.href = href;
		link.download = fileName;
		link.click();
		setTimeout(() => URL.revokeObjectURL(href), 1000);
		track("robots_llms_downloaded", { file: fileName });
	}

	return (
		<div className="lg:sticky lg:top-24 lg:self-start">
			<div className="surface-card overflow-hidden">
				<div
					className={cn(
						"flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3",
						ruleClassName
					)}
				>
					<span className="font-mono text-foreground text-sm normal-case">
						{fileName}
					</span>
					<div className="flex gap-2">
						<button
							className={quietClassName}
							onClick={handleCopy}
							type="button"
						>
							{copied ? (
								<Check aria-hidden="true" className="size-4" />
							) : (
								<Copy aria-hidden="true" className="size-4" />
							)}
							{copied ? t("output.copied") : t("output.copy")}
						</button>
						<button
							className={actionVariants({ size: "md" })}
							onClick={handleDownload}
							type="button"
						>
							<Download aria-hidden="true" className="size-4" />
							{t("output.download")}
						</button>
					</div>
				</div>
				<pre className="max-h-[min(70vh,36rem)] overflow-auto whitespace-pre-wrap p-5 font-mono text-[0.8125rem] text-foreground normal-case leading-6 [overflow-wrap:anywhere]">
					<code ref={codeRef}>{text}</code>
				</pre>
				<span aria-live="polite" className="sr-only">
					{copied ? t("output.copied") : ""}
				</span>
			</div>
			{hint && <p className={cn("mt-3", hintClassName)}>{hint}</p>}
		</div>
	);
}

export default function RobotsLlmsGenerator() {
	const t = useTranslations("robotsLlmsGenerator");
	const urlId = useId();
	const [urlInput, setUrlInput] = useState("");
	const [urlError, setUrlError] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [summary, setSummary] = useState<PrefillSummary | null>(null);

	const [access, setAccess] = useState<CrawlerAccess>(() =>
		presetAccess("allowAll")
	);
	const [disallowText, setDisallowText] = useState("");
	const [allowText, setAllowText] = useState("");
	const [sitemapUrl, setSitemapUrl] = useState("");

	const [siteName, setSiteName] = useState("");
	const [summaryText, setSummaryText] = useState("");
	const [details, setDetails] = useState("");
	const [sections, setSections] = useState<EditableSection[]>(() => [
		{ id: newId(), title: t("llms.defaultSection"), links: [emptyLink()] },
	]);

	const siteUrl = normalizeSiteUrl(urlInput);
	const robotsTxt = buildRobotsTxt({
		access,
		allowPaths: parsePathList(allowText),
		disallowPaths: parsePathList(disallowText),
		sitemapUrl,
	});
	const llmsTxt = buildLlmsTxt({
		details,
		sections,
		siteName,
		siteUrl,
		summary: summaryText,
	});

	function applyPrefill(result: PrefillResult) {
		const host = new URL(result.siteUrl).host;
		const found = sectionsFromUrls(result.pageUrls, {
			rootTitle: t("llms.defaultSection"),
		});
		setUrlInput(result.siteUrl);
		setAccess(accessFromBlocked(result.robots.blocked));
		setDisallowText(result.robots.disallow.join("\n"));
		setAllowText(result.robots.allow.join("\n"));
		setSitemapUrl(result.sitemapUrl ?? result.robots.sitemaps[0] ?? "");
		setSiteName(result.siteName ?? result.title ?? host);
		setSummaryText(result.description ?? "");
		if (found.length > 0) {
			setSections(found.map(toEditable));
		}
		setSummary({
			host,
			linkCount: found.reduce((n, s) => n + s.links.length, 0),
			metaFound: Boolean(result.title || result.description),
			robotsFound: result.robots.found,
			sitemapFound: result.sitemapUrl !== null,
		});
	}

	function prefillError(err: unknown): string {
		if (err instanceof TRPCClientError) {
			if (err.data?.code === "TOO_MANY_REQUESTS") {
				return t("errors.rateLimited");
			}
			if (err.data?.code === "BAD_REQUEST") {
				return t("errors.unreachable");
			}
		}
		return t("errors.failed");
	}

	async function handlePrefill(e: React.FormEvent) {
		e.preventDefault();
		setErrorMessage("");
		if (!urlInput.trim()) {
			setUrlError(t("errors.urlRequired"));
			return;
		}
		const origin = normalizeSiteUrl(urlInput);
		if (!origin) {
			setUrlError(t("errors.urlInvalid"));
			return;
		}
		setUrlError("");
		setLoading(true);
		track("robots_llms_prefill_submitted", { url: origin });
		try {
			const result = await trpcClient.robotsLlms.prefill.mutate({
				url: origin,
			});
			applyPrefill(result);
			track("robots_llms_prefill_success", {
				url: origin,
				robots_found: result.robots.found,
				page_urls: result.pageUrls.length,
			});
		} catch (err) {
			setErrorMessage(prefillError(err));
			track("robots_llms_prefill_error", { url: origin });
		} finally {
			setLoading(false);
		}
	}

	function updateSection(next: EditableSection) {
		setSections((prev) => prev.map((s) => (s.id === next.id ? next : s)));
	}

	return (
		<>
			<section
				className="section-inverted relative border-grid-line border-t py-16 md:py-32"
				id="robots-llms-generator"
			>
				<ConstructedGrid variant="section" />
				<GridContainer width="media">
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
								aria-label={t("prefill.ariaLabel")}
								autoComplete="off"
								className="grid gap-3"
								noValidate
								onSubmit={handlePrefill}
							>
								<FormLabel className={labelClassName} htmlFor={urlId}>
									{t("prefill.label")}
								</FormLabel>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
									<FormItem className="flex-1">
										<Input
											aria-describedby={`${urlId}-hint`}
											aria-invalid={!!urlError}
											autoComplete="off"
											className={fieldClassName}
											id={urlId}
											onChange={(e) => setUrlInput(e.target.value)}
											placeholder={t("prefill.placeholder")}
											type="url"
											value={urlInput}
										/>
										<FormMessage errors={urlError ? [urlError] : []} />
									</FormItem>
									<button
										className={submitClassName}
										disabled={loading}
										type="submit"
									>
										{loading && (
											<Loader2
												aria-hidden="true"
												className="size-4 animate-spin"
											/>
										)}
										{t("prefill.submit")}
									</button>
								</div>
								<Muted id={`${urlId}-hint`}>{t("prefill.hint")}</Muted>
								<div aria-atomic="true" aria-live="polite">
									{loading && <Muted>{t("prefill.loading")}</Muted>}
									{errorMessage && (
										<Body className="text-destructive text-sm" role="alert">
											{errorMessage}
										</Body>
									)}
									{summary && !loading && <PrefillStatus summary={summary} />}
								</div>
							</form>
						</div>
					</div>

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
				</GridContainer>
			</section>

			<SectionWrapper id="robots-txt">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-12">
					<div>
						<H2>{t("robots.title")}</H2>
						<Lead className="mt-4 max-w-[52ch]">{t("robots.subtitle")}</Lead>

						<div className="mt-8 flex flex-wrap items-center gap-2">
							<span className="mr-1 text-muted-foreground text-sm">
								{t("robots.presetsLabel")}
							</span>
							{PRESETS.map((preset) => (
								<button
									className={quietClassName}
									key={preset}
									onClick={() => setAccess(presetAccess(preset))}
									type="button"
								>
									{t(`robots.presets.${preset}`)}
								</button>
							))}
						</div>

						{CRAWLER_KINDS.map((kind: CrawlerKind) => (
							<div className="mt-10" key={kind}>
								<H3 className="text-xl">{t(`robots.kinds.${kind}.title`)}</H3>
								<p className={cn("mt-1 max-w-[60ch]", hintClassName)}>
									{t(`robots.kinds.${kind}.description`)}
								</p>
								<ul className={cn("mt-4 border-t", ruleClassName)}>
									{GENERATOR_CRAWLERS.filter((c) => c.kind === kind).map(
										(crawler) => (
											<CrawlerRow
												crawler={crawler}
												key={crawler.name}
												onChange={(value) =>
													setAccess((prev) => ({
														...prev,
														[crawler.name]: value,
													}))
												}
												value={access[crawler.name]}
											/>
										)
									)}
								</ul>
							</div>
						))}

						<div className="mt-10 grid gap-5 sm:grid-cols-2">
							<TextField
								hint={t("robots.disallowHint")}
								label={t("robots.disallowLabel")}
								multiline
								onChange={setDisallowText}
								placeholder="/wp-admin/"
								rows={4}
								textareaClass={pathsClassName}
								value={disallowText}
							/>
							<TextField
								hint={t("robots.allowHint")}
								label={t("robots.allowLabel")}
								multiline
								onChange={setAllowText}
								placeholder="/wp-admin/admin-ajax.php"
								rows={4}
								textareaClass={pathsClassName}
								value={allowText}
							/>
						</div>
						<div className="mt-5">
							<TextField
								label={t("robots.sitemapLabel")}
								onChange={setSitemapUrl}
								placeholder={t("robots.sitemapPlaceholder")}
								value={sitemapUrl}
							/>
						</div>
					</div>
					<OutputPanel
						fileName="robots.txt"
						hint={t("robots.replaceHint")}
						text={robotsTxt}
					/>
				</div>
			</SectionWrapper>

			<SectionWrapper id="llms-txt" surface="alternate">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-12">
					<div>
						<H2>{t("llms.title")}</H2>
						<Lead className="mt-4 max-w-[52ch]">{t("llms.subtitle")}</Lead>

						<div className="mt-8 grid gap-5">
							<TextField
								label={t("llms.siteName")}
								onChange={setSiteName}
								placeholder={t("llms.siteNamePlaceholder")}
								value={siteName}
							/>
							<TextField
								label={t("llms.summary")}
								multiline
								onChange={setSummaryText}
								placeholder={t("llms.summaryPlaceholder")}
								rows={2}
								value={summaryText}
							/>
							<TextField
								label={t("llms.details")}
								multiline
								onChange={setDetails}
								placeholder={t("llms.detailsPlaceholder")}
								rows={3}
								value={details}
							/>
						</div>

						<div className="mt-10">
							<H3 className="text-xl">{t("llms.sectionsLabel")}</H3>
							<p className={cn("mt-1 max-w-[60ch]", hintClassName)}>
								{t("llms.sectionsHint")}
							</p>
							<div className="mt-5 grid gap-4">
								{sections.map((section) => (
									<SectionEditor
										key={section.id}
										onChange={updateSection}
										onRemove={() =>
											setSections((prev) =>
												prev.filter((s) => s.id !== section.id)
											)
										}
										section={section}
									/>
								))}
							</div>
							<button
								className={cn(quietClassName, "mt-4")}
								onClick={() =>
									setSections((prev) => [
										...prev,
										{
											id: newId(),
											title: t("llms.newSection"),
											links: [emptyLink()],
										},
									])
								}
								type="button"
							>
								<Plus aria-hidden="true" className="size-4" />
								{t("llms.addSection")}
							</button>
						</div>
					</div>
					<OutputPanel fileName="llms.txt" text={llmsTxt} />
				</div>
			</SectionWrapper>
		</>
	);
}
