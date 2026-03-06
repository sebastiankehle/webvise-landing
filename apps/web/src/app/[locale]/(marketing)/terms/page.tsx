import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service — webvise",
	description: "Terms and conditions for using webvise services.",
};

export default function TermsPage() {
	return (
		<article className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
			<div className="max-w-2xl">
				<h1 className="font-normal text-4xl tracking-tight md:text-5xl">
					Terms of Service
				</h1>
				<p className="mt-4 font-light text-muted-foreground">
					Last updated: March 2026
				</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 font-light text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-lg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
				<section>
					<h2>1. Scope</h2>
					<p>
						These terms apply to all services provided by webvise (Sebastian
						Kehle), including design, development, automation, and consulting
						services. By engaging our services, you agree to these terms.
					</p>
				</section>

				<section>
					<h2>2. Services</h2>
					<p>
						The scope, deliverables, timeline, and cost of each engagement are
						defined in a written proposal. Work begins only after mutual
						agreement on the proposal. Changes to scope are documented and may
						affect timeline and cost.
					</p>
				</section>

				<section>
					<h2>3. Payment</h2>
					<ul>
						<li>Project engagements: 50% upfront, 50% on delivery.</li>
						<li>
							Retainer engagements: Invoiced monthly at the beginning of each
							period.
						</li>
						<li>Payment is due within 14 days of invoice date.</li>
						<li>All prices are net and subject to applicable VAT.</li>
					</ul>
				</section>

				<section>
					<h2>4. Intellectual Property</h2>
					<p>
						Upon full payment, all intellectual property rights to deliverables
						transfer to you. We retain the right to use the work in our
						portfolio unless otherwise agreed. Third-party licenses (fonts,
						libraries, services) remain subject to their respective terms.
					</p>
				</section>

				<section>
					<h2>5. Warranties</h2>
					<p>
						We deliver work to professional standards and provide 30 days of
						post-launch bug fixes at no extra cost. We do not guarantee specific
						business outcomes (revenue, rankings, conversions) as these depend
						on factors beyond our control.
					</p>
				</section>

				<section>
					<h2>6. Liability</h2>
					<p>
						Our liability is limited to the total fees paid for the engagement
						in question. We are not liable for indirect, consequential, or lost
						profit damages. This does not affect liability for intent or gross
						negligence under German law.
					</p>
				</section>

				<section>
					<h2>7. Confidentiality</h2>
					<p>
						Both parties agree to keep confidential information private. This
						includes business strategies, technical details, and any non-public
						information shared during the engagement.
					</p>
				</section>

				<section>
					<h2>8. Termination</h2>
					<p>
						Either party may terminate with 14 days written notice. Work
						completed up to termination is invoiced proportionally. Retainers
						may be cancelled at the end of any billing period.
					</p>
				</section>

				<section>
					<h2>9. Governing Law</h2>
					<p>
						These terms are governed by German law. The place of jurisdiction is
						Potsdam, Germany.
					</p>
				</section>
			</div>
		</article>
	);
}
