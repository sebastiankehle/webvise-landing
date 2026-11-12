"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import z from "zod";

import { actionVariants } from "@/components/marketing/action";
import SectionWrapper, {
	type SectionSurface,
} from "@/components/marketing/section-wrapper";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { H2, H3, Muted } from "@/components/ui/typography";
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
					<p className="mt-5 max-w-[48ch] text-foreground/85 text-lg leading-[1.6]">
						{t("lead")}
					</p>
					<ul className="mt-10 grid gap-7">
						{ways.map((way) => (
							<li key={way}>
								<H3>{t(`ways.${way}.title`)}</H3>
								<p className="mt-1.5 max-w-[48ch] text-base text-foreground/75 leading-[1.6]">
									{t(`ways.${way}.text`)}
								</p>
							</li>
						))}
					</ul>
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.name")}
									</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.email")}
									</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.discipline")}
									</FormLabel>
									<Input
										aria-invalid={field.state.meta.errors.length > 0}
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.website")}
									</FormLabel>
									<Input
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.linkedin")}
									</FormLabel>
									<Input
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
									<FormLabel className="text-sm" htmlFor={field.name}>
										{t("form.x")}
									</FormLabel>
									<Input
										autoComplete="off"
										className="h-11 rounded-sm px-3.5 text-base md:text-base"
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
								<FormLabel className="text-sm" htmlFor={field.name}>
									{t("form.interest")}
								</FormLabel>
								<NativeSelect
									aria-invalid={field.state.meta.errors.length > 0}
									className="h-11 rounded-sm pr-10 pl-3.5 text-base md:text-base"
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
								<FormLabel className="text-sm" htmlFor={field.name}>
									{t("form.message")}
								</FormLabel>
								<Textarea
									autoComplete="off"
									className="rounded-sm px-3.5 py-3 text-base md:text-base"
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
							<button
								className={actionVariants()}
								disabled={!canSubmit || isSubmitting}
								type="submit"
							>
								{isSubmitting && (
									<Loader2 aria-hidden="true" className="size-4 animate-spin" />
								)}
								{t("form.submit")}
							</button>
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
