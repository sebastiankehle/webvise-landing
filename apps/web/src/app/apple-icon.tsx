import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "transparent",
			}}
		>
			<svg
				viewBox="0 0 32 32"
				fill="none"
				width="160"
				height="160"
				xmlns="http://www.w3.org/2000/svg"
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
		</div>,
		{ ...size },
	);
}
