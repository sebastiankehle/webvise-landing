"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, Mark } from "@/components/logo";
import { marketingSurfaceClassName } from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Body, Caption } from "@/components/ui/typography";

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
const mediaAssetPreviewGridImage =
	"linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)";

const variantStyles: Record<
	Variant,
	{
		bg: string;
		text: string;
		rest: string;
		sub: string;
		canvasBg: string;
		canvasText: string;
		canvasRest: string;
		canvasSub: string;
		canvasLogo: string;
		/** The preview's logo colour; empty keeps the theme's ink or white */
		logo: string;
	}
> = {
	light: {
		bg: "bg-background",
		text: "text-foreground",
		rest: "text-foreground/45",
		sub: "text-muted-foreground",
		canvasBg: mediaAssetCanvasPalette.light.bg,
		canvasText: mediaAssetCanvasPalette.light.text,
		canvasRest: mediaAssetCanvasPalette.light.rest,
		canvasSub: mediaAssetCanvasPalette.light.sub,
		canvasLogo: mediaAssetCanvasPalette.light.logo,
		logo: "",
	},
	inverted: {
		bg: marketingSurfaceClassName("inverted"),
		text: "text-foreground",
		rest: "text-foreground/45",
		sub: "text-muted-foreground",
		canvasBg: mediaAssetCanvasPalette.inverted.bg,
		canvasText: mediaAssetCanvasPalette.inverted.text,
		canvasRest: mediaAssetCanvasPalette.inverted.rest,
		canvasSub: mediaAssetCanvasPalette.inverted.sub,
		canvasLogo: mediaAssetCanvasPalette.inverted.logo,
		logo: "",
	},
	brand: {
		bg: "bg-brand",
		text: "text-brand-foreground",
		rest: "text-brand-foreground/70",
		sub: "text-brand-foreground/80",
		canvasBg: mediaAssetCanvasPalette.brand.bg,
		canvasText: mediaAssetCanvasPalette.brand.text,
		canvasRest: mediaAssetCanvasPalette.brand.rest,
		canvasSub: mediaAssetCanvasPalette.brand.sub,
		canvasLogo: mediaAssetCanvasPalette.brand.logo,
		logo: "text-white",
	},
};

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

// --- Logo-only asset (square) ---

