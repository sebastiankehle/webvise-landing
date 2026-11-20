import { ImageResponse } from "next/og";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH } from "@/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The app icon: the white mark across 65 % of a dark square, as in the logo
// presentation's export. Square corners; the system rounds them.
const markWidth = size.width * 0.65;

export default function AppleIcon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#050a0f",
			}}
		>
			<svg
				aria-label="webvise"
				height={(markWidth * MARK_HEIGHT) / MARK_WIDTH}
				role="img"
				viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`}
				width={markWidth}
				xmlns="http://www.w3.org/2000/svg"
			>
				{MARK_PARTS.map((d) => (
					<path d={d} fill="#ffffff" key={d} />
				))}
			</svg>
		</div>,
		{ ...size }
	);
}
