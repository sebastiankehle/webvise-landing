"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Caption, Muted } from "@/components/ui/typography";
import { track } from "@/lib/track";
import { trpcClient } from "@/utils/trpc";

interface BlogNewsletterCardProps {
	buttonLabel: string;
	error: string;
	placeholder: string;
	success: string;
	title: string;
}

export function BlogNewsletterCard({
	title,
	placeholder,
	buttonLabel,
	success,
	error,
}: BlogNewsletterCardProps) {
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
		track("newsletter_signup", { location: "blog_article" });

		try {
			await trpcClient.newsletter.subscribe.mutate({ email: email.trim() });
			setStatus("success");
			track("newsletter_success", { location: "blog_article" });
			setEmail("");
		} catch {
			setStatus("error");
			track("newsletter_error", {
				location: "blog_article",
				reason: "server_error",
			});
		}
	}

	return (
		<aside className="surface-card media-frame w-full max-w-[560px] justify-self-end">
			<div className="p-7 md:p-10">
				<Caption className="block text-brand-readable text-sm">{title}</Caption>
				{status === "success" ? (
					<Muted className="mt-6 text-sm text-success">{success}</Muted>
				) : (
					<form className="mt-8 flex flex-col gap-3" onSubmit={handleSubscribe}>
						<Input
							className="h-9 px-2.5 text-xs md:text-xs"
							onChange={(e) => setEmail(e.target.value)}
							placeholder={placeholder}
							required
							type="email"
							value={email}
						/>
						<Button
							className="self-start"
							disabled={status === "loading"}
							size="lg"
							type="submit"
							variant="brand"
						>
							{buttonLabel}
						</Button>
						{status === "error" && (
							<Muted className="text-destructive text-sm">{error}</Muted>
						)}
					</form>
				)}
			</div>
		</aside>
	);
}
