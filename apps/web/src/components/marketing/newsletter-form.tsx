"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import {
	type NewsletterPlacement,
	useNewsletterSubscribe,
} from "@/hooks/use-newsletter-subscribe";

interface NewsletterFormProps {
	buttonLabel: string;
	error: string;
	placeholder: string;
	placement?: NewsletterPlacement;
	success: string;
}

export function NewsletterForm({
	placeholder,
	buttonLabel,
	success,
	error,
	placement = "footer",
}: NewsletterFormProps) {
	const [email, setEmail] = useState("");
	const { status, subscribe } = useNewsletterSubscribe(placement);

	async function handleSubscribe(e: React.FormEvent) {
		e.preventDefault();
		if (await subscribe(email)) {
			setEmail("");
		}
	}

	if (status === "success") {
		return (
			<Muted className="fade-in slide-in-from-bottom-1 animate-in text-sm text-success duration-300 ease-out motion-reduce:animate-none">
				{success}
			</Muted>
		);
	}

	return (
		<form className="flex flex-wrap gap-2" onSubmit={handleSubscribe}>
			<Input
				aria-label={placeholder}
				className="h-10 pointer-coarse:h-11 min-w-0 flex-1 rounded-sm pointer-coarse:text-base text-sm"
				onChange={(e) => setEmail(e.target.value)}
				placeholder={placeholder}
				required
				type="email"
				value={email}
			/>
			<Button
				className="h-10 pointer-coarse:h-11 rounded-sm px-4 text-sm"
				disabled={status === "loading"}
				size="sm"
				type="submit"
				variant="outline"
			>
				{buttonLabel}
			</Button>
			{status === "error" && (
				<Muted className="fade-in slide-in-from-bottom-1 w-full animate-in text-destructive text-sm duration-300 ease-out motion-reduce:animate-none">
					{error}
				</Muted>
			)}
		</form>
	);
}
