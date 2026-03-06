import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy — webvise",
	description: "How webvise collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
	return (
		<article className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
			<div className="max-w-2xl">
				<h1 className="font-normal text-4xl tracking-tight md:text-5xl">
					Privacy Policy
				</h1>
				<p className="mt-4 font-light text-muted-foreground">
					Last updated: March 2026
				</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 font-light text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-lg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
				<section>
					<h2>1. Controller</h2>
					<p>
						Sebastian Kehle, Eva-Laube-Weg 5, 14473 Potsdam, Germany. Email:
						mail@webvise.io.
					</p>
				</section>

				<section>
					<h2>2. Data We Collect</h2>
					<p>We collect the following data when you use our website:</p>
					<ul>
						<li>
							Contact form submissions (name, email, company, message) — to
							respond to your inquiry.
						</li>
						<li>
							Usage analytics (page views, referrer, device type) — to improve
							our website. We use PostHog, which can be configured to anonymize
							IP addresses.
						</li>
						<li>
							Error tracking data (browser, OS, stack traces) — to fix bugs. We
							use Sentry, which does not track personal data.
						</li>
					</ul>
				</section>

				<section>
					<h2>3. Legal Basis</h2>
					<p>
						We process your data based on Art. 6(1)(b) GDPR (contract
						performance) for contact form submissions, and Art. 6(1)(f) GDPR
						(legitimate interest) for analytics and error tracking. You can
						object to analytics processing at any time.
					</p>
				</section>

				<section>
					<h2>4. Data Sharing</h2>
					<p>
						We do not sell your data. We share data only with processors who act
						on our behalf: Vercel (hosting), Resend (email delivery), PostHog
						(analytics), and Sentry (error tracking). All processors are
						GDPR-compliant.
					</p>
				</section>

				<section>
					<h2>5. Data Retention</h2>
					<p>
						Contact form data is retained for 12 months after your last
						interaction, then deleted. Analytics data is retained for 24 months.
						You can request deletion at any time.
					</p>
				</section>

				<section>
					<h2>6. Your Rights</h2>
					<p>
						Under GDPR, you have the right to access, rectification, erasure,
						restriction, data portability, and objection. To exercise these
						rights, email us at mail@webvise.io.
					</p>
				</section>

				<section>
					<h2>7. Cookies</h2>
					<p>
						We use only technically necessary cookies. We do not use advertising
						or third-party tracking cookies. Analytics is cookie-free where
						possible.
					</p>
				</section>

				<section>
					<h2>8. Changes</h2>
					<p>
						We may update this policy. Changes will be posted on this page with
						an updated date.
					</p>
				</section>
			</div>
		</article>
	);
}
