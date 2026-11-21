import { ArrowDownToLine } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";

import Logo, { Mark, StackedLogo } from "@/components/logo";
import StaggerChildren from "@/components/marketing/stagger-children";
import { cn } from "@/lib/utils";

const INK = "#0e1217";

/** The logo files in `public/brand-assets`, copied from the logo
 * presentation's `export/` folder. */
type FileVariant = "ink" | "white" | "dark" | "paper" | "orange";
const FILE_GROUPS = [
	{
		key: "main",
		files: [
			["SVG", "ink", "webvise-logo-ink.svg"],
			["SVG", "white", "webvise-logo-white.svg"],
			["PNG", "ink", "webvise-logo-ink.png"],
			["PNG", "white", "webvise-logo-white.png"],
		],
	},
	{
		key: "stacked",
		files: [
			["SVG", "ink", "webvise-stacked-ink.svg"],
			["SVG", "white", "webvise-stacked-white.svg"],
			["PNG", "ink", "webvise-stacked-ink.png"],
			["PNG", "white", "webvise-stacked-white.png"],
		],
	},
	{
		key: "mark",
		files: [
			["SVG", "ink", "webvise-mark-ink.svg"],
			["SVG", "white", "webvise-mark-white.svg"],
			["PNG", "ink", "webvise-mark-ink.png"],
			["PNG", "white", "webvise-mark-white.png"],
		],
	},
	{
		key: "app",
		files: [
			["SVG", null, "webvise-app-icon-512.svg"],
			["PNG", null, "webvise-app-icon-512.png"],
		],
	},
	{
		key: "profile",
		files: [
			["PNG", "dark", "webvise-profile-dark.png"],
			["PNG", "paper", "webvise-profile-paper.png"],
			["PNG", "orange", "webvise-profile-orange.png"],
		],
	},
] as const satisfies readonly {
	key: string;
	files: readonly (readonly [string, FileVariant | null, string])[];
}[];
type FileGroupKey = (typeof FILE_GROUPS)[number]["key"];

export const PROFILES = ["dark", "paper", "orange"] as const;

function FilePreview({ group }: { group: FileGroupKey }) {
	if (group === "main") {
		return <Logo className="h-auto w-32" />;
	}
	if (group === "stacked") {
		return <StackedLogo className="h-auto w-20" />;
	}
	if (group === "mark") {
		return <Mark className="h-auto w-14" />;
	}
	if (group === "app") {
		return (
			<Image
				alt=""
				className="size-14 rounded-[23%]"
				height={56}
				src="/brand-assets/webvise-app-icon-512.png"
				width={56}
			/>
		);
	}
	return (
		<div className="flex -space-x-3">
			{PROFILES.map((key) => (
				<Image
					alt=""
					className="size-12 rounded-full ring-2 ring-[#eef0f2]"
					height={48}
					key={key}
					src={`/brand-assets/webvise-profile-${key}.png`}
					width={48}
				/>
			))}
		</div>
	);
}

/** The logo files as cards: a preview on the panel and a download link for
 * each format. Shared by the brand guidelines and the media kit. */
export function LogoFiles({ className }: { className?: string }) {
	const t = useTranslations("brand");
	return (
		<StaggerChildren
			as="ul"
			className={cn(
				"grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5",
				className
			)}
		>
			{FILE_GROUPS.map((group) => {
				const item = t(`sections.logo.files.items.${group.key}`);
				return (
					<li
						className={
							group.key === "profile"
								? "surface-card col-span-2 flex flex-col p-3 sm:col-span-1"
								: "surface-card flex flex-col p-3"
						}
						key={group.key}
					>
						<div
							className="flex h-24 items-center justify-center rounded-[0.875rem] bg-[#eef0f2] text-[#0e1217] sm:h-32"
							style={{ "--logo": INK } as CSSProperties}
						>
							<FilePreview group={group.key} />
						</div>
						<p className="mt-4 px-2 text-foreground text-sm">{item}</p>
						<ul className="mt-2 flex flex-col gap-0.5 px-2 pb-2 text-sm">
							{group.files.map(([format, variant, file]) => {
								const variantName = variant
									? t(`sections.logo.files.${variant}`)
									: null;
								return (
									<li key={file}>
										<a
											aria-label={t("sections.logo.files.download", {
												item,
												format,
												variant: variantName ?? "",
											})}
											className="inline-flex items-center gap-1.5 rounded-sm py-1 text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
											download
											href={`/brand-assets/${file}`}
										>
											<ArrowDownToLine
												aria-hidden="true"
												className="size-3.5 shrink-0"
											/>
											{variantName ? `${format} · ${variantName}` : format}
										</a>
									</li>
								);
							})}
						</ul>
					</li>
				);
			})}
		</StaggerChildren>
	);
}
