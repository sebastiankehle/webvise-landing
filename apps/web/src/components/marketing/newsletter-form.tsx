"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import { track } from "@/lib/track";

interface NewsletterFormProps {
	buttonLabel: string;
	error: string;
	placeholder: string;
	success: string;
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
		if (!email.trim()) {
			return;
		}

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
		return <Muted className="text-green-600 text-xs">{success}</Muted>;
	}

	return (
		<form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
			<Input
				className="h-8 w-full text-xs"
				onChange={(e) => setEmail(e.target.value)}
				placeholder={placeholder}
				required
				type="email"
				value={email}
			/>
			<Button
				className="h-8 w-full text-xs"
				disabled={status === "loading"}
				size="sm"
				type="submit"
				variant="outline"
			>
				{buttonLabel}
			</Button>
			{status === "error" && (
				<Muted className="text-destructive text-xs">{error}</Muted>
			)}
		</form>
	);
}
