import Image from "next/image";

import { cn } from "@/lib/utils";

// Anthropic's Credly page for the badge. Swap it for Sebastian's own Credly
// link once Credly issues the badge, so the link verifies the holder.
const CREDLY_URL =
	"https://www.credly.com/org/anthropic/badge/claude-partner-badge-claude-code";

// Anthropic grants this badge to a person, not to a partner firm, so it always
// shows the holder's name. Artwork as issued on Credly.
export function ClaudeCodeBadge({ className }: { className?: string }) {
	return (
		<a
			aria-label="Claude Partner Badge – Claude Code, Sebastian Kehle"
			className={cn(
				"inline-flex shrink-0 items-center gap-2.5 text-foreground/75 text-xs leading-tight outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70",
				className
			)}
			href={CREDLY_URL}
			rel="noopener noreferrer"
			target="_blank"
		>
			<Image
				alt="Claude Partner Badge – Claude Code"
				className="size-[52px]"
				height={600}
				src="/images/claude-partner-badge-claude-code.png"
				width={600}
			/>
			<span>
				Sebastian
				<br />
				Kehle
			</span>
		</a>
	);
}
