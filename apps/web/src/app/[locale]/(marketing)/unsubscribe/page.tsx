import { AlertTriangle, MailX } from "lucide-react";
import type { Metadata } from "next";
import { Body, H1, Muted } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Unsubscribed",
	robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
	searchParams,
}: {
	searchParams: Promise<{ success?: string; error?: string }>;
}) {
	const params = await searchParams;
	const hasError = !!params.error;

	return (
		<article className="mx-auto flex max-w-[1320px] flex-col items-center px-6 py-32 text-center md:py-44">
			<div className="max-w-md">
				{hasError ? (
					<>
						<AlertTriangle
							className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
							strokeWidth={1.5}
						/>
						<H1 className="text-2xl md:text-2xl">Something went wrong</H1>
						<Body className="mt-4 text-muted-foreground">
							We couldn&apos;t process your unsubscribe request. Please try
							again or contact us at{" "}
							<a
								className="text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
								href="mailto:mail@webvise.io"
							>
								mail@webvise.io
							</a>
							.
						</Body>
					</>
				) : (
					<>
						<MailX
							className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
							strokeWidth={1.5}
						/>
						<H1 className="text-2xl md:text-2xl">
							You&apos;ve been unsubscribed
						</H1>
						<Body className="mt-4 text-muted-foreground">
							You won&apos;t receive any more emails from us. If this was a
							mistake, you can re-subscribe anytime from our website.
						</Body>
						<Muted className="mt-8">
							Have a project in mind?{" "}
							<a
								className="text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
								href="https://cal.com/webvise"
							>
								Book a free call
							</a>
						</Muted>
					</>
				)}
			</div>
		</article>
	);
}
