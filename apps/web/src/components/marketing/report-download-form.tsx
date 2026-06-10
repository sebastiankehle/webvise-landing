"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useState } from "react";
import z from "zod";

import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { H3, Muted } from "@/components/ui/typography";
import { trpcClient } from "@/utils/trpc";

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
	const t = useTranslations("reportDownload");
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onSubmit: z.object({
				email: z.email(t("emailInvalid")),
			}),
		},
		onSubmit: async ({ value }) => {
			setSubmitStatus("idle");
			posthog.capture("report_download_requested", {
				report_id: reportId,
				locale,
			});
			try {
				await trpcClient.reportDownload.request.mutate({
					email: value.email.trim(),
					reportId,
					locale,
				});
				setSubmitStatus("success");
				posthog.capture("report_download_success", {
					report_id: reportId,
					locale,
				});
				form.reset();
			} catch {
				setSubmitStatus("error");
				posthog.capture("report_download_error", {
					report_id: reportId,
					reason: "server_error",
				});
			}
		},
	});

	return (
		<div className="surface-card my-10 overflow-hidden">
			<div className="p-6 md:p-8">
				<div className="flex items-start gap-4">
					<Mail
						className="mt-0.5 h-5 w-5 shrink-0 text-brand-icon"
						strokeWidth={1.5}
					/>
					<div className="min-w-0">
						<H3 className="text-base">{title}</H3>
						<Muted className="mt-1 text-sm leading-relaxed">
							{description}
						</Muted>
					</div>
				</div>

				{submitStatus === "success" ? (
					<div className="mt-6 flex items-center gap-3 border-border/60 border-t pt-4">
						<Check
							className="h-4 w-4 shrink-0 text-brand-icon"
							strokeWidth={2}
						/>
						<Muted className="font-medium text-foreground text-sm">
							{t("success")}
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
										{t("emailLabel")}
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
										placeholder={t("placeholder")}
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
									className="h-10"
									disabled={!canSubmit}
									isSubmitting={isSubmitting}
									variant="brand"
								>
									{t("button")}
								</SubmitButton>
							)}
						</form.Subscribe>
					</form>
				)}

				<output aria-atomic="true" aria-live="polite">
					{submitStatus === "error" && (
						<Muted className="mt-3 text-destructive text-sm">
							{t("error")}
						</Muted>
					)}
				</output>
			</div>
		</div>
	);
}
