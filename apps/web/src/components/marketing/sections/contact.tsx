"use client";

import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
import { trpcClient } from "@/utils/trpc";

export default function Contact() {
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const formStarted = useRef(false);
	const formRef = useRef<HTMLFormElement>(null);
	const t = useTranslations("contact");
	const ts = useTranslations("services");

	useEffect(() => {
		const node = formRef.current;
		if (!node) {
			return;
		}
		const onFocusIn = () => {
			if (!formStarted.current) {
				formStarted.current = true;
				track("contact_form_started");
			}
		};
		node.addEventListener("focusin", onFocusIn);
		return () => node.removeEventListener("focusin", onFocusIn);
	}, []);

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
				message: z.string(),
			}),
		},
		onSubmit: async ({ value }) => {
			setSubmitStatus("idle");
			track("contact_form_submitted", { service: value.service || null });
			try {
				await trpcClient.contact.submit.mutate({
					name: value.name.trim(),
					email: value.email.trim(),
					company: value.company,
					service: value.service,
					message: value.message.trim(),
				});
				setSubmitStatus("success");
				track("contact_form_success", { service: value.service || null });
				form.reset();
				formStarted.current = false;
			} catch {
				setSubmitStatus("error");
				track("contact_form_error", { reason: "server_error" });
			}
		},
	});

	return (
		<SectionWrapper hatch id="contact">
			<div className="grid gap-12 md:grid-cols-2 md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>

					<Muted className="mt-6">
						{t("founder.text")}{" "}
						<Link
							className="text-brand-readable transition-colors hover:text-brand-readable"
							href="/about"
						>
							{t("founder.name")}
						</Link>
					</Muted>
					<Button
						className="mt-6"
						onClick={() =>
							track("cal_booking_clicked", { location: "contact" })
						}
						render={
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							<a
								href="https://cal.com/webvise"
								rel="noopener noreferrer"
								target="_blank"
							/>
						}
						size="lg"
					>
						{t("booking.cta")}
					</Button>
				</div>

				<form
					aria-label={t("title")}
					autoComplete="off"
					className="space-y-5 border border-border/20 p-6 md:space-y-6 md:p-10"
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					ref={formRef}
				>
					<div className="grid gap-5 md:grid-cols-2 md:gap-6">
						<form.Field name="name">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>{t("form.name")}</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-10 text-base md:h-9 md:text-sm"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.namePlaceholder")}
										value={field.state.value}
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
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-10 text-base md:h-9 md:text-sm"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.emailPlaceholder")}
										type="email"
										value={field.state.value}
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
										autoComplete="off"
										className="h-10 text-base md:h-9 md:text-sm"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.companyPlaceholder")}
										value={field.state.value}
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
										className="flex h-10 w-full border border-input bg-card px-3 text-base outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand-border md:h-9 md:text-sm dark:bg-card/35"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										value={field.state.value}
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
									aria-invalid={field.state.meta.errors.length > 0}
									autoComplete="off"
									className="flex w-full border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand focus:ring-1 focus:ring-brand-border aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-sm dark:bg-card/35"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder={t("form.messagePlaceholder")}
									rows={5}
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
								className="[&]:hover:!bg-brand-hover w-full border-transparent bg-brand text-brand-foreground md:h-10 md:text-sm"
								disabled={!canSubmit}
								isSubmitting={isSubmitting}
								size="lg"
							>
								{t("form.submit")}
							</SubmitButton>
						)}
					</form.Subscribe>
					<output aria-atomic="true" aria-live="polite">
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
