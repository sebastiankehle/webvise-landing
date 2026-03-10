"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export default function Contact() {
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const t = useTranslations("contact");
	const ts = useTranslations("services");

	function validateFields(data: FormData): Record<string, string> {
		const errors: Record<string, string> = {};
		const name = (data.get("name") as string)?.trim();
		const email = (data.get("email") as string)?.trim();
		const message = (data.get("message") as string)?.trim();

		if (!name) errors.name = t("form.errors.nameRequired");
		if (!email) {
			errors.email = t("form.errors.emailRequired");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = t("form.errors.emailInvalid");
		}
		if (!message) errors.message = t("form.errors.messageRequired");

		return errors;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);

		const errors = validateFields(data);
		setFieldErrors(errors);
		if (Object.keys(errors).length > 0) return;

		setStatus("loading");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: (data.get("name") as string).trim(),
					email: (data.get("email") as string).trim(),
					company: data.get("company"),
					service: data.get("service"),
					message: (data.get("message") as string).trim(),
				}),
			});

			if (res.ok) {
				setStatus("success");
				setFieldErrors({});
				form.reset();
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	}

	return (
		<SectionWrapper id="contact">
			<div className="grid gap-10 md:gap-16 md:grid-cols-2">
				<div>
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("subtitle")}
					</p>

					<div className="mt-8 border border-border/40 border-l-2 border-l-brand p-5 md:mt-12 md:p-8">
						<h3 className="font-medium text-base">{t("booking.title")}</h3>
						<p className="mt-2 font-light text-muted-foreground text-sm">
							{t("booking.description")}
						</p>
						<Button
							size="sm"
							className="mt-4"
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
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4 border border-border/40 p-5 md:space-y-5 md:p-8"
					aria-label={t("title")}
					noValidate
				>
					<div className="grid gap-4 md:grid-cols-2 md:gap-5">
						<div className="space-y-2">
							<Label htmlFor="name">{t("form.name")}</Label>
							<Input
								id="name"
								name="name"
								required
								placeholder={t("form.namePlaceholder")}
								aria-invalid={!!fieldErrors.name}
								className={cn("h-10 text-base md:h-8 md:text-xs", fieldErrors.name && "border-destructive")}
								onChange={() => setFieldErrors((prev) => { const { name: _, ...rest } = prev; return rest; })}
							/>
							{fieldErrors.name && <p className="text-destructive text-xs">{fieldErrors.name}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">{t("form.email")}</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								placeholder={t("form.emailPlaceholder")}
								aria-invalid={!!fieldErrors.email}
								className={cn("h-10 text-base md:h-8 md:text-xs", fieldErrors.email && "border-destructive")}
								onChange={() => setFieldErrors((prev) => { const { email: _, ...rest } = prev; return rest; })}
							/>
							{fieldErrors.email && <p className="text-destructive text-xs">{fieldErrors.email}</p>}
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2 md:gap-5">
						<div className="space-y-2">
							<Label htmlFor="company">{t("form.company")}</Label>
							<Input
								id="company"
								name="company"
								placeholder={t("form.companyPlaceholder")}
								className="h-10 text-base md:h-8 md:text-xs"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="service">{t("form.service")}</Label>
							<select
								id="service"
								name="service"
								className="flex h-10 w-full border border-border bg-background px-2.5 text-base outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 md:h-8 md:text-xs"
							>
								<option value="">{t("form.servicePlaceholder")}</option>
								{services.map((s) => (
									<option key={s.slug} value={s.slug}>
										{ts(`${s.translationKey}.title`)}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="message">{t("form.message")}</Label>
						<textarea
							id="message"
							name="message"
							required
							rows={4}
							placeholder={t("form.messagePlaceholder")}
							aria-invalid={!!fieldErrors.message}
							className={cn(
								"flex w-full border bg-background px-2.5 py-2 text-base outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 md:text-xs",
								fieldErrors.message ? "border-destructive" : "border-border",
							)}
							onChange={() => setFieldErrors((prev) => { const { message: _, ...rest } = prev; return rest; })}
						/>
						{fieldErrors.message && <p className="text-destructive text-xs">{fieldErrors.message}</p>}
					</div>
					<Button
						type="submit"
						disabled={status === "loading"}
						size="lg"
						className="w-full md:h-8 md:text-xs"
					>
						{status === "loading" ? t("form.submitting") : t("form.submit")}
					</Button>
					<div aria-live="polite" aria-atomic="true">
						{status === "success" && (
							<p role="status" className="text-muted-foreground text-sm">
								{t("form.success")}
							</p>
						)}
						{status === "error" && (
							<p role="alert" className="text-destructive text-sm">
								{t("form.error")}
							</p>
						)}
					</div>
				</form>
			</div>
		</SectionWrapper>
	);
}
