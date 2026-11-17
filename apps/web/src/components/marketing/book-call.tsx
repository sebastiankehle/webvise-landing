"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { track } from "@/lib/track";

const CAL_NAMESPACE = "book";
const CAL_LINK = "webvise/30min";

/** The one way to the discovery call: pick a time in the calendar. */
export default function BookCall() {
	const t = useTranslations("book");
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		(async () => {
			const cal = await getCalApi({ namespace: CAL_NAMESPACE });
			cal("ui", { hideEventTypeDetails: false });
			cal("on", {
				action: "bookingSuccessful",
				callback: () => track("book_call_booked"),
			});
		})();
	}, []);

	return (
		<section
			aria-label={t("calendar.title")}
			className="surface-card p-6 md:p-10"
		>
			<p className="text-base text-foreground/75">{t("calendar.subtitle")}</p>
			<div className="mt-7 min-h-[620px] overflow-hidden rounded-[10px] bg-card">
				<Cal
					calLink={CAL_LINK}
					config={{
						layout: "month_view",
						theme: resolvedTheme === "dark" ? "dark" : "light",
					}}
					namespace={CAL_NAMESPACE}
					style={{ width: "100%", height: "100%" }}
				/>
			</div>
		</section>
	);
}
