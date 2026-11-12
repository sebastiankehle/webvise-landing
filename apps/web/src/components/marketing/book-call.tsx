"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useForm } from "@tanstack/react-form";
import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import z from "zod";

import { ActionArrow, actionVariants } from "@/components/marketing/action";
import { FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	BOOKING_TOPICS,
	type BookingTopic,
	isBookingTopic,
} from "@/data/booking";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { trpcClient } from "@/utils/trpc";

const CAL_NAMESPACE = "book";
const CAL_LINK = "webvise/30min";
const afterKeys = ["0", "1", "2"] as const;

const fieldClassName =
	"h-11 rounded-sm bg-background px-3.5 text-base md:text-base";
const labelClassName = "block font-medium text-base text-foreground";
const chipClassName =
	"flex h-11 cursor-pointer items-center rounded-sm border border-foreground/15 px-4 text-base text-foreground outline-none transition-[background-color,color,scale] duration-150 ease-out hover:bg-foreground/[0.06] active:scale-[0.98] peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-checked:hover:bg-foreground/85 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card";

interface Prefill {
	email: string;
	name: string;
	notes: string;
}

/** Two ways to the discovery call in one card: pick a time, or write a
 * message. The message is an end in itself; the calendar after it is an
 * offer, with name and email already filled in. */
