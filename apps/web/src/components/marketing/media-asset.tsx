"use client";

import { ArrowDownToLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { type CSSProperties, type ReactNode, useCallback, useRef } from "react";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, Mark } from "@/components/logo";
import { actionVariants } from "@/components/marketing/action";
import { Body, Caption } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type Variant = "light" | "inverted" | "brand";

const mediaAssetCanvasPalette = {
	brand: {
		bg: "#ff8918",
		logo: "#ffffff",
		rest: "rgba(250,250,250,0.7)",
		sub: "rgba(250,250,250,0.8)",
		text: "#fafafa",
	},
	inverted: {
		bg: "#050a0f",
		logo: "#ffffff",
		rest: "rgba(236,239,241,0.45)",
		sub: "#999fa4",
		text: "#eceff1",
	},
	light: {
		bg: "#f8fafb",
		logo: "#0e1217",
		rest: "rgba(14,18,23,0.45)",
		sub: "#5a6169",
		text: "#0e1217",
	},
} as const;
// next/font registers Hanken Grotesk under a hashed family name; resolve it
// from the CSS variable so canvas exports use the same font as the site.
function mediaAssetCanvasFontFamily() {
	const family = getComputedStyle(document.body)
		.getPropertyValue("--font-hanken-grotesk")
		.trim();
	return family ? `${family}, sans-serif` : '"Hanken Grotesk", sans-serif';
}
const mediaAssetCanvasGridLine = "rgba(0,0,0,0.03)";
/** The preview draws the canvas's own grid line, so the preview is the PNG. */
const mediaAssetPreviewGridImage = `linear-gradient(${mediaAssetCanvasGridLine} 1px, transparent 1px), linear-gradient(90deg, ${mediaAssetCanvasGridLine} 1px, transparent 1px)`;

/** Each variant's colours. Canvas and preview both read them, so the preview
 * keeps the PNG's colours in every site theme. */
const variantStyles: Record<
	Variant,
	{
		canvasBg: string;
		canvasText: string;
		canvasRest: string;
		canvasSub: string;
		canvasLogo: string;
	}
> = {
	light: {
		canvasBg: mediaAssetCanvasPalette.light.bg,
		canvasText: mediaAssetCanvasPalette.light.text,
		canvasRest: mediaAssetCanvasPalette.light.rest,
		canvasSub: mediaAssetCanvasPalette.light.sub,
		canvasLogo: mediaAssetCanvasPalette.light.logo,
	},
	inverted: {
		canvasBg: mediaAssetCanvasPalette.inverted.bg,
		canvasText: mediaAssetCanvasPalette.inverted.text,
		canvasRest: mediaAssetCanvasPalette.inverted.rest,
		canvasSub: mediaAssetCanvasPalette.inverted.sub,
		canvasLogo: mediaAssetCanvasPalette.inverted.logo,
	},
	brand: {
		canvasBg: mediaAssetCanvasPalette.brand.bg,
		canvasText: mediaAssetCanvasPalette.brand.text,
		canvasRest: mediaAssetCanvasPalette.brand.rest,
		canvasSub: mediaAssetCanvasPalette.brand.sub,
		canvasLogo: mediaAssetCanvasPalette.brand.logo,
	},
};

/** The preview's frame: the PNG's ratio and ground, the canvas grid at the
 * canvas step (40 of 1584), the site's card corner. */
function PreviewFrame({
	children,
	height,
	maxWidth,
	variant,
	width,
}: {
	children: ReactNode;
	height: number;
	maxWidth?: number;
	variant: Variant;
	width: number;
}) {
	const style = variantStyles[variant];
	const step = `${(40 * 100) / 1584}cqw`;
	return (
		<div
			className={cn(
				"@container relative overflow-hidden rounded-[1.25rem]",
				variant === "light" && "shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]"
			)}
			style={
				{
					aspectRatio: `${width} / ${height}`,
					backgroundColor: style.canvasBg,
					maxWidth,
					"--logo": style.canvasLogo,
				} as CSSProperties
			}
		>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage: mediaAssetPreviewGridImage,
					backgroundSize: `${step} ${step}`,
				}}
			/>
			{children}
		</div>
	);
}

/** The size and the download, under every preview. */
function AssetFooter({
	height,
	onDownload,
	width,
}: {
	height: number;
	onDownload: () => void;
	width: number;
}) {
	const t = useTranslations("media");
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
			<Caption className="tabular-nums">
				{width} × {height} px
			</Caption>
			<button
				className={actionVariants({ variant: "quiet", size: "md" })}
				onClick={onDownload}
				type="button"
			>
				<ArrowDownToLine aria-hidden="true" className="size-4" />
				{t("download")}
			</button>
		</div>
	);
}

