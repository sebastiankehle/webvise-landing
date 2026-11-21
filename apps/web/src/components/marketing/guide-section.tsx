import type { ReactNode } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Body, H2 } from "@/components/ui/typography";

/** A section of the brand guidelines and the media kit: the title on the
 * left, its text on the right, the content below at full width. */
export function GuideSection({
	children,
	id,
	paragraphs,
	title,
}: {
	children: ReactNode;
	id: string;
	paragraphs: readonly string[];
	title: string;
}) {
	return (
		<SectionWrapper className="scroll-mt-12" id={id}>
			<div className="grid gap-5 lg:grid-cols-12 lg:gap-x-6">
				<H2 className="lg:col-span-5">{title}</H2>
				<div className="max-w-[60ch] space-y-4 lg:col-span-6 lg:col-start-7 lg:pt-2">
					{paragraphs.map((text) => (
						<Body className="text-foreground/75" key={text}>
							{text}
						</Body>
					))}
				</div>
			</div>
			<div className="mt-12 md:mt-16">{children}</div>
		</SectionWrapper>
	);
}