export function LogoAsset({
	variant = "light",
	size = 512,
}: {
	variant?: Variant;
	size?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const t = useTranslations("media");
	const style = variantStyles[variant];

	const initCanvas = useCallback(
		(canvas: HTMLCanvasElement | null) => {
			if (!canvas) {
				return;
			}
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = size * dpr;
			canvas.height = size * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return;
			}
			ctx.scale(dpr, dpr);

			ctx.fillStyle = style.canvasBg;
			ctx.fillRect(0, 0, size, size);

			// The mark spans 600 of 1024, as in the presentation's profile
			// pictures, so a circle crop keeps all of it
			const markWidth = (size * 600) / 1024;
			const markHeight = (markWidth * MARK_HEIGHT) / MARK_WIDTH;
			drawMarkOnCanvas(
				ctx,
				(size - markWidth) / 2,
				(size - markHeight) / 2,
				markWidth,
				style.canvasLogo
			);
		},
		[style, size]
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const link = document.createElement("a");
		link.download = `webvise-logo-${variant}-${size}x${size}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	}, [variant, size]);

	return (
		<div className="space-y-3">
			<div
				className={`relative flex items-center justify-center overflow-hidden ${style.bg}`}
				style={{ aspectRatio: "1 / 1", maxWidth: 200 }}
			>
				<Mark className={`w-[58.6%] ${style.logo}`} />
			</div>
			<canvas className="hidden" ref={initCanvas} />
			<div className="flex items-center justify-between">
				<Caption>
					{size} x {size}px
				</Caption>
				<Button
					onClick={handleDownload}
					size="sm"
					type="button"
					variant="outline"
				>
					{t("download")}
				</Button>
			</div>
		</div>
	);
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
	const t = useTranslations("media");
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

	return (
		<div className="space-y-3">
			<div
				className={`relative overflow-hidden ${style.bg}`}
				style={{ aspectRatio: `${width} / ${height}` }}
			>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: mediaAssetPreviewGridImage,
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute inset-0 flex items-center justify-end pr-[8%]">
					<div className="flex items-center gap-6">
						<div className="text-right">
							<Body
								className={`font-medium text-[clamp(12px,2.2vw,32px)] leading-[1.14] tracking-[-0.03em] ${style.text}`}
							>
								{tagline[0]}
								<br />
								<span className={style.rest}>{tagline[1]}</span>
							</Body>
							<Body
								className={`mt-1 font-normal text-[clamp(8px,1.2vw,16px)] ${style.sub}`}
							>
								{subtitle}
							</Body>
						</div>
						<div className="shrink-0">
							<Mark className={`w-12 ${style.logo}`} />
						</div>
					</div>
				</div>
				<div className="absolute right-0 bottom-0 left-0 h-1 bg-brand" />
			</div>
			<canvas className="hidden" ref={initCanvas} />
			<div className="flex items-center justify-between">
				<Caption>
					{width} x {height}px
				</Caption>
				<Button
					onClick={handleDownload}
					size="sm"
					type="button"
					variant="outline"
				>
					{t("download")}
				</Button>
			</div>
		</div>
	);
}

// --- Wallpaper asset (centered logo + tagline) ---

interface WallpaperProps {
	filename: string;
	height: number;
	subtitle: string;
	tagline: Tagline;
	variant?: Variant;
	width: number;
}

export function WallpaperAsset({
	variant = "light",
	width,
	height,
	tagline,
	subtitle,
	filename,
}: WallpaperProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const t = useTranslations("media");
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
				drawMarkOnCanvas(
					ctx,
					(width - logoSize) / 2,
					height / 2 -
						(logoSize * MARK_HEIGHT) / MARK_WIDTH -
						Math.round(48 * scale),
					logoSize,
					style.canvasLogo
				);

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				const subFontSize = Math.round(24 * scale);

				drawTagline(ctx, tagline, {
					colors: style,
					fontFamily,
					size: Math.round(48 * scale),
					x: width / 2,
					y: height / 2 + Math.round(2 * scale),
				});

				ctx.fillStyle = style.canvasSub;
				ctx.font = `400 ${subFontSize}px ${fontFamily}`;
				ctx.fillText(subtitle, width / 2, height / 2 + Math.round(108 * scale));

				ctx.fillStyle = mediaAssetCanvasPalette.brand.bg;
				ctx.fillRect(0, height - 4, width, 4);
			};

			draw();
			// Redraw once webfonts are in so the exported PNG uses Hanken Grotesk.
			document.fonts.ready.then(draw);
		},
		[style, width, height, tagline, subtitle]
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

	return (
		<div className="space-y-3">
			<div
				className={`@container relative overflow-hidden ${style.bg}`}
				style={{
					aspectRatio: `${width} / ${height}`,
					maxWidth: width > height ? undefined : 300,
				}}
			>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: mediaAssetPreviewGridImage,
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<Mark className={`w-16 ${style.logo}`} />
					<div className="text-center">
						{/* Each line stays whole, as in the PNG; the size follows the
						    preview's width so the narrow phone preview fits it */}
						<Body
							className={`whitespace-nowrap font-medium text-[min(clamp(12px,2vw,28px),7.5cqw)] leading-[1.14] tracking-[-0.03em] ${style.text}`}
						>
							{tagline[0]}
							<br />
							<span className={style.rest}>{tagline[1]}</span>
						</Body>
						<Body
							className={`mt-1 font-normal text-[clamp(8px,1vw,14px)] ${style.sub}`}
						>
							{subtitle}
						</Body>
					</div>
				</div>
				<div className="absolute right-0 bottom-0 left-0 h-1 bg-brand" />
			</div>
			<canvas className="hidden" ref={initCanvas} />
			<div className="flex items-center justify-between">
				<Caption>
					{width} x {height}px
				</Caption>
				<Button
					onClick={handleDownload}
					size="sm"
					type="button"
					variant="outline"
				>
					{t("download")}
				</Button>
			</div>
		</div>
	);
}
