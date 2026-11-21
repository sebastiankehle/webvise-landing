import { Check, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import Logo from "@/components/logo";
import { ActionLink } from "@/components/marketing/action";
import { BrandNav } from "@/components/marketing/brand-nav";
import { GuideSection } from "@/components/marketing/guide-section";
import { LogoFiles, PROFILES } from "@/components/marketing/logo-files";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Body, H2, H3 } from "@/components/ui/typography";
import {
	ClearSpace,
	Figure,
	type Ground,
	INK,
	type MisuseKind,
	MisuseMark,
	SmallestSizes,
	StepMark,
	Tile,
	WrongLabel,
} from "./brand-figures";
import { PARTS } from "./brand-hero";
import { ConstructionViewer, type PlateKey } from "./construction-viewer";
import { CopyValue } from "./copy-value";
import { LogoStage } from "./logo-stage";
import { MeaningExplorer, type ReadingKey } from "./meaning-explorer";
import { type TypeStepKey, TypeTester } from "./type-tester";

const SECTIONS = [
	"meaning",
	"logo",
	"construction",
	"colour",
	"type",
	"voice",
	"use",
	"misuse",
] as const;

const READING_KEYS = [
	"craft",
	"height",
	"ai",
	"angle",
] as const satisfies readonly ReadingKey[];

const PLATE_KEYS = [
	"sheet",
	"measures",
	"lockup",
	"stacked",
	"icon",
] as const satisfies readonly PlateKey[];

/** The relations the construction sheet shows, in its legend. */
const SHEET_POINTS = [
	"pitch",
	"lean",
	"ends",
	"wedge",
	"contact",
	"corner",
	"levels",
	"centres",
] as const;

/** What the key says about each part, besides its name. */
const KEY_ROWS = ["step", "history", "shape"] as const;

const SWATCHES = [
	{
		key: "ink",
		hex: "#0e1217",
		rgb: "rgb(14, 18, 23)",
		oklch: "oklch(0.18 0.012 250)",
		color: "#eceff1",
		tone: "dark",
	},
	{
		key: "dark",
		hex: "#050a0f",
		rgb: "rgb(5, 10, 15)",
		oklch: "oklch(0.14 0.014 250)",
		color: "#eceff1",
		tone: "dark",
	},
	{
		key: "paper",
		hex: "#f8fafb",
		rgb: "rgb(248, 250, 251)",
		oklch: "oklch(0.984 0.0025 245)",
		color: "#0e1217",
		tone: "light",
	},
	{
		key: "orange",
		hex: "#ff8918",
		rgb: "rgb(255, 137, 24)",
		oklch: "oklch(0.75 0.18 55)",
		color: "#0e1217",
		tone: "light",
	},
] as const;

/** How much of a page each colour takes, as flex shares of one bar. */
const SHARES = [
	{ key: "paper", hex: "#f8fafb", share: 62, text: "#585e65" },
	{ key: "ink", hex: "#0e1217", share: 22, text: "#b0b9c0" },
	{ key: "dark", hex: "#050a0f", share: 10, text: "#b0b9c0" },
	{ key: "orange", hex: "#ff8918", share: 6, text: "#0e1217" },
] as const;

const PAIRS = [
	{ key: "inkPaper", fg: "#0e1217", bg: "#f8fafb" },
	{ key: "whiteDark", fg: "#ffffff", bg: "#050a0f" },
	{ key: "orangeDark", fg: "#ff8918", bg: "#050a0f" },
	{ key: "whiteOrange", fg: "#ffffff", bg: "#ff8918" },
	{ key: "orangePaper", fg: "#ff8918", bg: "#f8fafb" },
] as const;

