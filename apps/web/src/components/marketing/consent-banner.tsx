"use client";

import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { inlineLinkClassName } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
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
		posthog.set_config({ persistence: "localStorage+cookie" });
		posthog.opt_in_capturing();
		posthog.capture("consent_accepted");
		dismiss();
	}

	function handleDecline() {
		updateConsent("denied");
		persistChoice("denied");
		posthog.opt_out_capturing();
		dismiss();
	}

	return (
		<div
			aria-label={t("ariaLabel")}
			aria-live="polite"
			className={cn(
				"fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 motion-reduce:animate-none md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:max-w-[420px] md:px-0 md:pb-0",
				closing
					? "fade-out slide-out-to-bottom-4 pointer-events-none animate-out fill-mode-forwards duration-300 ease-in"
					: "slide-in-from-bottom-4 fade-in animate-in duration-500 ease-out"
			)}
			role="dialog"
		>
			<div className="relative bg-background ring-1 ring-foreground/10">
				<div className="h-px bg-brand" />
				<div className="p-6 md:p-7">
					<Cookie
						className="h-5 w-5 shrink-0 text-brand-icon"
						strokeWidth={1.5}
					/>
					<p className="mt-5 font-medium text-foreground text-sm">
						{t("title")}
					</p>
					<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
						{t("body")}{" "}
						<Link className={inlineLinkClassName} href="/privacy">
							{t("privacyLink")}
						</Link>
						.
					</p>

					<div className="mt-6 flex items-center gap-2">
						<Button
							className="flex-1 px-5"
							nativeButton
							onClick={handleAccept}
							size="lg"
							variant="brand"
						>
							{t("accept")}
						</Button>
						<Button
							className="flex-1"
							nativeButton
							onClick={handleDecline}
							size="lg"
							variant="outline"
						>
							{t("decline")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
