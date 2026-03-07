"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { services } from "@/data/services";

export default function Contact() {
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const t = useTranslations("contact");
	const ts = useTranslations("services");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");

		const form = e.currentTarget;
		const data = new FormData(form);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.get("name"),
					email: data.get("email"),
					company: data.get("company"),
					service: data.get("service"),
					message: data.get("message"),
				}),
			});

			if (res.ok) {
				setStatus("success");
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
			<div className="grid gap-16 md:grid-cols-2">
				<div>
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("subtitle")}
					</p>

					<div className="mt-12 border border-border/40 p-8">
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
					className="space-y-5 border border-border/40 p-8"
				>
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name">{t("form.name")}</Label>
							<Input
								id="name"
								name="name"
								required
								placeholder={t("form.namePlaceholder")}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">{t("form.email")}</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								placeholder={t("form.emailPlaceholder")}
							/>
						</div>
					</div>
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="company">{t("form.company")}</Label>
							<Input
								id="company"
								name="company"
								placeholder={t("form.companyPlaceholder")}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="service">{t("form.service")}</Label>
							<select
								id="service"
								name="service"
								className="flex h-8 w-full border border-border bg-background px-2.5 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
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
							className="flex w-full border border-border bg-background px-2.5 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
						/>
					</div>
					<Button
						type="submit"
						disabled={status === "loading"}
						className="w-full"
					>
						{status === "loading" ? t("form.submitting") : t("form.submit")}
					</Button>
					{status === "success" && (
						<p className="text-muted-foreground text-sm">{t("form.success")}</p>
					)}
					{status === "error" && (
						<p className="text-destructive text-sm">{t("form.error")}</p>
					)}
				</form>
			</div>
		</SectionWrapper>
	);
}
