"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { hasAnalyticsConsent } from "@/lib/consent";

const GA_ID = "G-D5466MRK51";

/** Loads the Google tag only after the visitor has accepted analytics. */
export function GoogleAnalytics() {
	const [granted, setGranted] = useState(false);

	useEffect(() => {
		setGranted(hasAnalyticsConsent());
		function onConsent(event: Event) {
			setGranted((event as CustomEvent<string>).detail === "granted");
		}
		window.addEventListener("webvise:consent", onConsent);
		return () => window.removeEventListener("webvise:consent", onConsent);
	}, []);

	if (!granted) {
		return null;
	}

	return (
		<>
			<Script id="gtag-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					window.gtag = gtag;
					gtag('consent', 'default', {
						analytics_storage: 'granted',
						ad_storage: 'granted',
						ad_user_data: 'granted',
						ad_personalization: 'granted',
					});
					gtag('js', new Date());
					gtag('config', '${GA_ID}');
				`}
			</Script>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
				strategy="afterInteractive"
			/>
		</>
	);
}
