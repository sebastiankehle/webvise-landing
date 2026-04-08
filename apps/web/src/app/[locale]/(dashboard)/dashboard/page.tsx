import { auth } from "@webvise-app/auth";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

import PrivateData from "./private-data";

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
			<h1>Dashboard</h1>
			<p>Welcome {session.user.name}</p>
			<PrivateData />
		</div>
	);
}
