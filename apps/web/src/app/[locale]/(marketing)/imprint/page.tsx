import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Imprint - webvise",
	description:
		"Legal information and contact details for webvise, as required by German law.",
};

export default function ImprintPage() {
	return (
		<article className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
			<div className="max-w-2xl">
				<h1 className="font-normal text-4xl tracking-tight md:text-5xl">
					Imprint
				</h1>
				<p className="mt-4 font-light text-muted-foreground">
					Information according to &sect; 5 TMG
				</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 font-light text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-lg">
				<section>
					<h2>Responsible</h2>
					<p>
						Sebastian Kehle
						<br />
						Eva-Laube-Weg 5
						<br />
						14473 Potsdam, Germany
					</p>
				</section>

				<section>
					<h2>Contact</h2>
					<p>
						Email:{" "}
						<a
							href="mailto:mail@webvise.io"
							className="text-foreground underline underline-offset-4"
						>
							mail@webvise.io
						</a>
					</p>
				</section>

				<section>
					<h2>VAT Identification Number</h2>
					<p>VAT ID according to &sect; 27a UStG: pending registration.</p>
				</section>

				<section>
					<h2>Dispute Resolution</h2>
					<p>
						The European Commission provides a platform for online dispute
						resolution (OS). We are not obliged and not willing to participate
						in dispute resolution proceedings before a consumer arbitration
						board.
					</p>
				</section>

				<section>
					<h2>Liability for Content</h2>
					<p>
						As a service provider, we are responsible for our own content on
						these pages under &sect; 7(1) TMG. According to &sect;&sect; 8-10
						TMG, we are not obligated to monitor transmitted or stored
						third-party information.
					</p>
				</section>

				<section>
					<h2>Liability for Links</h2>
					<p>
						Our website contains links to external websites. We have no
						influence on their content and cannot accept any liability. The
						respective provider is always responsible for the content of linked
						pages.
					</p>
				</section>
			</div>
		</article>
	);
}
