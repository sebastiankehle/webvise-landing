"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { Body, Caption } from "@/components/ui/typography";

type Variant = "light" | "dark" | "brand";

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
		canvasBg: "#ffffff",
		canvasText: "#0a0a0a",
		canvasSub: "#737373",
	},
	dark: {
		bg: "section-dark",
		text: "text-[#ededed]",
		sub: "text-[#919195]",
		canvasBg: "#0c0c0f",
		canvasText: "#ededed",
		canvasSub: "#919195",
	},
	brand: {
		bg: "bg-brand",
		text: "text-white",
		sub: "text-white/80",
		canvasBg: "#e88730",
		canvasText: "#ffffff",
		canvasSub: "rgba(255,255,255,0.8)",
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
	size: number,
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
	ctx.strokeStyle = "rgba(0,0,0,0.03)";
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
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			role="img"
			aria-label="webvise logo"
		>
			<polygon points="16,2 8,10 16,12" fill="#f97316" opacity="0.9" />
			<polygon points="16,2 24,10 16,12" fill="#fb923c" opacity="0.85" />
			<polygon points="8,10 4,18 16,12" fill="#fdba74" opacity="0.8" />
			<polygon points="24,10 28,18 16,12" fill="#f97316" opacity="0.75" />
			<polygon points="16,12 4,18 10,26" fill="#fb923c" opacity="0.9" />
			<polygon points="16,12 28,18 22,26" fill="#fdba74" opacity="0.85" />
			<polygon points="16,12 10,26 16,30" fill="#f97316" opacity="0.8" />
			<polygon points="16,12 22,26 16,30" fill="#fb923c" opacity="0.75" />
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
			if (!canvas) return;
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = size * dpr;
			canvas.height = size * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.scale(dpr, dpr);

			ctx.fillStyle = style.canvasBg;
			ctx.fillRect(0, 0, size, size);

			const logoSize = size * 0.6;
			drawLogoOnCanvas(
				ctx,
				(size - logoSize) / 2,
				(size - logoSize) / 2,
				logoSize,
			);
		},
		[style, size],
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
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
			<canvas ref={initCanvas} className="hidden" />
			<div className="flex items-center justify-between">
				<Caption>
					{size} x {size}px
				</Caption>
				<button
					type="button"
					onClick={handleDownload}
					className="border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted"
				>
					{t("download")}
				</button>
			</div>
		</div>
	);
}

// --- Banner asset (LinkedIn, wallpaper, etc.) ---

type BannerProps = {
	variant?: Variant;
	width: number;
	height: number;
	tagline: string;
	subtitle: string;
	filename: string;
};

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
			if (!canvas) return;
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.scale(dpr, dpr);

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
			ctx.font = `400 ${mainFontSize}px "Inter", sans-serif`;
			ctx.fillText(
				tagline,
				textRightEdge,
				height / 2 - Math.round(14 * scaleFactor),
			);

			ctx.fillStyle = style.canvasSub;
			ctx.font = `300 ${subFontSize}px "Inter", sans-serif`;
			ctx.fillText(
				subtitle,
				textRightEdge,
				height / 2 + Math.round(24 * scaleFactor),
			);

			ctx.fillStyle = "#e88730";
			ctx.fillRect(
				0,
				height - Math.round(4 * scaleFactor),
				width,
				Math.round(4 * scaleFactor),
			);
		},
		[style, width, height, tagline, subtitle, scaleFactor],
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
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
						backgroundImage:
							"linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute inset-0 flex items-center justify-end pr-[8%]">
					<div className="flex items-center gap-6">
						<div className="text-right">
							<Body
								className={`font-normal text-[clamp(12px,2.2vw,32px)] leading-tight tracking-tight ${style.text}`}
							>
								{tagline}
							</Body>
							<Body
								className={`mt-1 font-light text-[clamp(8px,1.2vw,16px)] ${style.sub}`}
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
			<canvas ref={initCanvas} className="hidden" />
			<div className="flex items-center justify-between">
				<Caption>
					{width} x {height}px
				</Caption>
				<button
					type="button"
					onClick={handleDownload}
					className="border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted"
				>
					{t("download")}
				</button>
			</div>
		</div>
	);
}

// --- Wallpaper asset (centered logo + tagline) ---

type WallpaperProps = {
	variant?: Variant;
	width: number;
	height: number;
	tagline: string;
	subtitle: string;
	filename: string;
};

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
			if (!canvas) return;
			canvasRef.current = canvas;
			const dpr = 2;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.scale(dpr, dpr);

			ctx.fillStyle = style.canvasBg;
			ctx.fillRect(0, 0, width, height);

			drawGridPattern(ctx, width, height);

			const scale = Math.min(width, height) / 1000;
			const logoSize = Math.round(160 * scale);
			drawLogoOnCanvas(
				ctx,
				(width - logoSize) / 2,
				height / 2 - logoSize - Math.round(20 * scale),
				logoSize,
			);

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			const mainFontSize = Math.round(48 * scale);
			const subFontSize = Math.round(24 * scale);

			ctx.fillStyle = style.canvasText;
			ctx.font = `400 ${mainFontSize}px "Inter", sans-serif`;
			ctx.fillText(tagline, width / 2, height / 2 + Math.round(30 * scale));

			ctx.fillStyle = style.canvasSub;
			ctx.font = `300 ${subFontSize}px "Inter", sans-serif`;
			ctx.fillText(subtitle, width / 2, height / 2 + Math.round(70 * scale));

			ctx.fillStyle = "#e88730";
			ctx.fillRect(0, height - 4, width, 4);
		},
		[style, width, height, tagline, subtitle],
	);

	const handleDownload = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
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
						backgroundImage:
							"linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
						backgroundSize: "40px 40px",
					}}
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<WebviseLogo size={64} />
					<div className="text-center">
						<Body
							className={`font-normal text-[clamp(12px,2vw,28px)] leading-tight tracking-tight ${style.text}`}
						>
							{tagline}
						</Body>
						<Body
							className={`mt-1 font-light text-[clamp(8px,1vw,14px)] ${style.sub}`}
						>
							{subtitle}
						</Body>
					</div>
				</div>
				<div className="absolute right-0 bottom-0 left-0 h-1 bg-brand" />
			</div>
			<canvas ref={initCanvas} className="hidden" />
			<div className="flex items-center justify-between">
				<Caption>
					{width} x {height}px
				</Caption>
				<button
					type="button"
					onClick={handleDownload}
					className="border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted"
				>
					{t("download")}
				</button>
			</div>
		</div>
	);
}
