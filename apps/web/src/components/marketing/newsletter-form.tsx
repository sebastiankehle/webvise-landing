"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import { track } from "@/lib/track";

interface NewsletterFormProps {
	placeholder: string;
	buttonLabel: string;
	success: string;
	error: string;
}

export function NewsletterForm({
	placeholder,
	buttonLabel,
	success,
	error,
}: NewsletterFormProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	async function handleSubscribe(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) return;

		setStatus("loading");
		track("newsletter_signup", { location: "footer" });

		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim() }),
			});

			if (res.ok) {
				setStatus("success");
				track("newsletter_success", { location: "footer" });
				setEmail("");
			} else {
				setStatus("error");
				track("newsletter_error", { reason: "server_error" });
			}
		} catch {
			setStatus("error");
			track("newsletter_error", { reason: "network_error" });
		}
	}

	if (status === "success") {
		return <Muted className="text-xs text-green-600">{success}</Muted>;
	}

	return (
		<form onSubmit={handleSubscribe} className="flex flex-col gap-2">
			<Input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder={placeholder}
				required
				className="h-8 w-full text-xs"
			/>
			<Button
				type="submit"
				size="sm"
				variant="outline"
				disabled={status === "loading"}
				className="h-8 w-full text-xs"
			>
				{buttonLabel}
			</Button>
			{status === "error" && (
				<Muted className="text-xs text-destructive">{error}</Muted>
			)}
		</form>
	);
}
