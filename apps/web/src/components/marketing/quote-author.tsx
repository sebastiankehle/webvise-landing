import Image from "next/image";

import { testimonialAvatars, testimonialInitials } from "@/data/testimonials";

/** Portrait, name and role under a client quote. */
export function QuoteAuthor({
	author,
	detail,
}: {
	author: string;
	detail: string;
}) {
	const avatar = testimonialAvatars[author];

	return (
		<figcaption className="flex items-center gap-3">
			{avatar ? (
				<Image
					alt=""
					className="size-10 shrink-0 rounded-full object-cover"
					height={40}
					src={avatar}
					width={40}
				/>
			) : (
				<span
					aria-hidden="true"
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground text-sm"
				>
					{testimonialInitials(author)}
				</span>
			)}
			<span className="min-w-0">
				<span className="block font-medium text-base text-foreground leading-6">
					{author}
				</span>
				<span className="block text-muted-foreground text-sm leading-5">
					{detail}
				</span>
			</span>
		</figcaption>
	);
}
