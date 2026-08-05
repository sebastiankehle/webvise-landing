"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { track } from "@/lib/track";
import { trpcClient } from "@/utils/trpc";

export type NewsletterPlacement = "footer" | "blog_article";

export function useNewsletterSubscribe(placement: NewsletterPlacement) {
	const path = usePathname();
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	async function subscribe(email: string): Promise<boolean> {
		if (!email.trim()) {
			return false;
		}

		setStatus("loading");
		track("newsletter_signup", { location: placement, path });

		try {
			await trpcClient.newsletter.subscribe.mutate({
				email: email.trim(),
				placement,
				path,
			});
			setStatus("success");
			track("newsletter_success", { location: placement, path });
			return true;
		} catch {
			setStatus("error");
			track("newsletter_error", {
				location: placement,
				path,
				reason: "server_error",
			});
			return false;
		}
	}

	return { status, subscribe };
}