/** The mark `width` wide, its top-left corner at x, y. */
function drawMarkOnCanvas(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	color: string
) {
	const scale = width / MARK_WIDTH;
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.fillStyle = color;
	for (const d of MARK_PARTS) {
		ctx.fill(new Path2D(d));
	}
	ctx.restore();
}

function drawGridPattern(ctx: CanvasRenderingContext2D, w: number, h: number) {
	ctx.strokeStyle = mediaAssetCanvasGridLine;
	ctx.lineWidth = 1;
	const step = 40 * (w / 1584);
	for (let x = 0; x <= w; x += step) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
		ctx.stroke();
	}
	for (let y = 0; y <= h; y += step) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.stroke();
	}
}

/** The home page's headline: its lead and its rest. */
export type Tagline = readonly [lead: string, rest: string];

/** The headline in two lines, the second one quieter, set as the home page
 * sets it. `y` is the middle of the first line. */
function drawTagline(
	ctx: CanvasRenderingContext2D,
	[lead, rest]: Tagline,
	{
		colors,
		fontFamily,
		size,
		x,
		y,
	}: {
		colors: { canvasRest: string; canvasText: string };
		fontFamily: string;
		size: number;
		x: number;
		y: number;
	}
) {
	ctx.font = `500 ${size}px ${fontFamily}`;
	ctx.letterSpacing = `${-0.03 * size}px`;
	ctx.fillStyle = colors.canvasText;
	ctx.fillText(lead, x, y);
	ctx.fillStyle = colors.canvasRest;
	ctx.fillText(rest, x, y + Math.round(size * 1.14));
	ctx.letterSpacing = "0px";
}

// --- Banner asset (LinkedIn, wallpaper, etc.) ---

interface BannerProps {
	filename: string;
	height: number;
	subtitle: string;
	tagline: Tagline;
	variant?: Variant;
	width: number;
}

export function BannerAsset({
	variant = "light",
	width,
	height,
	tagline,
	subtitle,
	filename,
}: BannerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const style = variantStyles[variant];

	const scaleFactor = width / 1584;

	const initCanvas = useCallback(
		(canvas: HTMLCanvasElement | null) => {
			if (!canvas) {
				return;
			}
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return;
			}
			ctx.scale(dpr, dpr);

			const draw = () => {
				const fontFamily = mediaAssetCanvasFontFamily();

				ctx.fillStyle = style.canvasBg;
				ctx.fillRect(0, 0, width, height);

				drawGridPattern(ctx, width, height);

				const logoSize = Math.round(80 * scaleFactor);
				const logoX = width - Math.round(130 * scaleFactor) - logoSize;
				const logoY = (height - (logoSize * MARK_HEIGHT) / MARK_WIDTH) / 2;
				drawMarkOnCanvas(ctx, logoX, logoY, logoSize, style.canvasLogo);

				const textRightEdge = logoX - Math.round(30 * scaleFactor);
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";

				const subFontSize = Math.round(22 * scaleFactor);

				drawTagline(ctx, tagline, {
					colors: style,
					fontFamily,
					size: Math.round(42 * scaleFactor),
					x: textRightEdge,
					y: height / 2 - Math.round(42 * scaleFactor),
				});

				ctx.fillStyle = style.canvasSub;
				ctx.font = `400 ${subFontSize}px ${fontFamily}`;
				ctx.fillText(
					subtitle,
					textRightEdge,
					height / 2 + Math.round(52 * scaleFactor)
				);

				ctx.fillStyle = mediaAssetCanvasPalette.brand.bg;
				ctx.fillRect(
					0,
					height - Math.round(4 * scaleFactor),
					width,
					Math.round(4 * scaleFactor)
				);
			};

			draw();
			// Redraw once webfonts are in so the exported PNG uses Hanken Grotesk.
			document.fonts.ready.then(draw);
		},
		[style, width, height, tagline, subtitle, scaleFactor]
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const link = document.createElement("a");
		link.download = filename;
		link.href = canvas.toDataURL("image/png");
		link.click();
	}, [filename]);

	// Canvas sizes are in units of a 1584 wide banner; in the preview they are
	// container-width units, so it scales exactly as the PNG does
	const cq = (canvasPx: number) => `${(canvasPx * 100) / 1584}cqw`;

	return (
		<div className="space-y-3">
			<PreviewFrame height={height} variant={variant} width={width}>
				<div
					className="absolute inset-0 flex items-center justify-end"
					style={{ paddingRight: cq(130) }}
				>
					<div className="flex items-center" style={{ gap: cq(30) }}>
						<div className="text-right">
							<Body
								className="whitespace-nowrap font-medium leading-[1.14] tracking-[-0.03em]"
								style={{ color: style.canvasText, fontSize: cq(42) }}
							>
								{tagline[0]}
								<br />
								<span style={{ color: style.canvasRest }}>{tagline[1]}</span>
							</Body>
							<Body
								className="whitespace-nowrap font-normal leading-none"
								style={{
									color: style.canvasSub,
									fontSize: cq(22),
									marginTop: cq(11.2),
								}}
							>
								{subtitle}
							</Body>
						</div>
						<div className="shrink-0" style={{ width: cq(80) }}>
							<Mark className="w-full" />
						</div>
					</div>
				</div>
				<div
					className="absolute right-0 bottom-0 left-0 bg-brand"
					style={{ height: cq(4) }}
				/>
			</PreviewFrame>
			<canvas className="hidden" ref={initCanvas} />
			<AssetFooter height={height} onDownload={handleDownload} width={width} />
		</div>
	);
}

