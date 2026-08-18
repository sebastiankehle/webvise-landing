"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { marketingSurfaceClassName } from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Body, Caption } from "@/components/ui/typography";

type Variant = "light" | "inverted" | "brand";

const mediaAssetCanvasPalette = {
	brand: {
		bg: "#e88730",
		sub: "rgba(250,248,244,0.8)",
		text: "#faf8f4",
	},
	inverted: {
		bg: "#15171c",
		sub: "#a09c95",
		text: "#f0eee8",
	},
	light: {
		bg: "#fbfaf7",
		sub: "#706a61",
		text: "#211f1b",
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
		sub: string;
		canvasBg: string;
		canvasText: string;
		canvasSub: string;
	}
> = {
	light: {
		bg: "bg-background",
		text: "text-foreground",
		sub: "text-muted-foreground",
		canvasBg: mediaAssetCanvasPalette.light.bg,
		canvasText: mediaAssetCanvasPalette.light.text,
		canvasSub: mediaAssetCanvasPalette.light.sub,
	},
	inverted: {
		bg: marketingSurfaceClassName("inverted"),
		text: "text-foreground",
		sub: "text-muted-foreground",
		canvasBg: mediaAssetCanvasPalette.inverted.bg,
		canvasText: mediaAssetCanvasPalette.inverted.text,
		canvasSub: mediaAssetCanvasPalette.inverted.sub,
	},
	brand: {
		bg: "bg-brand",
		text: "text-brand-foreground",
		sub: "text-brand-foreground/80",
		canvasBg: mediaAssetCanvasPalette.brand.bg,
		canvasText: mediaAssetCanvasPalette.brand.text,
		canvasSub: mediaAssetCanvasPalette.brand.sub,
	},
};

const logoPolygons = [
	{
		points: [
			[16, 2],
			[8, 10],
			[16, 12],
		],
		fill: "#f97316",
		opacity: 0.9,
	},
	{
		points: [
			[16, 2],
			[24, 10],
			[16, 12],
		],
		fill: "#fb923c",
		opacity: 0.85,
	},
	{
		points: [
			[8, 10],
			[4, 18],
			[16, 12],
		],
		fill: "#fdba74",
		opacity: 0.8,
	},
	{
		points: [
			[24, 10],
			[28, 18],
			[16, 12],
		],
		fill: "#f97316",
		opacity: 0.75,
	},
	{
		points: [
			[16, 12],
			[4, 18],
			[10, 26],
		],
		fill: "#fb923c",
		opacity: 0.9,
	},
	{
		points: [
			[16, 12],
			[28, 18],
			[22, 26],
		],
		fill: "#fdba74",
		opacity: 0.85,
	},
	{
		points: [
			[16, 12],
			[10, 26],
			[16, 30],
		],
		fill: "#f97316",
		opacity: 0.8,
	},
	{
		points: [
			[16, 12],
			[22, 26],
			[16, 30],
		],
		fill: "#fb923c",
		opacity: 0.75,
	},
] as const;

function drawLogoOnCanvas(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number
) {
	const scale = size / 32;
	for (const { points, fill, opacity } of logoPolygons) {
		ctx.globalAlpha = opacity;
		ctx.fillStyle = fill;
		ctx.beginPath();
		ctx.moveTo(x + points[0][0] * scale, y + points[0][1] * scale);
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(x + points[i][0] * scale, y + points[i][1] * scale);
		}
		ctx.closePath();
		ctx.fill();
	}
	ctx.globalAlpha = 1;
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

function WebviseLogo({ size = 64 }: { size?: number }) {
	return (
		<svg
			aria-label="webvise logo"
			fill="none"
			height={size}
			role="img"
			viewBox="0 0 32 32"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			{logoPolygons.map(({ fill, opacity, points }) => (
				<polygon
					fill={fill}
					key={points.map(([x, y]) => `${x},${y}`).join(" ")}
					opacity={opacity}
					points={points.map(([x, y]) => `${x},${y}`).join(" ")}
				/>
			))}
		</svg>
	);
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

			const logoSize = size * 0.6;
			drawLogoOnCanvas(
				ctx,
				(size - logoSize) / 2,
				(size - logoSize) / 2,
				logoSize
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
				<WebviseLogo size={120} />
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
	tagline: string;
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
				const logoY = (height - logoSize) / 2;
				drawLogoOnCanvas(ctx, logoX, logoY, logoSize);

				const textRightEdge = logoX - Math.round(30 * scaleFactor);
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";

				const mainFontSize = Math.round(42 * scaleFactor);
				const subFontSize = Math.round(22 * scaleFactor);

				ctx.fillStyle = style.canvasText;
				ctx.font = `400 ${mainFontSize}px ${fontFamily}`;
				ctx.fillText(
					tagline,
					textRightEdge,
					height / 2 - Math.round(14 * scaleFactor)
				);

				ctx.fillStyle = style.canvasSub;
				ctx.font = `400 ${subFontSize}px ${fontFamily}`;
				ctx.fillText(
					subtitle,
					textRightEdge,
					height / 2 + Math.round(24 * scaleFactor)
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
								className={`font-normal text-[clamp(12px,2.2vw,32px)] leading-tight ${style.text}`}
							>
								{tagline}
							</Body>
							<Body
								className={`mt-1 font-normal text-[clamp(8px,1.2vw,16px)] ${style.sub}`}
							>
								{subtitle}
							</Body>
						</div>
						<div className="shrink-0">
							<WebviseLogo size={48} />
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
	tagline: string;
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
				drawLogoOnCanvas(
					ctx,
					(width - logoSize) / 2,
					height / 2 - logoSize - Math.round(20 * scale),
					logoSize
				);

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				const mainFontSize = Math.round(48 * scale);
				const subFontSize = Math.round(24 * scale);

				ctx.fillStyle = style.canvasText;
				ctx.font = `400 ${mainFontSize}px ${fontFamily}`;
				ctx.fillText(tagline, width / 2, height / 2 + Math.round(30 * scale));

				ctx.fillStyle = style.canvasSub;
				ctx.font = `400 ${subFontSize}px ${fontFamily}`;
				ctx.fillText(subtitle, width / 2, height / 2 + Math.round(70 * scale));

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
				className={`relative overflow-hidden ${style.bg}`}
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
					<WebviseLogo size={64} />
					<div className="text-center">
						<Body
							className={`font-normal text-[clamp(12px,2vw,28px)] leading-tight ${style.text}`}
						>
							{tagline}
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
