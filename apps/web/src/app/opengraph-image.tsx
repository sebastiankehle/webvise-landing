import { ImageResponse } from "next/og";

export const alt = "webvise - Design. Development. Automation.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#fafafa",
				gap: 40,
			}}
		>
			<svg
				viewBox="0 0 32 32"
				fill="none"
				width="160"
				height="160"
				xmlns="http://www.w3.org/2000/svg"
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 8,
				}}
			>
				<span
					style={{
						fontSize: 64,
						fontWeight: 600,
						color: "#0a0a0a",
						letterSpacing: "-0.02em",
					}}
				>
					webvise
				</span>
				<span
					style={{
						fontSize: 28,
						color: "#737373",
						fontWeight: 400,
					}}
				>
					Design. Development. Automation.
				</span>
			</div>
		</div>,
		{ ...size },
	);
}
