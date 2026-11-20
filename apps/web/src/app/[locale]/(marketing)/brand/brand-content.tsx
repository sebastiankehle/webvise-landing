import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import Logo, { StackedLogo } from "@/components/logo";
import { Body, H2, H3 } from "@/components/ui/typography";
import {
	ClearSpace,
	ConstructionDrawing,
	Figure,
	type Ground,
	type MisuseKind,
	MisuseMark,
	Tile,
	WrongLabel,
} from "./brand-figures";
import { CopyValue } from "./copy-value";

const SECTIONS = [
	"logo",
	"construction",
	"colour",
	"type",
	"icon",
	"misuse",
] as const;
type SectionId = (typeof SECTIONS)[number];

const SWATCHES = [
	{
		key: "ink",
		hex: "#0e1217",
		oklch: "oklch(0.18 0.012 250)",
		color: "#eceff1",
		tone: "dark",
	},
	{
		key: "dark",
		hex: "#050a0f",
		oklch: "oklch(0.14 0.014 250)",
		color: "#eceff1",
		tone: "dark",
	},
	{
		key: "paper",
		hex: "#f8fafb",
		oklch: "oklch(0.984 0.0025 245)",
		color: "#0e1217",
		tone: "light",
	},
	{
		key: "orange",
		hex: "#ff8918",
		oklch: "oklch(0.75 0.18 55)",
		color: "#0e1217",
		tone: "light",
	},
] as const;

const GROUNDS_WITH_LOGO = [
	"paper",
	"dark",
	"orange",
] as const satisfies readonly Ground[];

const TYPE_STEPS = [
	{
		key: "display",
		className: "text-[72px] leading-[1.02] tracking-[-0.035em]",
		weight: "font-medium",
	},
	{
		key: "title",
		className: "text-5xl leading-[1.06] tracking-[-0.03em]",
		weight: "font-medium",
	},
	{
		key: "section",
		className: "text-[40px] leading-[1.08] tracking-[-0.028em]",
		weight: "font-medium",
	},
	{
		key: "heading",
		className: "text-lg leading-snug tracking-[-0.015em]",
		weight: "font-medium",
	},
	{ key: "body", className: "text-base", weight: "font-normal" },
	{
		key: "small",
		className: "text-muted-foreground text-sm",
		weight: "font-normal",
	},
] as const;

const MISUSES = [
	{ kind: "colour", ground: "paper" },
	{ kind: "tints", ground: "panel" },
	{ kind: "wedge", ground: "panel" },
	{ kind: "stretch", ground: "paper" },
] as const satisfies readonly { kind: MisuseKind; ground: Ground }[];

function Section({
	children,
	id,
	paragraphs,
	title,
}: {
	children: ReactNode;
	id: SectionId;
	paragraphs: readonly string[];
	title: string;
}) {
	return (
		<section
			aria-labelledby={`${id}-title`}
			className="scroll-mt-24 border-grid-line border-t pt-12 md:pt-16"
			id={id}
		>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-6">
				<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
					<H2 id={`${id}-title`}>{title}</H2>
					<div className="mt-5 space-y-4">
						{paragraphs.map((text) => (
							<Body className="text-foreground/75" key={text}>
								{text}
							</Body>
						))}
					</div>
				</div>
				<div className="min-w-0 space-y-12 lg:col-span-8">{children}</div>
			</div>
		</section>
	);
}

