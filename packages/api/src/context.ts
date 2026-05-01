import { auth } from "@webvise-app/auth";
import type { NextRequest } from "next/server";
import { getClientIPFromHeaders } from "./rate-limit";

export async function createContext(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	return {
		session,
		ip: getClientIPFromHeaders(req.headers),
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
