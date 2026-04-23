"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "webvise-consent-v1";

type ConsentChoice = "granted" | "denied";

type GtagFn = (...args: unknown[]) => void;

function updateConsent(choice: ConsentChoice) {
	if (typeof window === "undefined") return;
	const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
	if (typeof gtag !== "function") return;
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
			JSON.stringify({ choice, ts: Date.now() }),
		);
	} catch {
		// ignore (Safari private mode etc.)
	}
}

export function ConsentBanner() {
	const t = useTranslations("consent");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (!stored) setVisible(true);
		} catch {
			setVisible(true);
		}
	}, []);

	if (!visible) return null;

	function handleAccept() {
		updateConsent("granted");
		persistChoice("granted");
		setVisible(false);
	}

	function handleDecline() {
		updateConsent("denied");
		persistChoice("denied");
		setVisible(false);
	}

	return (
		<div
			role="dialog"
			aria-live="polite"
			aria-label={t("ariaLabel")}
			className="slide-in-from-bottom-2 fixed inset-x-0 bottom-0 z-30 animate-in border-border border-t bg-background shadow-lg duration-300 ease-out"
		>
			<div className="mx-auto flex max-w-[1320px] flex-col items-start gap-4 px-4 py-5 pr-20 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-5 md:pr-24">
				<p className="text-foreground text-sm leading-relaxed">
					{t("body")}{" "}
					<Link
						href="/privacy"
						className="font-medium underline underline-offset-4 transition-colors hover:text-brand"
					>
						{t("privacyLink")}
					</Link>
					.
				</p>
				<div className="flex shrink-0 items-center gap-2">
					<Button
						size="lg"
						onClick={handleAccept}
						nativeButton
						className="border-transparent bg-brand px-6 text-white [&]:hover:bg-brand/80"
					>
						{t("accept")}
					</Button>
					<Button
						size="lg"
						variant="ghost"
						onClick={handleDecline}
						nativeButton
						className="text-muted-foreground"
					>
						{t("decline")}
					</Button>
				</div>
			</div>
		</div>
	);
}
