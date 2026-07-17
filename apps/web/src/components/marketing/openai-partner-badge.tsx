import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Official OpenAI Partner Network badge — must be used as provided,
// referenced in copy as "OpenAI Select Partner" (OPN brand guidance).
export function OpenAiPartnerBadge({ className }: { className?: string }) {
	return (
		<Link
			aria-label="OpenAI Select Partner"
			className={cn("inline-flex shrink-0", className)}
			href={{
				pathname: "/blog/[slug]",
				params: { slug: "openai-select-partner" },
			}}
		>
			<Image
				alt="OpenAI Select Partner"
				className="h-auto w-full"
				height={177}
				src="/images/openai-select-partner.svg"
				width={375}
			/>
		</Link>
	);
}
