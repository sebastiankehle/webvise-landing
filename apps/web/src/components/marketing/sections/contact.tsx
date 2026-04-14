"use client";

import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import z from "zod";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { H2, Lead, Muted } from "@/components/ui/typography";
import { services } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/track";

export default function Contact() {
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const formStarted = useRef(false);
	const t = useTranslations("contact");
	const ts = useTranslations("services");

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			company: "",
			service: "",
			message: "",
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, t("form.errors.nameRequired")),
				email: z.email(t("form.errors.emailInvalid")),
				company: z.string(),
				service: z.string(),
				message: z.string().min(1, t("form.errors.messageRequired")),
			}),
		},
		onSubmit: async ({ value }) => {
			setSubmitStatus("idle");
			track("contact_form_submitted", { service: value.service || null });
			try {
				const res = await fetch("/api/contact", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: value.name.trim(),
						email: value.email.trim(),
						company: value.company,
						service: value.service,
						message: value.message.trim(),
					}),
				});

				if (res.ok) {
					setSubmitStatus("success");
					track("contact_form_success", { service: value.service || null });
					form.reset();
					formStarted.current = false;
				} else {
					setSubmitStatus("error");
					track("contact_form_error", { reason: "server_error" });
				}
			} catch {
				setSubmitStatus("error");
				track("contact_form_error", { reason: "network_error" });
			}
		},
	});

	return (
		<SectionWrapper id="contact" hatch>
			<div className="grid gap-12 md:grid-cols-2 md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>

					<Muted className="mt-6">
						{t("founder.text")}{" "}
						<Link
							href="/about"
							className="text-brand transition-opacity hover:opacity-80"
						>
							{t("founder.name")}
						</Link>
					</Muted>
					<Button
						size="lg"
						variant="outline"
						className="mt-6"
						render={
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							<a
								href="https://cal.com/webvise"
								target="_blank"
								rel="noopener noreferrer"
							/>
						}
					>
						{t("booking.cta")}
					</Button>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					onFocus={() => {
						if (!formStarted.current) {
							formStarted.current = true;
							track("contact_form_started");
						}
					}}
					className="space-y-5 border border-border/20 p-6 md:space-y-6 md:p-10"
					aria-label={t("title")}
					noValidate
					autoComplete="off"
				>
					<div className="grid gap-5 md:grid-cols-2 md:gap-6">
						<form.Field name="name">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>{t("form.name")}</FormLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.namePlaceholder")}
										autoComplete="off"
										aria-invalid={field.state.meta.errors.length > 0}
										className="h-10 text-base md:h-9 md:text-sm"
									/>
									<FormMessage errors={field.state.meta.errors} />
								</FormItem>
							)}
						</form.Field>
						<form.Field name="email">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>{t("form.email")}</FormLabel>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.emailPlaceholder")}
										autoComplete="off"
										aria-invalid={field.state.meta.errors.length > 0}
										className="h-10 text-base md:h-9 md:text-sm"
									/>
									<FormMessage errors={field.state.meta.errors} />
								</FormItem>
							)}
						</form.Field>
					</div>
					<div className="grid gap-5 md:grid-cols-2 md:gap-6">
						<form.Field name="company">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>
										{t("form.company")}
									</FormLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.companyPlaceholder")}
										autoComplete="off"
										className="h-10 text-base md:h-9 md:text-sm"
									/>
								</FormItem>
							)}
						</form.Field>
						<form.Field name="service">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>
										{t("form.service")}
									</FormLabel>
									<select
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="flex h-10 w-full border border-border bg-background px-3 text-base outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/50 md:h-9 md:text-sm"
									>
										<option value="">{t("form.servicePlaceholder")}</option>
										{services.map((s) => (
											<option key={s.slug} value={s.slug}>
												{ts(`${s.translationKey}.title`)}
											</option>
										))}
									</select>
								</FormItem>
							)}
						</form.Field>
					</div>
					<form.Field name="message">
						{(field) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>{t("form.message")}</FormLabel>
								<textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									rows={5}
									placeholder={t("form.messagePlaceholder")}
									autoComplete="off"
									aria-invalid={field.state.meta.errors.length > 0}
									className="flex w-full border border-border bg-background px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-sm"
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
								size="lg"
								className="w-full border-transparent bg-brand text-white md:h-10 md:text-sm [&]:hover:bg-brand/80"
							>
								{t("form.submit")}
							</SubmitButton>
						)}
					</form.Subscribe>
					<output aria-live="polite" aria-atomic="true">
						{submitStatus === "success" && (
							<Muted className="text-sm">{t("form.success")}</Muted>
						)}
						{submitStatus === "error" && (
							<Muted className="text-destructive text-sm">
								{t("form.error")}
							</Muted>
						)}
					</output>
				</form>
			</div>
		</SectionWrapper>
	);
}
