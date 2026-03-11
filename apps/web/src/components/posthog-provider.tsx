"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if (POSTHOG_KEY && IS_PRODUCTION) {
			posthog.init(POSTHOG_KEY, {
				api_host: POSTHOG_HOST,
				capture_pageview: false,
				capture_pageleave: true,
			});
		}
	}, []);

	if (!POSTHOG_KEY || !IS_PRODUCTION) {
		return <>{children}</>;
	}

	return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function PostHogPageView() {
	const posthog = usePostHog();

	useEffect(() => {
		const url = window.location.href;
		posthog?.capture("$pageview", { $current_url: url });
	}, [posthog]);

	return null;
}