/** WCAG 2.2 relative luminance and contrast ratio. */
function luminance(hex: string) {
	const channels = [1, 3, 5].map((i) => {
		const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return (
		0.2126 * (channels[0] ?? 0) +
		0.7152 * (channels[1] ?? 0) +
		0.0722 * (channels[2] ?? 0)
	);
}

function contrast(a: string, b: string) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

function contrastLevel(ratio: number) {
	if (ratio >= 7) {
		return "aaa";
	}
	if (ratio >= 4.5) {
		return "aa";
	}
	if (ratio >= 3) {
		return "large";
	}
	return "low";
}

const TYPE_STEPS = [
	"display",
	"title",
	"section",
	"heading",
	"body",
	"small",
] as const satisfies readonly TypeStepKey[];

const WEIGHTS = [
	{ key: "regular", className: "font-normal" },
	{ key: "medium", className: "font-medium" },
] as const;

const CHARSET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ÄÖÜäöüß €&@%?!";

const VOICE_RULES = ["name", "short", "active", "cut", "plain"] as const;

const MISUSES = [
	{ kind: "colour", ground: "paper" },
	{ kind: "tints", ground: "panel" },
	{ kind: "wedge", ground: "panel" },
	{ kind: "stretch", ground: "paper" },
	{ kind: "inkOrange", ground: "orange" },
	{ kind: "rotate", ground: "panel" },
	{ kind: "font", ground: "paper" },
	{ kind: "effects", ground: "panel" },
] as const satisfies readonly { kind: MisuseKind; ground: Ground }[];

export default function BrandContent() {
	const t = useTranslations("brand");
	const locale = useLocale();
	const ratio = new Intl.NumberFormat(locale, {
		maximumFractionDigits: 1,
		minimumFractionDigits: 1,
	});

	return (
		<div>
			<BrandNav
				items={SECTIONS.map((id) => ({ id, label: t(`nav.${id}`) }))}
				label={t("navLabel")}
			/>

			<GuideSection
				id="meaning"
				paragraphs={[t("sections.meaning.body"), t("sections.meaning.intro")]}
				title={t("sections.meaning.title")}
			>
				<StaggerChildren
					aria-label={t("sections.meaning.key.label")}
					as="ol"
					className="grid gap-4 md:grid-cols-3"
				>
					{PARTS.map((key, i) => (
						<li
							className="surface-card flex flex-col p-6 md:p-8"
							key={key}
							style={{ "--card": i } as CSSProperties}
						>
							<StepMark className="h-auto w-24" step={i + 1} />
							<H3 className="mt-8">{t(`parts.${key}.name`)}</H3>
							<dl className="mt-4 border-grid-line border-t text-sm leading-6">
								{KEY_ROWS.map((row) => (
									<div
										className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-grid-line border-b py-3 last:border-b-0 last:pb-0"
										key={row}
									>
										<dt className="text-muted-foreground">
											{t(`sections.meaning.key.${row}`)}
										</dt>
										<dd className="text-foreground">
											{t(`parts.${key}.${row}`)}
										</dd>
									</div>
								))}
							</dl>
						</li>
					))}
				</StaggerChildren>

				<div className="mt-16 grid gap-3 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
					<H3 className="lg:col-span-5">{t("sections.meaning.why.title")}</H3>
					<p className="max-w-[60ch] text-muted-foreground text-sm leading-6 lg:col-span-6 lg:col-start-7">
						{t("sections.meaning.why.body")}
					</p>
				</div>
				<div className="mt-6">
					<MeaningExplorer
						listLabel={t("sections.meaning.listLabel")}
						readings={READING_KEYS.map((key) => ({
							key,
							title: t(`sections.meaning.readings.${key}.title`),
							text: t(`sections.meaning.readings.${key}.text`),
							figure: t(`sections.meaning.readings.${key}.figure`),
						}))}
					/>
				</div>
			</GuideSection>

			<GuideSection
				id="logo"
				paragraphs={[t("sections.logo.body"), t("sections.logo.rules")]}
				title={t("sections.logo.title")}
			>
				<LogoStage
					labels={{
						ground: t("sections.logo.controls.ground"),
						version: t("sections.logo.controls.version"),
						space: t("sections.logo.controls.space"),
						grounds: {
							paper: t("sections.logo.grounds.paper"),
							dark: t("sections.logo.grounds.dark"),
							orange: t("sections.logo.grounds.orange"),
						},
						versions: {
							main: t("sections.logo.versions.main"),
							stacked: t("sections.logo.versions.stacked"),
							mark: t("sections.logo.versions.mark"),
						},
					}}
				/>

				<div className="mt-16 scroll-mt-12 md:mt-24" id="files">
					<div className="grid gap-3 lg:grid-cols-12 lg:gap-x-6">
						<H3 className="lg:col-span-5">{t("sections.logo.files.title")}</H3>
						<p className="max-w-[60ch] text-muted-foreground text-sm leading-6 lg:col-span-6 lg:col-start-7">
							{t("sections.logo.files.body")}
						</p>
					</div>
					<LogoFiles className="mt-6" />
				</div>
			</GuideSection>

			<GuideSection
				id="construction"
				paragraphs={[t("sections.construction.body")]}
				title={t("sections.construction.title")}
			>
				<ConstructionViewer
					label={t("sections.construction.platesLabel")}
					plates={PLATE_KEYS.map((key) => ({
						key,
						name: t(`sections.construction.plates.${key}.name`),
						title: t(`sections.construction.plates.${key}.title`),
						text: t(`sections.construction.plates.${key}.text`),
						figure: t(`sections.construction.plates.${key}.figure`),
						points:
							key === "sheet"
								? SHEET_POINTS.map((point) => ({
										value: t(
											`sections.construction.plates.sheet.points.${point}.value`
										),
										text: t(
											`sections.construction.plates.sheet.points.${point}.text`
										),
									}))
								: undefined,
					}))}
				/>
				<div className="mt-16 grid gap-x-6 gap-y-10 md:mt-24 md:grid-cols-2">
					<Figure
						caption={t("sections.construction.space.note")}
						title={t("sections.construction.space.title")}
					>
						<Tile className="min-h-72" ground="paper">
							<ClearSpace />
						</Tile>
					</Figure>
					<Figure
						caption={`${t("sections.construction.size.main")} ${t("sections.construction.size.mark")}`}
						title={t("sections.construction.size.title")}
					>
						<Tile className="min-h-72" ground="paper">
							<SmallestSizes />
						</Tile>
					</Figure>
				</div>
			</GuideSection>

			<GuideSection
				id="colour"
				paragraphs={[t("sections.colour.body")]}
				title={t("sections.colour.title")}
			>
				<H3>{t("sections.colour.proportion.title")}</H3>
				<div
					aria-label={t("sections.colour.proportion.label")}
					className="relative mt-5 flex h-24 overflow-hidden rounded-[1.25rem] md:h-32"
					role="img"
				>
					{SHARES.map(({ hex, key, share, text }) => (
						<div
							className="flex min-w-0 items-end px-2 pb-2 lg:px-3 lg:pb-3"
							key={key}
							style={{
								backgroundColor: hex,
								color: text,
								flex: `${share} 1 0%`,
							}}
						>
							<span
								aria-hidden="true"
								className="hidden text-[0.8125rem] lg:block"
							>
								{t(`sections.colour.swatches.${key}.name`)}
							</span>
						</div>
					))}
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 rounded-[1.25rem] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]"
					/>
				</div>
				<ul className="mt-5 grid gap-x-6 gap-y-3 text-sm leading-6 sm:grid-cols-2 lg:grid-cols-4">
					{SHARES.map(({ hex, key }) => (
						<li className="flex items-baseline gap-2.5" key={key}>
							<span
								aria-hidden="true"
								className="size-2.5 shrink-0 translate-y-px rounded-full border border-foreground/15"
								style={{ backgroundColor: hex }}
							/>
							<span className="text-muted-foreground">
								{t(`sections.colour.proportion.${key}`)}
							</span>
						</li>
					))}
				</ul>

				<StaggerChildren className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{SWATCHES.map(({ color, hex, key, oklch, rgb, tone }) => (
						<div
							className={
								key === "paper"
									? "flex min-h-52 flex-col rounded-[1.25rem] p-5 shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)] sm:min-h-72"
									: "flex min-h-52 flex-col rounded-[1.25rem] p-5 sm:min-h-72"
							}
							key={key}
							style={{ backgroundColor: hex, color }}
						>
							<H3 className="text-inherit">
								{t(`sections.colour.swatches.${key}.name`)}
							</H3>
							<p className="mt-1 text-sm leading-6 opacity-75">
								{t(`sections.colour.swatches.${key}.use`)}
							</p>
							<div className="mt-auto space-y-0.5 pt-8">
								{[hex, rgb, oklch].map((value) => (
									<CopyValue
										copiedLabel={t("sections.colour.copied")}
										copyLabel={t("sections.colour.copy")}
										key={value}
										tone={tone}
										value={value}
									/>
								))}
							</div>
						</div>
					))}
				</StaggerChildren>

				<div className="mt-16 grid gap-3 lg:grid-cols-12 lg:gap-x-6">
					<H3 className="lg:col-span-5">
						{t("sections.colour.contrast.title")}
					</H3>
					<p className="max-w-[60ch] text-muted-foreground text-sm leading-6 lg:col-span-6 lg:col-start-7">
						{t("sections.colour.contrast.body")}
					</p>
				</div>
				<ul className="mt-6 border-grid-line border-t">
					{PAIRS.map(({ bg, fg, key }) => {
						const value = contrast(fg, bg);
						const level = contrastLevel(value);
						return (
							<li
								className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 border-grid-line border-b py-4 sm:gap-6"
								key={key}
							>
								<span
									aria-hidden="true"
									className="flex size-14 items-center justify-center rounded-[0.875rem] font-display font-medium text-lg shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]"
									style={{ backgroundColor: bg, color: fg }}
								>
									Aa
								</span>
								<span className="min-w-0 text-sm leading-6">
									<span className="block text-foreground">
										{t(`sections.colour.contrast.pairs.${key}.name`)}
									</span>
									<span className="block text-muted-foreground">
										{t(`sections.colour.contrast.pairs.${key}.use`)}
									</span>
								</span>
								<span className="flex items-center gap-3">
									<span className="font-display text-foreground text-lg tabular-nums">
										{ratio.format(value)}:1
									</span>
									<MarketingTag
										className={
											level === "low"
												? "border-destructive/30 text-destructive"
												: undefined
										}
									>
										{t(`sections.colour.contrast.levels.${level}`)}
									</MarketingTag>
								</span>
							</li>
						);
					})}
				</ul>
			</GuideSection>

			<GuideSection
				id="type"
				paragraphs={[t("sections.type.body")]}
				title={t("sections.type.title")}
			>
				<TypeTester
					label={t("sections.type.tester.label")}
					sample={t("sections.type.tester.sample")}
					steps={TYPE_STEPS.map((key) => ({
						key,
						name: t(`sections.type.steps.${key}.name`),
						spec: t(`sections.type.steps.${key}.spec`),
					}))}
				/>

				<div className="mt-16 grid gap-4 md:grid-cols-2">
					{WEIGHTS.map(({ className, key }) => (
						<div className="surface-card p-6 md:p-8" key={key}>
							<p
								aria-hidden="true"
								className={`font-display text-[4.5rem] text-foreground leading-none tracking-[-0.035em] ${className}`}
							>
								Aa
							</p>
							<p className="mt-6 text-foreground text-sm">
								{t(`sections.type.weights.${key}`)}
							</p>
							<p className="text-muted-foreground text-sm">
								{t(`sections.type.weights.${key}Use`)}
							</p>
							<p
								className={`mt-6 break-words text-base text-foreground/80 leading-7 tracking-normal ${className}`}
							>
								{CHARSET}
							</p>
						</div>
					))}
				</div>

				<H3 className="mt-16">{t("sections.type.word.title")}</H3>
				<div className="mt-5 grid gap-x-6 gap-y-10 md:grid-cols-2">
					<Figure caption={t("sections.type.word.drawn")}>
						<Tile className="min-h-56" ground="paper">
							<Logo className="h-auto w-56" />
						</Tile>
					</Figure>
					<Figure caption={t("sections.type.word.typed")}>
						<Tile className="min-h-56" ground="paper">
							<span
								className="font-display font-medium text-5xl tracking-[-0.03em]"
								style={{ color: INK }}
							>
								webvise
							</span>
						</Tile>
					</Figure>
				</div>
			</GuideSection>

			<GuideSection
				id="voice"
				paragraphs={[t("sections.voice.body")]}
				title={t("sections.voice.title")}
			>
				<ul className="border-grid-line border-t">
					{VOICE_RULES.map((key) => (
						<li
							className="grid gap-5 border-grid-line border-b py-8 lg:grid-cols-12 lg:gap-x-6"
							key={key}
						>
							<div className="lg:col-span-4">
								<H3>{t(`sections.voice.rules.${key}.title`)}</H3>
								<p className="mt-2 text-muted-foreground text-sm leading-6">
									{t(`sections.voice.rules.${key}.text`)}
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
								<div className="rounded-[0.875rem] bg-muted p-5">
									<p className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
										<X aria-hidden="true" className="size-3.5" />
										{t("sections.voice.instead")}
									</p>
									<p className="mt-2 text-muted-foreground leading-7 line-through decoration-foreground/25">
										{t(`sections.voice.rules.${key}.instead`)}
									</p>
								</div>
								<div className="rounded-[0.875rem] bg-card p-5">
									<p className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
										<Check
											aria-hidden="true"
											className="size-3.5 text-success"
										/>
										{t("sections.voice.write")}
									</p>
									<p className="mt-2 text-foreground leading-7">
										{t(`sections.voice.rules.${key}.write`)}
									</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</GuideSection>

			<GuideSection
				id="use"
				paragraphs={[t("sections.use.body")]}
				title={t("sections.use.title")}
			>
				<div className="grid gap-x-4 gap-y-8 lg:grid-cols-[1.7778fr_1.2148fr]">
					<Figure caption={t("sections.use.stationery")}>
						<div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem]">
							<Image
								alt={t("sections.use.stationeryAlt")}
								className="object-cover"
								fill
								sizes="(min-width: 1320px) 740px, (min-width: 1024px) 58vw, 100vw"
								src="/brand-assets/brand-stationery.jpg"
							/>
						</div>
					</Figure>
					<Figure caption={t("sections.use.dock")}>
						<div className="relative aspect-[2624/2160] overflow-hidden rounded-[1.25rem]">
							<Image
								alt={t("sections.use.dockAlt")}
								className="object-cover"
								fill
								sizes="(min-width: 1320px) 510px, (min-width: 1024px) 40vw, 100vw"
								src="/brand-assets/brand-dock.jpg"
							/>
						</div>
					</Figure>
				</div>
				<Figure caption={t("sections.use.profiles")} className="mt-8">
					<Tile className="min-h-64 gap-6 sm:gap-10" ground="panel">
						{PROFILES.map((key) => (
							<Image
								alt={t("sections.use.profileAlt", {
									ground: t(`sections.logo.files.${key}`),
								})}
								className="size-20 rounded-full sm:size-28"
								height={112}
								key={key}
								src={`/brand-assets/webvise-profile-${key}.png`}
								width={112}
							/>
						))}
					</Tile>
				</Figure>
			</GuideSection>

			<GuideSection
				id="misuse"
				paragraphs={[t("sections.misuse.body"), t("sections.misuse.more")]}
				title={t("sections.misuse.title")}
			>
				<StaggerChildren className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
					{MISUSES.map(({ ground, kind }) => (
						<Figure
							key={kind}
							title={
								<WrongLabel>
									<span className="sr-only">
										{t("sections.misuse.wrong")}:{" "}
									</span>
									{t(`sections.misuse.cases.${kind}`)}
								</WrongLabel>
							}
						>
							<Tile className="min-h-32 p-4 sm:min-h-44 sm:p-6" ground={ground}>
								<MisuseMark kind={kind} />
							</Tile>
						</Figure>
					))}
				</StaggerChildren>
			</GuideSection>

			<SectionWrapper id="questions">
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-x-6">
					<H2 className="lg:col-span-5">{t("sections.closing.title")}</H2>
					<div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
						<Body className="max-w-[60ch] text-foreground/75">
							{t("sections.closing.body")}
						</Body>
						<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
							<ActionLink
								arrow
								href="/media"
								location="brand_closing"
								variant="ink"
							>
								{t("sections.closing.media")}
							</ActionLink>
							<a
								className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:decoration-foreground"
								href="mailto:mail@webvise.io"
							>
								mail@webvise.io
							</a>
						</div>
					</div>
				</div>
			</SectionWrapper>
		</div>
	);
}
