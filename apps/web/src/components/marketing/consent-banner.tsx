"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { actionVariants } from "@/components/marketing/action";
import { Link } from "@/i18n/navigation";
import { getPostHog } from "@/lib/posthog-client";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "webvise-consent-v1";

type ConsentChoice = "granted" | "denied";

type GtagFn = (...args: unknown[]) => void;

function updateConsent(choice: ConsentChoice) {
	if (typeof window === "undefined") {
		return;
	}
	const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
	if (typeof gtag !== "function") {
		return;
	}
	gtag("consent", "update", {
		analytics_storage: choice === "granted" ? "granted" : "denied",
		ad_storage: choice === "granted" ? "granted" : "denied",
		ad_user_data: choice === "granted" ? "granted" : "denied",
		ad_personalization: choice === "granted" ? "granted" : "denied",
	});
}

function persistChoice(choice: ConsentChoice) {
	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ choice, ts: Date.now() })
		);
	} catch {
		// ignore (Safari private mode etc.)
	}
}

export function ConsentBanner() {
	const t = useTranslations("consent");
	const [visible, setVisible] = useState(false);
	const [closing, setClosing] = useState(false);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				setVisible(true);
			}
		} catch {
			setVisible(true);
		}
	}, []);

	if (!visible) {
		return null;
	}

	function dismiss() {
		setClosing(true);
		window.setTimeout(() => setVisible(false), 300);
	}

	function handleAccept() {
		updateConsent("granted");
		persistChoice("granted");
		getPostHog().then((posthog) => {
			posthog?.set_config({ persistence: "localStorage+cookie" });
			posthog?.opt_in_capturing();
			posthog?.capture("consent_accepted");
		});
		dismiss();
	}

	function handleDecline() {
		updateConsent("denied");
		persistChoice("denied");
		getPostHog().then((posthog) => posthog?.opt_out_capturing());
		dismiss();
	}

	return (
		<div
			aria-label={t("ariaLabel")}
			aria-live="polite"
			className={cn(
				"fixed inset-x-0 bottom-0 z-[45] px-4 pb-4 motion-reduce:animate-none md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:w-[380px] md:px-0 md:pb-0",
				closing
					? "fade-out slide-out-to-bottom-4 pointer-events-none animate-out fill-mode-forwards duration-300 ease-in"
					: "slide-in-from-bottom-4 fade-in animate-in duration-500 ease-out"
			)}
			role="dialog"
		>
			<div className="rounded-[10px] bg-card p-5 shadow-[0_8px_30px_oklch(0.18_0.012_250/12%)]">
				<p className="font-medium text-base text-foreground">{t("title")}</p>
				<p className="mt-1.5 text-muted-foreground text-sm leading-6">
					{t("body")}{" "}
					<Link
						className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors duration-150 hover:decoration-foreground focus-visible:decoration-foreground"
						href="/privacy"
					>
						{t("privacyLink")}
					</Link>
					.
				</p>
				<div className="mt-4 grid grid-cols-2 gap-2">
					<button
						className={actionVariants({ variant: "quiet", size: "md" })}
						onClick={handleDecline}
						type="button"
					>
						{t("decline")}
					</button>
					<button
						className={actionVariants({ variant: "ink", size: "md" })}
						onClick={handleAccept}
						type="button"
					>
						{t("accept")}
					</button>
				</div>
			</div>
		</div>
	);
}
