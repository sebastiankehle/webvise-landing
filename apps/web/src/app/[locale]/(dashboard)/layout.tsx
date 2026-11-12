"use client";

import DashboardProviders from "@/components/dashboard/dashboard-providers";
import Header from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DashboardProviders>
			<div className="grid h-svh grid-rows-[auto_1fr]">
				<Header />
				{children}
			</div>
			{/* Only the sign-in form fires toasts, so the toaster lives here and
			    stays out of the marketing pages' first load. */}
			<Toaster richColors />
		</DashboardProviders>
	);
}
