import Image from "next/image";

import { cn } from "@/lib/utils";

// OpenAI's own page on the partner network, the link OpenAI gave with the
// badge in its approved social copy.
const OPENAI_PARTNERS_URL = "https://openai.com/business/partners/";

// Official OpenAI Partner Network badge — must be used as provided,
// referenced in copy as "OpenAI Select Partner" (OPN brand guidance).
export function OpenAiPartnerBadge({ className }: { className?: string }) {
	return (
		<a
			aria-label="OpenAI Select Partner"
			className={cn("inline-flex shrink-0", className)}
			href={OPENAI_PARTNERS_URL}
			rel="noopener noreferrer"
			target="_blank"
		>
			<Image
				alt="OpenAI Select Partner"
				className="h-auto w-full"
				height={177}
				src="/images/openai-select-partner.svg"
				width={375}
			/>
		</a>
	);
}
