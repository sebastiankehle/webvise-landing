"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import z from "zod";

import { actionVariants } from "@/components/marketing/action";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { H3, Muted } from "@/components/ui/typography";
import { usePathname } from "@/i18n/navigation";
import { getPostHog } from "@/lib/posthog-client";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

export default function ReportDownloadForm({
	reportId,
	title,
	description,
	buttonLabel,
	className,
}: {
	reportId: string;
	title: string;
	description: string;
	buttonLabel?: string;
	className?: string;
}) {
	const locale = useLocale();
	const path = usePathname();
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
			getPostHog().then((posthog) =>
				posthog?.capture("report_download_requested", {
					report_id: reportId,
					locale,
				})
			);
			try {
				await trpcClient.reportDownload.request.mutate({
					email: value.email.trim(),
					reportId,
					locale,
					path,
				});
				setSubmitStatus("success");
				getPostHog().then((posthog) =>
					posthog?.capture("report_download_success", {
						report_id: reportId,
						locale,
					})
				);
				form.reset();
			} catch {
				setSubmitStatus("error");
				getPostHog().then((posthog) =>
					posthog?.capture("report_download_error", {
						report_id: reportId,
						reason: "server_error",
					})
				);
			}
		},
	});

	return (
		<div className={cn("surface-card my-10 overflow-hidden", className)}>
			<div className="p-6 md:p-8">
				<H3>{title}</H3>
				<p className="mt-1.5 text-base text-foreground/75 leading-[1.6]">
					{description}
				</p>

				{submitStatus === "success" ? (
					<div className="fade-in slide-in-from-bottom-1 mt-6 flex animate-in items-center gap-3 duration-300 ease-out motion-reduce:animate-none">
						<Check
							aria-hidden="true"
							className="size-4 shrink-0 text-success"
							strokeWidth={2}
						/>
						<Muted className="font-medium text-base text-foreground">
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
										className="h-11 rounded-sm bg-background px-3.5 text-base md:text-base"
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
								<button
									className={actionVariants({ size: "md", className: "h-11" })}
									disabled={!canSubmit || isSubmitting}
									type="submit"
								>
									{isSubmitting && (
										<Loader2
											aria-hidden="true"
											className="size-4 animate-spin"
										/>
									)}
									{buttonLabel ?? t("button")}
								</button>
							)}
						</form.Subscribe>
					</form>
				)}

				<output aria-atomic="true" aria-live="polite">
					{submitStatus === "error" && (
						<Muted className="fade-in slide-in-from-bottom-1 mt-3 animate-in text-destructive text-sm duration-300 ease-out motion-reduce:animate-none">
							{t("error")}
						</Muted>
					)}
				</output>
			</div>
		</div>
	);
}
