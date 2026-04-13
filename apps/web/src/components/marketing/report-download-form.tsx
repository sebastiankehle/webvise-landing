"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import z from "zod";

import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

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
					<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
						<Mail className="h-5 w-5 text-brand" strokeWidth={1.5} />
					</div>
					<div className="min-w-0">
						<h3 className="font-medium text-base tracking-tight">{title}</h3>
						<p className="mt-1 text-muted-foreground text-sm leading-relaxed">
							{description}
						</p>
					</div>
				</div>

				{submitStatus === "success" ? (
					<div className="mt-6 flex items-center gap-3 border border-brand/20 bg-brand/5 p-4">
						<Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
						<span className="font-medium text-sm">{l.success}</span>
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="mt-6 flex flex-col gap-3 sm:flex-row"
						noValidate
					>
						<form.Field name="email">
							{(field) => (
								<FormItem className="flex-1">
									<FormLabel htmlFor={field.name} className="sr-only">
										{l.emailLabel}
									</FormLabel>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => {
											field.handleChange(e.target.value);
											if (submitStatus === "error") setSubmitStatus("idle");
										}}
										placeholder={l.placeholder}
										autoComplete="email"
										aria-invalid={field.state.meta.errors.length > 0}
										className="h-10 text-base md:text-sm"
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
									isSubmitting={isSubmitting}
									disabled={!canSubmit}
									className="h-10 border-transparent bg-brand text-white [&]:hover:bg-brand/80"
								>
									{l.button}
								</SubmitButton>
							)}
						</form.Subscribe>
					</form>
				)}

				<output aria-live="polite" aria-atomic="true">
					{submitStatus === "error" && (
						<p className="mt-3 text-destructive text-sm">{l.error}</p>
					)}
				</output>
			</div>
		</div>
	);
}