export default function BrandContent() {
	const t = useTranslations("brand");

	return (
		<div className="mt-12 space-y-16 md:space-y-24">
			<nav aria-label={t("navLabel")}>
				<ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
					{SECTIONS.map((id) => (
						<li key={id}>
							<a
								className="text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
								href={`#${id}`}
							>
								{t(`sections.${id}.title`)}
							</a>
						</li>
					))}
				</ul>
			</nav>

			<Section
				id="logo"
				paragraphs={[t("sections.logo.body"), t("sections.logo.rules")]}
				title={t("sections.logo.title")}
			>
				<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
					<Figure
						caption={t("sections.logo.versions.main.note")}
						title={t("sections.logo.versions.main.title")}
					>
						<Tile ground="paper">
							<Logo className="h-auto w-44" />
						</Tile>
					</Figure>
					<Figure
						caption={t("sections.logo.versions.stacked.note")}
						title={t("sections.logo.versions.stacked.title")}
					>
						<Tile ground="panel">
							<StackedLogo className="h-auto w-32" />
						</Tile>
					</Figure>
					<Figure
						caption={t("sections.logo.versions.app.note")}
						title={t("sections.logo.versions.app.title")}
					>
						<Tile ground="panel">
							<Image
								alt=""
								className="size-24 rounded-[23%]"
								height={96}
								src="/app-icon.svg"
								unoptimized
								width={96}
							/>
						</Tile>
					</Figure>
					<Figure
						caption={t("sections.logo.versions.tab.note")}
						title={t("sections.logo.versions.tab.title")}
					>
						<Tile ground="paper">
							<Image
								alt=""
								className="size-16"
								height={64}
								src="/icon.svg"
								unoptimized
								width={64}
							/>
						</Tile>
					</Figure>
				</div>
			</Section>

			<Section
				id="construction"
				paragraphs={[t("sections.construction.body")]}
				title={t("sections.construction.title")}
			>
				<Tile className="p-4 md:p-8" ground="panel">
					<ConstructionDrawing label={t("sections.construction.drawing")} />
				</Tile>
				<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
					<Figure
						caption={t("sections.construction.space.note")}
						title={t("sections.construction.space.title")}
					>
						<Tile ground="paper">
							<ClearSpace />
						</Tile>
					</Figure>
					<div>
						<H3>{t("sections.construction.size.title")}</H3>
						<div className="mt-3 space-y-2 text-muted-foreground text-sm leading-6">
							<p>{t("sections.construction.size.main")}</p>
							<p>{t("sections.construction.size.mark")}</p>
						</div>
					</div>
				</div>
			</Section>

			<Section
				id="colour"
				paragraphs={[t("sections.colour.body")]}
				title={t("sections.colour.title")}
			>
				<div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
					{GROUNDS_WITH_LOGO.map((ground) => (
						<Figure
							caption={t(`sections.colour.grounds.${ground}`)}
							key={ground}
						>
							<Tile className="min-h-36" ground={ground}>
								<Logo className="h-auto w-32" />
							</Tile>
						</Figure>
					))}
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{SWATCHES.map(({ color, hex, key, oklch, tone }) => (
						<div
							className={
								key === "paper"
									? "flex min-h-52 flex-col rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]"
									: "flex min-h-52 flex-col rounded-2xl p-5"
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
								<CopyValue
									copiedLabel={t("sections.colour.copied")}
									copyLabel={t("sections.colour.copy")}
									tone={tone}
									value={hex}
								/>
								<CopyValue
									copiedLabel={t("sections.colour.copied")}
									copyLabel={t("sections.colour.copy")}
									tone={tone}
									value={oklch}
								/>
							</div>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="type"
				paragraphs={[t("sections.type.body")]}
				title={t("sections.type.title")}
			>
				<div>
					{TYPE_STEPS.map(({ className, key, weight }) => (
						<div
							className="flex flex-col gap-1 border-grid-line border-b py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
							key={key}
						>
							<p
								className={`font-display text-foreground ${weight} ${className}`}
							>
								{t(`sections.type.steps.${key}.name`)}
							</p>
							<p className="shrink-0 text-muted-foreground text-sm">
								{t(`sections.type.steps.${key}.spec`)}
							</p>
						</div>
					))}
					<div className="flex flex-col gap-1 border-grid-line border-b py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
						<p className="font-display font-normal text-[40px] text-foreground leading-[1.1]">
							Aa Bb Cc Dd Ee 0123456789
						</p>
						<p className="shrink-0 text-muted-foreground text-sm">
							{t("sections.type.weights.regular")}
						</p>
					</div>
					<div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
						<p className="font-display font-medium text-[40px] text-foreground leading-[1.1]">
							Aa Bb Cc Dd Ee 0123456789
						</p>
						<p className="shrink-0 text-muted-foreground text-sm">
							{t("sections.type.weights.medium")}
						</p>
					</div>
				</div>
			</Section>

			<Section
				id="icon"
				paragraphs={[t("sections.icon.body")]}
				title={t("sections.icon.title")}
			>
				<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
					<Figure caption={t("sections.icon.app")}>
						<Tile className="min-h-64" ground="panel">
							<Image
								alt=""
								className="size-36 rounded-[23%]"
								height={144}
								src="/app-icon.svg"
								unoptimized
								width={144}
							/>
						</Tile>
					</Figure>
					<Figure caption={t("sections.icon.actual")}>
						<Tile className="min-h-64" ground="paper">
							<div className="flex items-center gap-6">
								<Image
									alt=""
									height={16}
									src="/icon.svg"
									unoptimized
									width={16}
								/>
								<Image
									alt=""
									height={32}
									src="/icon.svg"
									unoptimized
									width={32}
								/>
							</div>
						</Tile>
					</Figure>
				</div>
			</Section>

			<Section
				id="misuse"
				paragraphs={[t("sections.misuse.body"), t("sections.misuse.more")]}
				title={t("sections.misuse.title")}
			>
				<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
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
							<Tile ground={ground}>
								<MisuseMark kind={kind} />
							</Tile>
						</Figure>
					))}
				</div>
			</Section>
		</div>
	);
}
