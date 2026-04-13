"use client";

import { useQuery } from "@tanstack/react-query";

import { Body } from "@/components/ui/typography";
import { trpc } from "@/utils/trpc";

export default function PrivateData() {
	const privateData = useQuery(trpc.privateData.queryOptions());

	return <Body>API: {privateData.data?.message}</Body>;
}
