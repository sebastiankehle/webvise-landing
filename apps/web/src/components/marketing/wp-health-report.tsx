"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
	const t = useTranslations("wpHealthReport");

	return (
		<AnimateIn>
			<div>
				{/* Header */}
				<div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{t("results.title")}
					</h2>
					<p className="font-light text-muted-foreground text-sm">
						{t("results.resultsFor")}{" "}
						<span className="font-medium text-foreground">{data.url}</span>
					</p>
				</div>

				{/* Main grid: scores + details side by side */}
				<div className="mt-8 grid gap-px overflow-hidden border border-border/40 md:grid-cols-[auto_1fr]">
					{/* Scores column */}
					<div className="grid grid-cols-3 md:grid-cols-1 md:w-56">
						<div className="flex flex-col items-center justify-center p-6">
							<ScoreRing
								score={data.mobile.score}
								label={t("results.mobile")}
							/>
						</div>
						<div className="flex flex-col items-center justify-center border-border/40 border-l p-6 md:border-l-0 md:border-t">
							<ScoreRing
								score={data.desktop.score}
								label={t("results.desktop")}
							/>
						</div>
						<div className="flex flex-col items-center justify-center border-border/40 border-l border-l-brand p-6 md:border-l-0 md:border-t md:border-t-brand">
							<ScoreRing
								score={data.projectedScore}
								label={t("results.afterNextjs")}
							/>
						</div>
					</div>

					{/* Details column */}
					<div className="grid border-border/40 border-t md:grid-cols-2 md:border-t-0 md:border-l">
						{data.issues.length > 0 && (
							<div className="p-6">
								<h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
									{t("results.speedKillers")}
								</h3>
								<ul className="mt-3 space-y-2.5">
									{data.issues.map((issue) => (
										<li
											key={issue.title}
											className="flex items-start gap-3 font-light text-sm"
										>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
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

						{data.securityFlags.length > 0 && (
							<div className="border-border/40 border-t p-6 md:border-t-0 md:border-l">
								<h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
									{t("results.securityRisks")}
								</h3>
								<ul className="mt-3 space-y-2.5">
									{data.securityFlags.map((flag) => (
										<li
											key={flag}
											className="flex items-start gap-3 font-light text-sm"
										>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
											<span className="text-foreground">{flag}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* Migration estimate + CTA */}
				<div className="mt-px grid items-center gap-6 border border-border/40 border-t-2 border-t-brand p-6 md:grid-cols-[1fr_auto]">
					<div>
						<h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
							{t("results.migrationEstimate")}
						</h3>
						<p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
							{t.rich("results.migrationText", {
								strong: (chunks) => (
									<span className="font-medium text-foreground">
										{chunks}
									</span>
								),
								min: data.migrationEstimate.min.toLocaleString(),
								max: data.migrationEstimate.max.toLocaleString(),
							})}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
							render={
								// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
								<a
									href="https://cal.com/webvise"
									target="_blank"
									rel="noopener noreferrer"
								/>
							}
						>
							{t("results.bookCall")}
						</Button>
						{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
						<Button variant="outline" render={<a href="/#contact" />}>
							{t("results.getInTouch")}
						</Button>
					</div>
				</div>
			</div>
		</AnimateIn>
	);
}

export default function WpHealthReport() {
	const t = useTranslations("wpHealthReport");
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
				setErrorMessage(err?.error || t("errors.analyzeFailed"));
				setStatus("error");
			}
		} catch {
			setErrorMessage(t("errors.networkError"));
			setStatus("error");
		}
	}

	return (
		<section id="wp-health-report" className="py-16 md:py-32">
			<div className="mx-auto max-w-[1200px] px-6">
				{status !== "success" ? (
					<>
						<AnimateIn>
							<div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
								<div>
									<h1 className="font-normal text-3xl leading-[1.15] tracking-tight md:text-[48px]">
										{t.rich("hero.title", {
											brand: (chunks) => (
												<span className="text-brand">{chunks}</span>
											),
										})}
									</h1>
									<p className="mt-4 font-light text-lg text-muted-foreground leading-relaxed">
										{t("hero.subtitle")}
									</p>

									<ul className="mt-6 space-y-2">
										{[0, 1, 2, 3].map((i) => (
											<li
												key={i}
												className="flex items-start gap-3 text-sm"
											>
												<span className="mt-1 h-1.5 w-1.5 shrink-0 bg-brand" />
												<span>{t(`hero.benefits.${i}`)}</span>
											</li>
										))}
									</ul>

									<p className="mt-6 text-muted-foreground text-xs">
										{t("hero.trustLine")}
									</p>
								</div>

								<form
									onSubmit={handleSubmit}
									className="space-y-4 border border-border/40 p-6 md:p-8"
									aria-label={t("form.ariaLabel")}
									noValidate
								>
									<div className="space-y-2">
										<Label htmlFor="url">{t("form.url")}</Label>
										<Input
											id="url"
											name="url"
											type="url"
											required
											placeholder={t("form.urlPlaceholder")}
											disabled={status === "loading"}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="email">{t("form.email")}</Label>
											<Input
												id="email"
												name="email"
												type="email"
												required
												placeholder={t("form.emailPlaceholder")}
												disabled={status === "loading"}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="firstName">
												{t("form.name")}{" "}
												<span className="text-muted-foreground">
													{t("form.nameOptional")}
												</span>
											</Label>
											<Input
												id="firstName"
												name="firstName"
												placeholder={t("form.namePlaceholder")}
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
											? t("form.submitting")
											: t("form.submit")}
									</Button>
									<p className="text-center text-muted-foreground text-xs">
										{t("form.noSignup")}
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
							<div className="mt-12 flex flex-col items-center gap-3">
								<div className="h-6 w-6 animate-spin border-2 border-brand border-t-transparent" />
								<p className="text-muted-foreground text-sm">
									{t("loading")}
								</p>
							</div>
						)}
					</>
				) : (
					report && <ReportResults data={report} />
				)}
			</div>

			{/* Trust footer */}
			<div className="mx-auto mt-12 max-w-[1200px] border-t border-border/40 px-6 pt-8 text-center">
				<p className="text-muted-foreground text-xs">{t("trust")}</p>
			</div>
		</section>
	);
}