export default function BookCall() {
	const t = useTranslations("book");
	const [topic, setTopic] = useState<BookingTopic>("website");
	const [mode, setMode] = useState<"calendar" | "form">("calendar");
	// What the visitor sent, kept to fill the calendar if they open it next.
	const [sent, setSent] = useState<Prefill | null>(null);
	const [failed, setFailed] = useState(false);
	const mountedAt = useRef(Date.now());
	const sentHeadingRef = useRef<HTMLHeadingElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const { resolvedTheme } = useTheme();

	// The topic chosen on the previous page arrives in the URL. Reading it
	// after mount keeps the form in the server-rendered HTML.
	useEffect(() => {
		const requested = new URLSearchParams(window.location.search).get("topic");
		if (isBookingTopic(requested)) {
			setTopic(requested);
		}
	}, []);

	useEffect(() => {
		(async () => {
			const cal = await getCalApi({ namespace: CAL_NAMESPACE });
			cal("ui", { hideEventTypeDetails: false });
			cal("on", {
				action: "bookingSuccessful",
				callback: () => track("book_call_booked"),
			});
		})();
	}, []);

	// The form is gone once it is sent: the shorter card comes back into view
	// and focus moves to what replaced the form.
	useEffect(() => {
		if (sent) {
			cardRef.current?.scrollIntoView({ block: "start" });
			sentHeadingRef.current?.focus({ preventScroll: true });
		}
	}, [sent]);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			company: "",
			message: "",
			// Honeypot: hidden from humans, only bots fill it.
			website: "",
		},
		validators: {
			onSubmit: z.object({
				name: z.string().trim().min(1, t("form.errors.nameRequired")),
				email: z.email(t("form.errors.emailInvalid")),
				company: z.string(),
				message: z.string(),
				website: z.string(),
			}),
		},
		onSubmitInvalid: () => {
			// Wait for the errors to render, then put focus on the first one.
			requestAnimationFrame(() => {
				formRef.current
					?.querySelector<HTMLElement>('[aria-invalid="true"]')
					?.focus();
			});
		},
		onSubmit: async ({ value }) => {
			const topicLabel = t(`topics.${topic}`);
			const message = value.message.trim();
			track("book_details_submitted", { topic });
			setFailed(false);
			try {
				await trpcClient.contact.submit.mutate({
					name: value.name.trim(),
					email: value.email.trim(),
					company: value.company.trim(),
					service: `${t("form.inboxLabel")}: ${topicLabel}`,
					message,
					website: value.website,
					elapsedMs: Date.now() - mountedAt.current,
				});
			} catch {
				setFailed(true);
				track("book_details_error");
				return;
			}
			setSent({
				name: value.name.trim(),
				email: value.email.trim(),
				notes: [topicLabel, message].filter(Boolean).join("\n\n"),
			});
		},
	});

	const topicField = (
		<fieldset>
			<legend className={labelClassName}>{t("form.topicLabel")}</legend>
			<div className="mt-3 flex flex-wrap gap-2">
				{BOOKING_TOPICS.map((option) => (
					<label key={option}>
						<input
							checked={topic === option}
							className="peer sr-only"
							name="topic"
							onChange={() => setTopic(option)}
							type="radio"
							value={option}
						/>
						<span className={chipClassName}>{t(`topics.${option}`)}</span>
					</label>
				))}
			</div>
		</fieldset>
	);

	const pathSwitch = (
		<fieldset className="inline-flex h-11 items-center rounded-full border border-foreground/15 p-1">
			<legend className="sr-only">{t("paths.label")}</legend>
			{(["calendar", "form"] as const).map((key) => (
				<button
					aria-pressed={mode === key}
					className={cn(
						"h-9 whitespace-nowrap rounded-full px-2.5 text-[0.8125rem] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/70 sm:px-4 sm:text-base min-[400px]:text-sm",
						mode === key
							? "bg-foreground text-background"
							: "text-muted-foreground hover:text-foreground"
					)}
					key={key}
					onClick={() => {
						setMode(key);
						track("book_path_selected", { path: key });
					}}
					type="button"
				>
					{t(`paths.${key}`)}
				</button>
			))}
		</fieldset>
	);

	return (
		<div>
			<div className="surface-card scroll-mt-4 p-6 md:p-10" ref={cardRef}>
				{pathSwitch}
				{!(mode === "form" && sent) && <div className="mt-8">{topicField}</div>}

				{/* The calendar stays loaded behind the form, so switching back is instant */}
				{(mode === "calendar" || !sent) && (
					<section
						aria-label={t("calendar.title")}
						className="mt-7"
						hidden={mode !== "calendar"}
					>
						<p className="text-base text-foreground/75">
							{t("calendar.subtitle")}
						</p>
						<div className="mt-7 min-h-[620px] overflow-hidden rounded-[10px] bg-card">
							<Cal
								calLink={CAL_LINK}
								config={{
									layout: "month_view",
									theme: resolvedTheme === "dark" ? "dark" : "light",
									...(sent
										? { name: sent.name, email: sent.email, notes: sent.notes }
										: { notes: t(`topics.${topic}`) }),
								}}
								namespace={CAL_NAMESPACE}
								style={{ width: "100%", height: "100%" }}
							/>
						</div>
					</section>
				)}

				{mode === "form" && sent && (
					<div className="fade-in slide-in-from-bottom-2 mt-8 flex animate-in flex-col items-start duration-300 ease-out motion-reduce:animate-none">
						<span
							aria-hidden="true"
							className="flex size-10 items-center justify-center rounded-full bg-foreground text-background"
						>
							<Check className="size-5" strokeWidth={2.5} />
						</span>
						<h2
							className="mt-6 font-display text-2xl text-foreground leading-tight tracking-[-0.02em] outline-none md:text-3xl"
							ref={sentHeadingRef}
							tabIndex={-1}
						>
							{t("form.sent.title")}
						</h2>
						<p className="mt-3 max-w-[46ch] text-foreground/80 text-lg leading-[1.6]">
							{t("form.sent.body")}
						</p>
						<button
							className={cn(actionVariants({ variant: "ink" }), "mt-8")}
							onClick={() => {
								setMode("calendar");
								track("book_path_selected", { path: "calendar" });
							}}
							type="button"
						>
							{t("form.sent.book")}
							<ActionArrow />
						</button>
						<p className="mt-3 text-muted-foreground text-sm">
							{t("form.sent.bookNote")}
						</p>
					</div>
				)}

				{mode === "form" && !sent && (
					<div className="mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-12">
						<form
							aria-label={t("form.title")}
							className="grid content-start gap-7 lg:col-span-7"
							noValidate
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								form.handleSubmit();
							}}
							ref={formRef}
						>
							<div className="grid gap-x-4 gap-y-7 md:grid-cols-2">
								<form.Field name="name">
									{(field) => (
										<FormItem>
											<label className={labelClassName} htmlFor={field.name}>
												{t("form.name")}
											</label>
											<Input
												aria-describedby={
													field.state.meta.errors.length > 0
														? `${field.name}-error`
														: undefined
												}
												aria-invalid={field.state.meta.errors.length > 0}
												aria-required="true"
												autoComplete="name"
												className={fieldClassName}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												value={field.state.value}
											/>
											<FormMessage
												errors={field.state.meta.errors}
												id={`${field.name}-error`}
												role="alert"
											/>
										</FormItem>
									)}
								</form.Field>
								<form.Field name="email">
									{(field) => (
										<FormItem>
											<label className={labelClassName} htmlFor={field.name}>
												{t("form.email")}
											</label>
											<Input
												aria-describedby={
													field.state.meta.errors.length > 0
														? `${field.name}-error`
														: undefined
												}
												aria-invalid={field.state.meta.errors.length > 0}
												aria-required="true"
												autoComplete="email"
												className={fieldClassName}
												id={field.name}
												inputMode="email"
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												type="email"
												value={field.state.value}
											/>
											<FormMessage
												errors={field.state.meta.errors}
												id={`${field.name}-error`}
												role="alert"
											/>
										</FormItem>
									)}
								</form.Field>
							</div>

							<form.Field name="company">
								{(field) => (
									<FormItem>
										<label className={labelClassName} htmlFor={field.name}>
											{t("form.company")}{" "}
											<span className="font-normal text-muted-foreground">
												({t("form.optional")})
											</span>
										</label>
										<Input
											autoComplete="organization"
											className={fieldClassName}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											value={field.state.value}
										/>
									</FormItem>
								)}
							</form.Field>

							<form.Field name="message">
								{(field) => (
									<FormItem>
										<label className={labelClassName} htmlFor={field.name}>
											{t("form.message")}{" "}
											<span className="font-normal text-muted-foreground">
												({t("form.optional")})
											</span>
										</label>
										<Textarea
											className="min-h-28 rounded-sm bg-background px-3.5 py-3 text-base md:text-base"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											placeholder={t("form.messagePlaceholder")}
											rows={4}
											value={field.state.value}
										/>
									</FormItem>
								)}
							</form.Field>

							{/* Honeypot: hidden from humans; bots that fill it are dropped server-side. */}
							<form.Field name="website">
								{(field) => (
									<div aria-hidden="true" className="sr-only">
										<label htmlFor={field.name}>Leave this field empty</label>
										<input
											autoComplete="off"
											id={field.name}
											name={field.name}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											tabIndex={-1}
											value={field.state.value}
										/>
									</div>
								)}
							</form.Field>

							<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<button
											className={cn(actionVariants())}
											disabled={isSubmitting}
											type="submit"
										>
											{t("form.submit")}
											{isSubmitting ? (
												<Loader2
													aria-hidden="true"
													className="size-4 animate-spin"
												/>
											) : (
												<ActionArrow />
											)}
										</button>
									)}
								</form.Subscribe>
								<p className="text-muted-foreground text-sm">
									{t("form.note")}
								</p>
							</div>
							<output aria-atomic="true" aria-live="polite">
								{failed && (
									<p className="text-destructive text-sm">{t("form.error")}</p>
								)}
							</output>
						</form>

						{/* What the written way leads to, so nobody expects a forced call */}
						<div className="lg:col-span-4 lg:col-start-9">
							<h3 className={labelClassName}>{t("form.after.title")}</h3>
							<ol className="mt-4 grid gap-4">
								{afterKeys.map((key, index) => (
									<li
										className="flex items-start gap-3 text-base text-foreground/80 leading-[1.6]"
										key={key}
									>
										<span className="flex size-6 shrink-0 items-center justify-center rounded-full text-foreground text-sm tabular-nums shadow-[inset_0_0_0_1px_rgba(14,18,23,0.16)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]">
											{index + 1}
										</span>
										{t(`form.after.steps.${key}`)}
									</li>
								))}
							</ol>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
