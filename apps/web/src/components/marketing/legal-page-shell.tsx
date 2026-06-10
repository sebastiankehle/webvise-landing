import { Shield } from "lucide-react";
import type { ReactNode } from "react";

import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Body, H1, H2, Lead, Muted } from "@/components/ui/typography";
import type { LegalPage } from "@/data/legal";

function renderDefaultBody(body: string) {
	return body;
}

export function LegalPageShell({
	page,
	renderBody = renderDefaultBody,
	trustText,
}: {
	page: LegalPage;
	renderBody?: (body: string) => ReactNode;
	trustText: string;
}) {
	return (
		<article className="relative py-32 md:py-44">
			<ConstructedGrid hatch variant="page" />
			<GridContainer>
				<div className="max-w-2xl">
					<H1>{page.title}</H1>
					<Lead className="mt-4">{page.subtitle}</Lead>
				</div>

				<div className="mt-16 max-w-2xl space-y-12 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
					{page.sections.map((section) => (
						<section key={section.heading}>
							<H2 className="mb-4 text-lg md:text-lg">{section.heading}</H2>
							{section.body && (
								<Body className="text-muted-foreground leading-relaxed">
									{renderBody(section.body)}
								</Body>
							)}
							{section.items && (
								<ul className="text-muted-foreground text-sm leading-relaxed">
									{section.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							)}
						</section>
					))}
				</div>

				<div className="mt-16 flex max-w-2xl items-center gap-3 border border-border/40 bg-card/35 p-5">
					<Shield
						className="h-4 w-4 shrink-0 text-brand-icon"
						strokeWidth={1.5}
					/>
					<Muted>{trustText}</Muted>
				</div>
			</GridContainer>
		</article>
	);
}
