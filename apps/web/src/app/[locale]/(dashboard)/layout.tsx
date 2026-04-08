"use client";

import DashboardProviders from "@/components/dashboard/dashboard-providers";
import Header from "@/components/dashboard/header";

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
		</DashboardProviders>
	);
}