// --- Wallpaper asset (centered logo + tagline) ---

interface WallpaperProps {
	filename: string;
	height: number;
	tagline: Tagline;
	variant?: Variant;
	width: number;
}

export function WallpaperAsset({
	variant = "light",
	width,
	height,
	tagline,
	filename,
}: WallpaperProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const style = variantStyles[variant];

	const initCanvas = useCallback(
		(canvas: HTMLCanvasElement | null) => {
			if (!canvas) {
				return;
			}
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return;
			}
			ctx.scale(dpr, dpr);

			const draw = () => {
				const fontFamily = mediaAssetCanvasFontFamily();

				ctx.fillStyle = style.canvasBg;
				ctx.fillRect(0, 0, width, height);

				drawGridPattern(ctx, width, height);

				const scale = Math.min(width, height) / 1000;
				const logoSize = Math.round(160 * scale);
				// The mark, a gap of 22.6 and the two headline lines (1.14 × 48
				// each) stand as one block in the middle, as the preview sets them
				const markHeight = (logoSize * MARK_HEIGHT) / MARK_WIDTH;
				const gap = 22.6 * scale;
				const line = 48 * 1.14 * scale;
				const top = height / 2 - (markHeight + gap + 2 * line) / 2;
				drawMarkOnCanvas(
					ctx,
					(width - logoSize) / 2,
					top,
					logoSize,
					style.canvasLogo
				);

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				drawTagline(ctx, tagline, {
					colors: style,
					fontFamily,
					size: Math.round(48 * scale),
					x: width / 2,
					y: top + markHeight + gap + line / 2,
				});

				ctx.fillStyle = mediaAssetCanvasPalette.brand.bg;
				ctx.fillRect(0, height - 4, width, 4);
			};

			draw();
			// Redraw once webfonts are in so the exported PNG uses Hanken Grotesk.
			document.fonts.ready.then(draw);
		},
		[style, width, height, tagline]
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const link = document.createElement("a");
		link.download = filename;
		link.href = canvas.toDataURL("image/png");
		link.click();
	}, [filename]);

	// The preview is the PNG scaled down: each size is the canvas size in
	// container-width units, so a line fits here exactly when it fits the PNG
	const previewSize = (canvasPx: number) =>
		`${(canvasPx * Math.min(width, height) * 100) / 1000 / width}cqw`;

	return (
		<div className="space-y-3">
			<PreviewFrame
				height={height}
				maxWidth={width > height ? undefined : 300}
				variant={variant}
				width={width}
			>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div style={{ width: previewSize(160) }}>
						<Mark className="w-full" />
					</div>
					{/* The gaps follow the canvas: 22.6 between the mark and the
					    first line's box, the whole block centred */}
					<div className="text-center" style={{ marginTop: previewSize(22.6) }}>
						<Body
							className="whitespace-nowrap font-medium leading-[1.14] tracking-[-0.03em]"
							style={{ color: style.canvasText, fontSize: previewSize(48) }}
						>
							{tagline[0]}
							<br />
							<span style={{ color: style.canvasRest }}>{tagline[1]}</span>
						</Body>
					</div>
				</div>
				<div className="absolute right-0 bottom-0 left-0 h-1 bg-brand" />
			</PreviewFrame>
			<canvas className="hidden" ref={initCanvas} />
			<AssetFooter height={height} onDownload={handleDownload} width={width} />
		</div>
	);
}
