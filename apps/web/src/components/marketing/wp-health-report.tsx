"use client";

import { useState } from "react";

import AnimateIn from "@/components/marketing/animate-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReportIssue {
	title: string;
	displayValue?: string;
}

interface ReportData {
	url: string;
	mobile: { score: number };
	desktop: { score: number };
	issues: ReportIssue[];
	projectedScore: number;
	securityFlags: string[];
	migrationEstimate: { min: number; max: number };
}

function ScoreRing({
	score,
	label,
	size = 100,
}: { score: number; label: string; size?: number }) {
	const radius = (size - 8) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (score / 100) * circumference;
	const color =
		score >= 90
			? "text-green-500"
			: score >= 50
				? "text-yellow-500"
				: "text-red-500";
	const strokeColor =
		score >= 90
			? "stroke-green-500"
			: score >= 50
				? "stroke-yellow-500"
				: "stroke-red-500";

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative" style={{ width: size, height: size }}>
				<svg
					width={size}
					height={size}
					className="-rotate-90"
					aria-hidden="true"
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={4}
						className="text-border"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						strokeWidth={4}
						strokeLinecap="butt"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						className={cn("transition-all duration-1000", strokeColor)}
					/>
				</svg>
				<span
					className={cn(
						"absolute inset-0 flex items-center justify-center font-medium text-xl",
						color,
					)}
				>
					{score}
				</span>
			</div>
			<span className="text-muted-foreground text-xs">{label}</span>
		</div>
	);
}

