"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import z from "zod";

import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { H3, Muted } from "@/components/ui/typography";

const LABELS = {
	en: {
		emailLabel: "Email",
		placeholder: "Your email address",
		button: "Get the Report",
		success: "Check your inbox!",
		error: "Something went wrong. Please try again.",
		emailInvalid: "Please enter a valid email address.",
	},
	de: {
		emailLabel: "E-Mail",
		placeholder: "Ihre E-Mail-Adresse",
		button: "Report anfordern",
		success: "Prüfen Sie Ihr Postfach!",
		error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
		emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
	},
} as const;

export default function ReportDownloadForm({
	reportId,
	title,
	description,
}: {
	reportId: string;
	title: string;
	description: string;
}) {
	const locale = useLocale();
	const l =
		locale in LABELS ? LABELS[locale as keyof typeof LABELS] : LABELS.en;
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onSubmit: z.object({
				email: z.email(l.emailInvalid),
			}),
		},
		onSubmit: async ({ value }) => {
			setSubmitStatus("idle");
			try {
				const res = await fetch("/api/report-download", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: value.email.trim(),
						reportId,
						locale,
					}),
				});
				if (res.ok) {
					setSubmitStatus("success");
					form.reset();
				} else {
					setSubmitStatus("error");
				}
			} catch {
				setSubmitStatus("error");
			}
		},
	});

	return (
		<div className="my-10 border border-brand/20 bg-brand/[0.03]">
			<div className="p-6 md:p-8">
				<div className="flex items-start gap-4">
					<Mail
						className="mt-0.5 h-5 w-5 shrink-0 text-brand"
						strokeWidth={1.5}
					/>
					<div className="min-w-0">
						<H3 className="text-base tracking-tight">{title}</H3>
						<Muted className="mt-1 text-sm leading-relaxed">
							{description}
						</Muted>
					</div>
				</div>

				{submitStatus === "success" ? (
					<div className="mt-6 flex items-center gap-3 border border-brand/20 bg-brand/5 p-4">
						<Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
						<Muted className="font-medium text-foreground text-sm">
							{l.success}
						</Muted>
					</div>
				) : (
					<form
						className="mt-6 flex flex-col gap-3 sm:flex-row"
						noValidate
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<form.Field name="email">
							{(field) => (
								<FormItem className="flex-1">
									<FormLabel className="sr-only" htmlFor={field.name}>
										{l.emailLabel}
									</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="email"
										className="h-10 text-base md:text-sm"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(e.target.value);
											if (submitStatus === "error") {
												setSubmitStatus("idle");
											}
										}}
										placeholder={l.placeholder}
										type="email"
										value={field.state.value}
									/>
									<FormMessage errors={field.state.meta.errors} />
								</FormItem>
							)}
						</form.Field>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<SubmitButton
									className="h-10 border-transparent bg-brand text-white [&]:hover:bg-brand/80"
									disabled={!canSubmit}
									isSubmitting={isSubmitting}
								>
									{l.button}
								</SubmitButton>
							)}
						</form.Subscribe>
					</form>
				)}

				<output aria-atomic="true" aria-live="polite">
					{submitStatus === "error" && (
						<Muted className="mt-3 text-destructive text-sm">{l.error}</Muted>
					)}
				</output>
			</div>
		</div>
	);
}
