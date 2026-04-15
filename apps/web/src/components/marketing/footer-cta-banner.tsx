"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H2, Lead, Muted } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/track";
import { TrackClick } from "@/components/marketing/track-click";

interface FooterCtaBannerProps {
	headline: string;
	subtext: string;
	buttonText: string;
	newsletter?: {
		divider: string;
		placeholder: string;
		buttonLabel: string;
		success: string;
		error: string;
	};
}

export default function FooterCtaBanner({
	headline,
	subtext,
	buttonText,
	newsletter,
}: FooterCtaBannerProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	async function handleSubscribe(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) return;

		setStatus("loading");
		track("newsletter_signup", { location: "blog-cta" });

		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim() }),
			});

			if (res.ok) {
				setStatus("success");
				track("newsletter_success", { location: "blog-cta" });
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

	return (
		<div className="border-[--border] border-b">
			<div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center md:py-24">
				<div>
					<H2>{headline}</H2>
					<Lead className="mt-4 max-w-[480px]">{subtext}</Lead>
				</div>
				<div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
					<TrackClick event="cta_clicked" properties={{ location: "footer", variant: "primary", destination: "contact" }}>
						<Button
							size="lg"
							className="[a]:hover:!bg-brand/80 border-transparent bg-brand px-8 text-white"
							render={<Link href={{ pathname: "/", hash: "contact" }} />}
						>
							{buttonText}
						</Button>
					</TrackClick>
					{newsletter && status !== "success" && (
						<form onSubmit={handleSubscribe} className="flex w-full flex-col items-start gap-2 md:items-end">
							<Muted className="text-xs">{newsletter.divider}</Muted>
							<div className="flex gap-2">
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={newsletter.placeholder}
									required
									className="h-9 w-52 text-sm"
								/>
								<Button
									type="submit"
									size="sm"
									variant="outline"
									disabled={status === "loading"}
									className="h-9"
								>
									{newsletter.buttonLabel}
								</Button>
							</div>
							{status === "error" && (
								<Muted className="text-xs text-destructive">{newsletter.error}</Muted>
							)}
						</form>
					)}
					{newsletter && status === "success" && (
						<Muted className="text-xs text-green-600">{newsletter.success}</Muted>
					)}
				</div>
			</div>
		</div>
	);
}
