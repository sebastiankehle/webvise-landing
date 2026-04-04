"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";

const LABELS = {
	en: {
		placeholder: "Your email address",
		button: "Get the Report",
		sending: "Sending...",
		success: "Check your inbox!",
		error: "Something went wrong. Please try again.",
	},
	de: {
		placeholder: "Ihre E-Mail-Adresse",
		button: "Report anfordern",
		sending: "Wird gesendet...",
		success: "Prüfen Sie Ihr Postfach!",
		error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
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
	const l = locale in LABELS ? LABELS[locale as keyof typeof LABELS] : LABELS.en;
	const [email, setEmail] = useState("");
	const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email || state === "loading") return;

		setState("loading");
		try {
			const res = await fetch("/api/report-download", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, reportId, locale }),
			});
			if (!res.ok) throw new Error();
			setState("success");
		} catch {
			setState("error");
		}
	}

	return (
		<div className="my-10 border border-brand/20 bg-brand/[0.03]">
			<div className="p-6 md:p-8">
				<div className="flex items-start gap-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/5">
						<Mail className="h-5 w-5 text-brand" strokeWidth={1.5} />
					</div>
					<div className="min-w-0">
						<h3 className="text-base font-medium tracking-tight">{title}</h3>
						<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>
				</div>

				{state === "success" ? (
					<div className="mt-6 flex items-center gap-3 border border-brand/20 bg-brand/5 p-4">
						<Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
						<span className="text-sm font-medium">{l.success}</span>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="mt-6 flex gap-3">
						<input
							type="email"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (state === "error") setState("idle");
							}}
							placeholder={l.placeholder}
							className="h-10 flex-1 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand/50"
						/>
						<button
							type="submit"
							disabled={state === "loading"}
							className="inline-flex h-10 items-center gap-2 border border-transparent bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand/80 disabled:opacity-50"
						>
							{state === "loading" ? (
								<>
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
									{l.sending}
								</>
							) : (
								<>
									{l.button}
									<ArrowRight className="h-3.5 w-3.5" />
								</>
							)}
						</button>
					</form>
				)}

				{state === "error" && (
					<p className="mt-3 text-sm text-destructive">{l.error}</p>
				)}
			</div>
		</div>
	);
}
