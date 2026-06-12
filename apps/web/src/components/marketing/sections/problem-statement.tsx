import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { DisplayH2 } from "@/components/ui/typography";

function ScrollFillHeading({ text }: { text: string }) {
	const chars = Array.from(text).map((char, index) => ({
		char,
		index,
		key: `${text.slice(0, index)}${char}`,
	}));

	return (
		<DisplayH2 className="max-w-none md:text-[2.1875rem] md:leading-[1.18]">
			{chars.map(({ char, index, key }) => (
				<span
					className="scroll-fill-char"
					key={key}
					style={
						{
							"--i": index,
							"--n": chars.length,
						} as CSSProperties
					}
				>
					{char}
				</span>
			))}
		</DisplayH2>
	);
}

export default async function ProblemStatement() {
	const t = await getTranslations("problemStatement");

	return (
		<SectionWrapper className="md:py-28" id="problem" surface="alternate">
			<ScrollFillHeading text={`${t("known")} ${t("pain")}`} />
		</SectionWrapper>
	);
}