function ReportResults({ data }: { data: ReportData }) {
	return (
		<AnimateIn>
			<div className="mt-16 space-y-10">
				<div>
					<h2 className="font-normal text-2xl tracking-tight md:text-3xl">
						Your WordPress Health Report
					</h2>
					<p className="mt-2 text-muted-foreground text-sm">
						Results for{" "}
						<span className="font-medium text-foreground">{data.url}</span>
					</p>
				</div>

				{/* Scores */}
				<div className="grid gap-6 sm:grid-cols-3">
					<div className="flex flex-col items-center border border-border/40 p-6">
						<ScoreRing score={data.mobile.score} label="Mobile" />
					</div>
					<div className="flex flex-col items-center border border-border/40 p-6">
						<ScoreRing score={data.desktop.score} label="Desktop" />
					</div>
					<div className="flex flex-col items-center border border-border/40 border-l-2 border-l-brand p-6">
						<ScoreRing score={data.projectedScore} label="After Next.js" />
					</div>
				</div>

				{/* Top issues */}
				{data.issues.length > 0 && (
					<div className="border border-border/40 p-6">
						<h3 className="font-medium text-sm">Top Speed Killers</h3>
						<ul className="mt-4 space-y-3">
							{data.issues.map((issue) => (
								<li
									key={issue.title}
									className="flex items-start gap-3 text-sm"
								>
									<span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-red-500" />
									<div>
										<span className="text-foreground">{issue.title}</span>
										{issue.displayValue && (
											<span className="ml-2 text-muted-foreground text-xs">
												{issue.displayValue}
											</span>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Security flags */}
				{data.securityFlags.length > 0 && (
					<div className="border border-border/40 p-6">
						<h3 className="font-medium text-sm">Security Risks</h3>
						<ul className="mt-4 space-y-3">
							{data.securityFlags.map((flag) => (
								<li key={flag} className="flex items-start gap-3 text-sm">
									<span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-yellow-500" />
									<span className="text-foreground">{flag}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Migration estimate */}
				<div className="border border-border/40 border-l-2 border-l-brand p-6">
					<h3 className="font-medium text-sm">Migration Estimate</h3>
					<p className="mt-2 text-muted-foreground text-sm">
						Based on your site analysis, a Next.js rebuild would cost
						approximately{" "}
						<span className="font-medium text-foreground">
							&euro;{data.migrationEstimate.min.toLocaleString()}&ndash;&euro;
							{data.migrationEstimate.max.toLocaleString()}
						</span>{" "}
						one-time, with managed edits from{" "}
						<span className="font-medium text-foreground">
							&euro;299/month
						</span>
						.
					</p>
					<div className="mt-4 flex flex-col gap-3 sm:flex-row">
						<Button
							size="lg"
							className="border-transparent bg-brand text-white [&]:hover:bg-brand/80"
							render={
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								<a
									href="https://cal.com/webvise"
									target="_blank"
									rel="noopener noreferrer"
								/>
							}
						>
							Book a Free Call
						</Button>
						<Button
							size="lg"
							variant="outline"
							render={
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								<a href="/#contact" />
							}
						>
							Get in Touch
						</Button>
					</div>
				</div>
			</div>
		</AnimateIn>
	);
}

export default function WpHealthReport() {
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [report, setReport] = useState<ReportData | null>(null);
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");
		setErrorMessage("");

		const form = e.currentTarget;
		const data = new FormData(form);
		let url = (data.get("url") as string).trim();

		// Ensure URL has protocol
		if (url && !url.startsWith("http")) {
			url = `https://${url}`;
		}

		try {
			const res = await fetch("/api/wp-health-report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					url,
					email: data.get("email"),
					firstName: data.get("firstName"),
				}),
			});

			if (res.ok) {
				const result = await res.json();
				setReport(result);
				setStatus("success");
			} else {
				const err = await res.json().catch(() => null);
				setErrorMessage(
					err?.error ||
						"Failed to analyze website. Please check the URL and try again.",
				);
				setStatus("error");
			}
		} catch {
			setErrorMessage("Network error. Please try again.");
			setStatus("error");
		}
	}

	return (
		<>
			<section id="wp-health-report" className="py-20 md:py-40">
				<div className="mx-auto max-w-[1200px] px-6">
					<AnimateIn>
						<div className="grid items-start gap-16 md:grid-cols-2">
							<div>
								<h1 className="font-normal text-3xl leading-[1.15] tracking-tight md:text-[48px]">
									Is Your WordPress Site{" "}
									<span className="text-brand">Hurting Your Business?</span>
								</h1>
								<p className="mt-6 font-light text-lg text-muted-foreground leading-relaxed">
									Get a free WordPress Health Report in 60 seconds — see your
									real speed score, security risks, and what a Next.js rebuild
									would score.
								</p>

								<ul className="mt-8 space-y-3">
									{[
										"Real PageSpeed score for mobile and desktop",
										"Security risk flags and vulnerability exposure",
										"Performance comparison with projected Next.js score",
										"Personalised migration cost estimate",
									].map((item) => (
										<li
											key={item}
											className="flex items-start gap-3 text-sm"
										>
											<span className="mt-1 h-1.5 w-1.5 shrink-0 bg-brand" />
											<span>{item}</span>
										</li>
									))}
								</ul>

								<p className="mt-8 text-muted-foreground text-xs">
									Used by 25+ businesses. Built by webvise.io — the team that
									rebuilds WordPress sites in Next.js.
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								className="space-y-5 border border-border/40 p-8"
								aria-label="WordPress Health Report"
								noValidate
							>
								<div className="space-y-2">
									<Label htmlFor="url">Website URL</Label>
									<Input
										id="url"
										name="url"
										type="url"
										required
										placeholder="yoursite.com"
										disabled={status === "loading"}
									/>
								</div>
								<div className="grid gap-5 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="email"
											type="email"
											required
											placeholder="you@company.com"
											disabled={status === "loading"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="firstName">
											Name{" "}
											<span className="text-muted-foreground">(optional)</span>
										</Label>
										<Input
											id="firstName"
											name="firstName"
											placeholder="Your name"
											disabled={status === "loading"}
										/>
									</div>
								</div>
								<Button
									type="submit"
									disabled={status === "loading"}
									className="w-full border-transparent bg-brand text-white [&]:hover:bg-brand/80"
								>
									{status === "loading"
										? "Analyzing... this takes ~30 seconds"
										: "Get My Free Report"}
								</Button>
								<p className="text-center text-muted-foreground text-xs">
									No signup required. No credit card. Just results.
								</p>
								<div aria-live="polite" aria-atomic="true">
									{status === "error" && (
										<p role="alert" className="text-destructive text-sm">
											{errorMessage}
										</p>
									)}
								</div>
							</form>
						</div>
					</AnimateIn>

					{status === "loading" && (
						<div className="mt-16 flex flex-col items-center gap-4">
							<div className="h-6 w-6 animate-spin border-2 border-brand border-t-transparent" />
							<p className="text-muted-foreground text-sm">
								Running Lighthouse audit on your website...
							</p>
						</div>
					)}

					{status === "success" && report && (
						<ReportResults data={report} />
					)}
				</div>
			</section>

			{/* Trust footer */}
			<section className="border-t border-border/40 py-12">
				<div className="mx-auto max-w-[1200px] px-6 text-center">
					<p className="text-muted-foreground text-xs">
						We take your data seriously. Your email is used only to send your
						report and follow-ups. Unsubscribe any time.
					</p>
				</div>
			</section>
		</>
	);
}
