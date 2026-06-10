import { auth } from "@webvise-app/auth";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { Body, H1 } from "@/components/ui/typography";
import { redirect } from "@/i18n/navigation";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		const locale = await getLocale();
		return redirect({ href: "/login", locale });
	}

	return (
		<div>
			<H1 className="text-3xl md:text-3xl">Dashboard</H1>
			<Body className="mt-2">Welcome {session.user.name}</Body>
		</div>
	);
}
