"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import { track } from "@/lib/track";
import { trpcClient } from "@/utils/trpc";

interface NewsletterFormProps {
	buttonLabel: string;
	error: string;
	location?: string;
	placeholder: string;
	success: string;
}

export function NewsletterForm({
	placeholder,
	buttonLabel,
	success,
	error,
	location = "footer",
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
		track("newsletter_signup", { location });

		try {
			await trpcClient.newsletter.subscribe.mutate({ email: email.trim() });
			setStatus("success");
			track("newsletter_success", { location });
			setEmail("");
		} catch {
			setStatus("error");
			track("newsletter_error", { location, reason: "server_error" });
		}
	}

	if (status === "success") {
		return (
			<Muted className="fade-in slide-in-from-bottom-1 animate-in text-success text-xs duration-300 ease-out motion-reduce:animate-none">
				{success}
			</Muted>
		);
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
				className="h-8 self-start text-xs"
				disabled={status === "loading"}
				size="sm"
				type="submit"
				variant="outline"
			>
				{buttonLabel}
			</Button>
			{status === "error" && (
				<Muted className="fade-in slide-in-from-bottom-1 animate-in text-destructive text-xs duration-300 ease-out motion-reduce:animate-none">
					{error}
				</Muted>
			)}
		</form>
	);
}
