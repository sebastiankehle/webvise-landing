"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Caption, Muted } from "@/components/ui/typography";
import { useNewsletterSubscribe } from "@/hooks/use-newsletter-subscribe";

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
	const { status, subscribe } = useNewsletterSubscribe("blog_article");

	async function handleSubscribe(e: React.FormEvent) {
		e.preventDefault();
		if (await subscribe(email)) {
			setEmail("");
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
