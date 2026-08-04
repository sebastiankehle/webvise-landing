"use client";

import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import z from "zod";

import SectionWrapper, {
	type SectionSurface,
} from "@/components/marketing/section-wrapper";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Body, Caption, H2, Lead, Muted } from "@/components/ui/typography";
import { track } from "@/lib/track";
import { trpcClient } from "@/utils/trpc";

const ways = ["network", "refer", "bring"] as const;

export default function BecomePartner({
	surface,
}: {
	surface?: SectionSurface;
}) {
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const formStarted = useRef(false);
	const mountedAt = useRef(Date.now());
	const formRef = useRef<HTMLFormElement>(null);
	const t = useTranslations("becomePartner");

	useEffect(() => {
		const node = formRef.current;
		if (!node) {
			return;
		}
		const onFocusIn = () => {
			if (!formStarted.current) {
				formStarted.current = true;
				track("partner_form_started");
			}
		};
		node.addEventListener("focusin", onFocusIn);
		return () => node.removeEventListener("focusin", onFocusIn);
	}, []);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			discipline: "",
			linkedin: "",
			x: "",
			site: "",
			interest: "",
			message: "",
			// Honeypot: hidden from humans, only bots fill it.
			company: "",
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, t("form.errors.nameRequired")),
				email: z.email(t("form.errors.emailInvalid")),
				discipline: z.string().min(1, t("form.errors.disciplineRequired")),
				linkedin: z.string(),
				x: z.string(),
				site: z.string(),
				interest: z.enum(ways, t("form.errors.interestRequired")),
				message: z.string(),
				company: z.string(),
			}),
		},
		onSubmit: async ({ value }) => {
			setSubmitStatus("idle");
			track("partner_form_submitted", { interest: value.interest || null });
			try {
				await trpcClient.partner.submit.mutate({
					name: value.name.trim(),
					email: value.email.trim(),
					discipline: value.discipline.trim(),
					linkedin: value.linkedin.trim() || undefined,
					x: value.x.trim() || undefined,
					site: value.site.trim() || undefined,
					interest: value.interest as (typeof ways)[number],
					message: value.message.trim() || undefined,
					company: value.company,
					elapsedMs: Date.now() - mountedAt.current,
				});
				setSubmitStatus("success");
				track("partner_form_success", { interest: value.interest || null });
				form.reset();
				formStarted.current = false;
			} catch {
				setSubmitStatus("error");
				track("partner_form_error", { reason: "server_error" });
			}
		},
	});

	return (
		<SectionWrapper id="become-partner" surface={surface}>
			<div className="grid gap-12 md:grid-cols-2 md:gap-20">
				<div>
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("lead")}</Lead>
					<ol className="mt-10 divide-y divide-border/60">
						{ways.map((way, i) => (
							<li className="flex gap-5 py-5 first:pt-0 last:pb-0" key={way}>
								<Caption className="pt-0.5 text-brand-readable tabular-nums">
									0{i + 1}
								</Caption>
								<div>
									<Body className="font-medium text-sm">
										{t(`ways.${way}.title`)}
									</Body>
									<Muted className="mt-1 text-sm leading-relaxed">
										{t(`ways.${way}.text`)}
									</Muted>
								</div>
							</li>
						))}
					</ol>
				</div>

				<form
					aria-label={t("title")}
					autoComplete="off"
					className="surface-card space-y-5 self-start p-6 md:space-y-6 md:p-10"
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
										className="h-9 text-sm md:text-xs"
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
										className="h-9 text-sm md:text-xs"
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
						<form.Field name="discipline">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>
										{t("form.discipline")}
									</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-9 text-sm md:text-xs"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.disciplinePlaceholder")}
										value={field.state.value}
									/>
									<FormMessage errors={field.state.meta.errors} />
								</FormItem>
							)}
						</form.Field>
						<form.Field name="site">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>
										{t("form.website")}
									</FormLabel>
									<Input
										autoComplete="off"
										className="h-9 text-sm md:text-xs"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.websitePlaceholder")}
										type="url"
										value={field.state.value}
									/>
								</FormItem>
							)}
						</form.Field>
					</div>
					<div className="grid gap-5 md:grid-cols-2 md:gap-6">
						<form.Field name="linkedin">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>
										{t("form.linkedin")}
									</FormLabel>
									<Input
										autoComplete="off"
										className="h-9 text-sm md:text-xs"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.linkedinPlaceholder")}
										type="url"
										value={field.state.value}
									/>
								</FormItem>
							)}
						</form.Field>
						<form.Field name="x">
							{(field) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>{t("form.x")}</FormLabel>
									<Input
										autoComplete="off"
										className="h-9 text-sm md:text-xs"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={t("form.xPlaceholder")}
										type="url"
										value={field.state.value}
									/>
								</FormItem>
							)}
						</form.Field>
					</div>
					<form.Field name="interest">
						{(field) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>{t("form.interest")}</FormLabel>
								<NativeSelect
									aria-invalid={field.state.meta.errors.length > 0}
									className="h-9 pr-10 pl-3 text-sm md:text-xs"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									value={field.state.value}
								>
									<option value="">{t("form.interestPlaceholder")}</option>
									{ways.map((way) => (
										<option key={way} value={way}>
											{t(`form.interestOptions.${way}`)}
										</option>
									))}
								</NativeSelect>
								<FormMessage errors={field.state.meta.errors} />
							</FormItem>
						)}
					</form.Field>
					<form.Field name="message">
						{(field) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>{t("form.message")}</FormLabel>
								<Textarea
									autoComplete="off"
									className="px-3 py-2.5 text-sm md:text-xs"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder={t("form.messagePlaceholder")}
									rows={4}
									value={field.state.value}
								/>
							</FormItem>
						)}
					</form.Field>
					{/* Honeypot: hidden from humans; bots that fill it are dropped server-side. */}
					<form.Field name="company">
						{(field) => (
							<div aria-hidden="true" className="sr-only">
								<label htmlFor={field.name}>Leave this field empty</label>
								<input
									autoComplete="off"
									id={field.name}
									name={field.name}
									onChange={(e) => field.handleChange(e.target.value)}
									tabIndex={-1}
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<SubmitButton
								className="self-start md:h-10 md:text-sm"
								disabled={!canSubmit}
								isSubmitting={isSubmitting}
								size="lg"
								variant="brand"
							>
								{t("form.submit")}
							</SubmitButton>
						)}
					</form.Subscribe>
					<output aria-atomic="true" aria-live="polite">
						{submitStatus === "success" && (
							<Muted className="fade-in slide-in-from-bottom-1 animate-in text-sm duration-300 ease-out motion-reduce:animate-none">
								{t("form.success")}
							</Muted>
						)}
						{submitStatus === "error" && (
							<Muted className="fade-in slide-in-from-bottom-1 animate-in text-destructive text-sm duration-300 ease-out motion-reduce:animate-none">
								{t("form.error")}
							</Muted>
						)}
					</output>
				</form>
			</div>
		</SectionWrapper>
	);
}
